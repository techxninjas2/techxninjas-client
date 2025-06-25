import { supabase } from '../lib/supabaseClient';

export interface ArticleInteractionResponse {
  success: boolean;
  message?: string;
  error?: string;
  like_count: number;
  comment_count: number;
  interaction_id?: string;
  comment?: {
    id: string;
    text: string;
    user_name: string;
    user_avatar?: string;
    created_at: string;
  };
}

export interface UserInteractionStatus {
  has_liked: boolean;
  user_comments: Array<{
    id: string;
    text: string;
    created_at: string;
  }>;
  article_counts: {
    likes_count: number;
    comments_count: number;
  };
}

/**
 * Add a like to an article
 * Validates user authentication and prevents duplicate likes
 */
const addArticleLike = async (articleId: string): Promise<ArticleInteractionResponse> => {
  try {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: 'User not authenticated',
        like_count: 0,
        comment_count: 0
      };
    }

    // Call the database function
    const { data, error } = await supabase.rpc('add_article_like', {
      p_article_id: articleId
    });

    if (error) {
      console.error('Error adding like:', error);
      return {
        success: false,
        error: error.message || 'Failed to add like',
        like_count: 0,
        comment_count: 0
      };
    }

    return data as ArticleInteractionResponse;
  } catch (error: any) {
    console.error('Error in addArticleLike:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      like_count: 0,
      comment_count: 0
    };
  }
};

/**
 * Remove a like from an article
 */
const removeArticleLike = async (articleId: string): Promise<ArticleInteractionResponse> => {
  try {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: 'User not authenticated',
        like_count: 0,
        comment_count: 0
      };
    }

    // Call the database function
    const { data, error } = await supabase.rpc('remove_article_like', {
      p_article_id: articleId
    });

    if (error) {
      console.error('Error removing like:', error);
      return {
        success: false,
        error: error.message || 'Failed to remove like',
        like_count: 0,
        comment_count: 0
      };
    }

    return data as ArticleInteractionResponse;
  } catch (error: any) {
    console.error('Error in removeArticleLike:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      like_count: 0,
      comment_count: 0
    };
  }
};

/**
 * Add a comment to an article
 * Sanitizes comment text and validates user authentication
 */
export const addArticleComment = async (
  articleId: string, 
  commentText: string
): Promise<ArticleInteractionResponse> => {
  try {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: 'User not authenticated',
        like_count: 0,
        comment_count: 0
      };
    }

    // Basic client-side validation
    if (!commentText || commentText.trim().length === 0) {
      return {
        success: false,
        error: 'Comment text cannot be empty',
        like_count: 0,
        comment_count: 0
      };
    }

    if (commentText.trim().length > 1000) {
      return {
        success: false,
        error: 'Comment text cannot exceed 1000 characters',
        like_count: 0,
        comment_count: 0
      };
    }

    // Call the database function
    const { data, error } = await supabase.rpc('add_article_comment', {
      p_article_id: articleId,
      p_comment_text: commentText.trim()
    });

    if (error) {
      console.error('Error adding comment:', error);
      return {
        success: false,
        error: error.message || 'Failed to add comment',
        like_count: 0,
        comment_count: 0
      };
    }

    return data as ArticleInteractionResponse;
  } catch (error: any) {
    console.error('Error in addArticleComment:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      like_count: 0,
      comment_count: 0
    };
  }
};

/**
 * Get user's interaction status with an article
 * Returns whether user has liked the article and their comments
 */
export const getUserArticleInteractions = async (articleId: string): Promise<UserInteractionStatus> => {
  try {
    // Call the database function
    const { data, error } = await supabase.rpc('get_user_article_interactions', {
      p_article_id: articleId
    });

    if (error) {
      console.error('Error getting user interactions:', error);
      return {
        has_liked: false,
        user_comments: [],
        article_counts: {
          likes_count: 0,
          comments_count: 0
        }
      };
    }

    return data as UserInteractionStatus;
  } catch (error: any) {
    console.error('Error in getUserArticleInteractions:', error);
    return {
      has_liked: false,
      user_comments: [],
      article_counts: {
        likes_count: 0,
        comments_count: 0
      }
    };
  }
};

/**
 * Toggle like status for an article
 * Convenience function that adds or removes like based on current status
 */
export const toggleArticleLike = async (articleId: string): Promise<ArticleInteractionResponse> => {
  try {
    // First check current status
    const userInteractions = await getUserArticleInteractions(articleId);
    
    if (userInteractions.has_liked) {
      // Remove like
      return await removeArticleLike(articleId);
    } else {
      // Add like
      return await addArticleLike(articleId);
    }
  } catch (error: any) {
    console.error('Error in toggleArticleLike:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      like_count: 0,
      comment_count: 0
    };
  }
};

/**
 * Get article interaction statistics
 * Returns total likes and comments for an article
 */
const getArticleInteractionStats = async (articleId: string): Promise<{
  likes_count: number;
  comments_count: number;
}> => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('likes_count, comments_count')
      .eq('id', articleId)
      .single();

    if (error) {
      console.error('Error getting article stats:', error);
      return { likes_count: 0, comments_count: 0 };
    }

    return {
      likes_count: data.likes_count || 0,
      comments_count: data.comments_count || 0
    };
  } catch (error: any) {
    console.error('Error in getArticleInteractionStats:', error);
    return { likes_count: 0, comments_count: 0 };
  }
};