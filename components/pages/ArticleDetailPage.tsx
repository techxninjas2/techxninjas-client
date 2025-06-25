import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Copy, 
  Twitter, 
  Linkedin, 
  User,
  Tag,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { getArticleBySlug, getRelatedArticles } from '../../services/articleService';
import { 
  getUserArticleInteractions, 
  toggleArticleLike, 
  addArticleComment,
  type ArticleInteractionResponse,
  type UserInteractionStatus
} from '../../services/articleInteractionService';
import { 
  startViewTracking, 
  stopViewTracking, 
  getViewTrackingStatus,
  cleanupViewTracking 
} from '../../services/viewTrackingService';
import { Article, ArticleComment } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import usePageTitle from '../usePageTitle';

const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Interaction states
  const [userInteractions, setUserInteractions] = useState<UserInteractionStatus>({
    has_liked: false,
    user_comments: [],
    article_counts: { likes_count: 0, comments_count: 0 }
  });
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isTogglingLike, setIsTogglingLike] = useState(false);

  // View tracking states
  const [viewTrackingStatus, setViewTrackingStatus] = useState({
    isTracking: false,
    timeElapsed: 0,
    isTracked: false
  });

  usePageTitle(article?.title || "Article");

  useEffect(() => {
    if (slug) {
      loadArticleDetails();
    }
  }, [slug, user]);

  // View tracking effect
  useEffect(() => {
    if (article?.id) {
      // Start view tracking when article loads
      startViewTracking(article.id);
      
      // Update tracking status every second
      const statusInterval = setInterval(() => {
        const status = getViewTrackingStatus(article.id);
        setViewTrackingStatus(status);
      }, 1000);

      // Cleanup on unmount or article change
      return () => {
        clearInterval(statusInterval);
        stopViewTracking(article.id);
      };
    }
  }, [article?.id]);

  // Global cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanupViewTracking();
    };
  }, []);

  const loadArticleDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!slug) {
        setError('Article not found');
        return;
      }

      const articleData = await getArticleBySlug(slug);
      if (!articleData) {
        setError('Article not found');
        return;
      }

      setArticle(articleData);

      const [relatedData, userInteractionsData] = await Promise.all([
        getRelatedArticles(articleData.id, articleData.category, articleData.tags),
        getUserArticleInteractions(articleData.id)
      ]);

      setRelatedArticles(relatedData);
      setUserInteractions(userInteractionsData);

      // Load comments from the existing article_comments table
      const { data: commentsData, error: commentsError } = await supabase
        .from('article_comments')
        .select('*')
        .eq('article_id', articleData.id)
        .order('created_at', { ascending: false });

      if (!commentsError && commentsData) {
        setComments(commentsData);
      }
    } catch (err: any) {
      console.error('Failed to load article details:', err);
      setError(err.message || 'Failed to load article details');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user || !article || isTogglingLike) return;

    setIsTogglingLike(true);
    try {
      const response: ArticleInteractionResponse = await toggleArticleLike(article.id);
      
      if (response.success) {
        // Update local state with new counts
        setUserInteractions(prev => ({
          ...prev,
          has_liked: !prev.has_liked,
          article_counts: {
            likes_count: response.like_count,
            comments_count: response.comment_count
          }
        }));

        // Update article state for immediate UI feedback
        setArticle(prev => prev ? {
          ...prev,
          likes_count: response.like_count,
          comments_count: response.comment_count
        } : null);
      } else {
        console.error('Failed to toggle like:', response.error);
        // Optionally show user-friendly error message
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsTogglingLike(false);
    }
  };

  const handleAddComment = async () => {
    if (!user || !article || !newComment.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const response: ArticleInteractionResponse = await addArticleComment(
        article.id, 
        newComment.trim()
      );
      
      if (response.success && response.comment) {
        // Add new comment to local state
        const newCommentObj: ArticleComment = {
          id: response.comment.id,
          article_id: article.id,
          user_id: user.id,
          user_name: response.comment.user_name,
          user_avatar: response.comment.user_avatar,
          content: response.comment.text,
          likes_count: 0,
          created_at: response.comment.created_at,
          updated_at: response.comment.created_at
        };

        setComments(prev => [newCommentObj, ...prev]);
        
        // Update interaction counts
        setUserInteractions(prev => ({
          ...prev,
          article_counts: {
            likes_count: response.like_count,
            comments_count: response.comment_count
          }
        }));

        // Update article state
        setArticle(prev => prev ? {
          ...prev,
          likes_count: response.like_count,
          comments_count: response.comment_count
        } : null);

        // Clear comment input
        setNewComment('');
      } else {
        console.error('Failed to add comment:', response.error);
        // Optionally show user-friendly error message
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const shareArticle = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatViewTrackingTime = (timeElapsed: number) => {
    const seconds = Math.floor(timeElapsed / 1000);
    const remainingSeconds = Math.max(0, 60 - seconds);
    return remainingSeconds;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-brand-dark-gray">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white dark:bg-brand-dark-gray">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Article Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'The article you are looking for does not exist.'}</p>
            <Link
              to="/articles"
              className="bg-brand-primary hover:bg-brand-ninja-gold text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
            >
              Back to Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark-gray">
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-brand-primary hover:text-brand-ninja-gold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Articles
        </button>

        {/* View Tracking Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">View Tracking Status (Dev Only)</h4>
            <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <p>Tracking: {viewTrackingStatus.isTracking ? 'Active' : 'Inactive'}</p>
              <p>Time Elapsed: {Math.floor(viewTrackingStatus.timeElapsed / 1000)}s</p>
              <p>View Recorded: {viewTrackingStatus.isTracked ? 'Yes' : 'No'}</p>
              {viewTrackingStatus.isTracking && !viewTrackingStatus.isTracked && (
                <p>Time until view counts: {formatViewTrackingTime(viewTrackingStatus.timeElapsed)}s</p>
              )}
            </div>
          </div>
        )}

        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            {article.is_featured && (
              <div className="mb-4">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full flex items-center w-fit">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Featured Article
                </span>
              </div>
            )}

            <div className="mb-4">
              <span className="bg-brand-primary bg-opacity-10 text-brand-primary dark:bg-brand-ninja-gold dark:bg-opacity-10 dark:text-brand-ninja-gold text-sm font-medium px-3 py-1 rounded-full">
                {article.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {article.title}
            </h1>

            {article.subtitle && (
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {article.subtitle}
              </p>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <img 
                  src={article.author_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author_name)}&background=random&color=fff&size=48`}
                  alt={article.author_name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{article.author_name}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.published_at || article.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{article.read_time} min read</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{article.views_count.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{userInteractions.article_counts.likes_count}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{userInteractions.article_counts.comments_count}</span>
                </div>
              </div>
            </div>

            {article.featured_image && (
              <div className="mb-8">
                <img 
                  src={article.featured_image} 
                  alt={article.title}
                  className="w-full h-64 sm:h-96 object-cover rounded-xl shadow-lg"
                />
              </div>
            )}
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-sm font-medium px-3 py-1 rounded-full flex items-center"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between py-6 border-t border-b border-gray-200 dark:border-gray-700 mb-8">
                <div className="flex items-center space-x-4">
                  {user ? (
                    <button
                      onClick={handleLike}
                      disabled={isTogglingLike}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        userInteractions.has_liked 
                          ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300' 
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      } ${isTogglingLike ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Heart className={`w-5 h-5 ${userInteractions.has_liked ? 'fill-current' : ''}`} />
                      <span>{userInteractions.article_counts.likes_count}</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                      <Heart className="w-5 h-5" />
                      <span>{userInteractions.article_counts.likes_count}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                    className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                    className="p-2 text-gray-400 hover:text-blue-700 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={shareArticle}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied!');
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <section className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Comments ({userInteractions.article_counts.comments_count})
                </h3>
                
                {user ? (
                  <div className="mb-6">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      rows={4}
                      maxLength={1000}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:text-white"
                    />
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {newComment.length}/1000 characters
                      </span>
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || isSubmittingComment}
                        className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-ninja-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                    <p className="text-gray-600 dark:text-gray-400">Please log in to leave a comment</p>
                  </div>
                )}

                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <img 
                          src={comment.user_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user_name)}&background=random&color=fff&size=32`}
                          alt={comment.user_name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{comment.user_name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(comment.created_at)}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <img 
                      src={article.author_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author_name)}&background=random&color=fff&size=48`}
                      alt={article.author_name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{article.author_name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Author</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tech enthusiast and writer sharing insights about the latest in technology and programming.
                  </p>
                </div>

                {relatedArticles.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Related Articles</h4>
                    <div className="space-y-4">
                      {relatedArticles.map((relatedArticle) => (
                        <Link
                          key={relatedArticle.id}
                          to={`/articles/${relatedArticle.slug}`}
                          className="block group"
                        >
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-brand-primary dark:group-hover:text-brand-ninja-gold transition-colors line-clamp-2 mb-1">
                            {relatedArticle.title}
                          </h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {relatedArticle.read_time} min read
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticleDetailPage;