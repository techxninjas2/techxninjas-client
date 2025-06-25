import { supabase } from '../lib/supabaseClient';
import { Article, ArticleStatus, ArticleCategory, ArticleComment, ArticleLike } from '../types';

export const getArticles = async (
  category?: ArticleCategory,
  featured?: boolean,
  limit: number = 20,
  offset: number = 0
): Promise<Article[]> => {
  let query = supabase
    .from('articles')
    .select('*')
    .eq('status', ArticleStatus.PUBLISHED)
    .order('published_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  if (featured) {
    query = query.eq('is_featured', true);
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }

  return data as Article[];
};

export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', ArticleStatus.PUBLISHED)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching article:', error);
    throw error;
  }

  if (data) {
    await incrementArticleViews(data.id);
  }

  return data as Article | null;
};

export const getFeaturedArticles = async (limit: number = 6): Promise<Article[]> => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', ArticleStatus.PUBLISHED)
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured articles:', error);
    throw error;
  }

  return data as Article[];
};

export const searchArticles = async (query: string): Promise<Article[]> => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', ArticleStatus.PUBLISHED)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%,tags.cs.{${query}}`)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error searching articles:', error);
    throw error;
  }

  return data as Article[];
};

export const getRelatedArticles = async (articleId: string, category: ArticleCategory, tags: string[], limit: number = 4): Promise<Article[]> => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', ArticleStatus.PUBLISHED)
    .neq('id', articleId)
    .or(`category.eq.${category},tags.ov.{${tags.join(',')}}`)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching related articles:', error);
    throw error;
  }

  return data as Article[];
};

const incrementArticleViews = async (articleId: string): Promise<void> => {
  const { error } = await supabase.rpc('increment_article_views', {
    article_id: articleId
  });

  if (error) {
    console.error('Error incrementing article views:', error);
  }
};

const likeArticle = async (articleId: string): Promise<void> => {
  const { error } = await supabase
    .from('article_likes')
    .insert({ article_id: articleId });

  if (error) {
    console.error('Error liking article:', error);
    throw error;
  }
};

const unlikeArticle = async (articleId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('article_likes')
    .delete()
    .eq('article_id', articleId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error unliking article:', error);
    throw error;
  }
};

const checkUserLike = async (articleId: string, userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('article_likes')
    .select('id')
    .eq('article_id', articleId)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking user like:', error);
    return false;
  }

  return !!data;
};

const getArticleComments = async (articleId: string): Promise<ArticleComment[]> => {
  const { data, error } = await supabase
    .from('article_comments')
    .select(`
      *,
      profiles:user_id (
        username
      )
    `)
    .eq('article_id', articleId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching article comments:', error);
    throw error;
  }

  // Map the data to ensure user_name is properly set from the profiles username
  const mappedData = data?.map(comment => ({
    ...comment,
    user_name: comment.user_name || comment.profiles?.username || 'Anonymous'
  })) || [];

  return mappedData as ArticleComment[];
};

const addComment = async (articleId: string, content: string): Promise<ArticleComment> => {
  const { data, error } = await supabase
    .from('article_comments')
    .insert({
      article_id: articleId,
      content
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding comment:', error);
    throw error;
  }

  return data as ArticleComment;
};