import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, Eye, Heart, MessageCircle, User, Calendar, Tag, TrendingUp, BookOpen, X } from 'lucide-react';
import { getArticles, getFeaturedArticles, searchArticles } from '../../services/articleService';
import { Article, ArticleCategory } from '../../types';
import usePageTitle from '../usePageTitle';
import CodingBackground from '../CodingBackground';
import RevealOnScroll from '../RevealOnScroll';

const ArticleCard: React.FC<{ article: Article; featured?: boolean }> = ({ article, featured = false }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const cardClasses = featured 
    ? "bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95"
    : "bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95";

  const imageClasses = featured 
    ? "w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
    : "w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300";

  return (
    <article className={cardClasses}>
      <div className="relative overflow-hidden">
        <img 
          src={article.featured_image || `https://picsum.photos/seed/${article.id}/800/400`} 
          alt={article.title} 
          className={imageClasses}
        />
        {article.is_featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              Featured
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="bg-black bg-opacity-60 text-white text-xs font-medium px-2 py-1 rounded-full">
            {article.category}
          </span>
        </div>
      </div>

      <div className={`p-4 ${featured ? 'sm:p-6' : 'sm:p-5'}`}>
        <div className="flex items-center space-x-3 mb-3">
          <img 
            src={article.author_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author_name)}&background=random&color=fff&size=32`}
            alt={article.author_name}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {article.author_name}
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(article.published_at || article.created_at)}</span>
              <span>•</span>
              <Clock className="w-3 h-3" />
              <span>{article.read_time} min read</span>
            </div>
          </div>
        </div>

        <Link to={`/articles/${article.slug}`} className="block group">
          <h2 className={`font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-primary dark:group-hover:text-brand-ninja-gold transition-colors line-clamp-2 ${featured ? 'text-xl sm:text-2xl' : 'text-lg'}`}>
            {article.title}
          </h2>
          
          {article.subtitle && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-1">
              {article.subtitle}
            </p>
          )}
          
          <p className={`text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 ${featured ? 'text-base' : 'text-sm'}`}>
            {article.excerpt}
          </p>
        </Link>

        <div className="flex flex-wrap gap-1 mb-4">
          {article.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-brand-primary bg-opacity-10 text-brand-primary dark:bg-brand-ninja-gold dark:bg-opacity-10 dark:text-brand-ninja-gold text-xs font-medium px-2 py-1 rounded-full flex items-center"
            >
              <Tag className="w-2.5 h-2.5 mr-1" />
              {tag}
            </span>
          ))}
          {article.tags.length > 3 && (
            <span className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 text-xs font-medium px-2 py-1 rounded-full">
              +{article.tags.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{article.views_count.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{article.likes_count}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{article.comments_count}</span>
            </div>
          </div>
          
          <Link
            to={`/articles/${article.slug}`}
            className="text-brand-primary hover:text-brand-ninja-gold dark:text-brand-ninja-gold dark:hover:text-brand-primary font-medium transition-colors"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
};

const ArticlesPage: React.FC = () => {
  usePageTitle("Articles");
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadArticles();
  }, [selectedCategory]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [articlesData, featuredData] = await Promise.all([
        getArticles(selectedCategory === 'all' ? undefined : selectedCategory),
        getFeaturedArticles(3)
      ]);
      
      setArticles(articlesData);
      setFeaturedArticles(featuredData);
    } catch (err: any) {
      console.error('Failed to load articles:', err);
      setError(err.message || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadArticles();
      return;
    }

    try {
      setLoading(true);
      const searchResults = await searchArticles(searchTerm);
      setArticles(searchResults);
    } catch (err: any) {
      console.error('Search failed:', err);
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    loadArticles();
  };

  const hasActiveFilters = selectedCategory !== 'all' || searchTerm !== '';

  if (loading && articles.length === 0) {
    return (
      <div className="relative min-h-screen bg-gray-50 dark:bg-brand-dark-gray">
        <CodingBackground 
          intensity="low" 
          style="code"
          className="absolute inset-0"
        />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-brand-dark-gray">
      <CodingBackground 
        intensity="low" 
        style="code"
        className="absolute inset-0"
      />
      <div className="container mx-auto px-4 py-6 sm:py-8 relative z-10">
        <RevealOnScroll direction="up" duration={800}>
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark-gray dark:text-white mb-4">
              Tech Articles & Insights
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Discover the latest in technology, programming tutorials, career advice, and industry insights from our community of experts and enthusiasts.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll direction="up" delay={300} duration={800}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <button
                onClick={handleSearch}
                className="px-4 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-brand-ninja-gold transition-colors text-sm font-medium"
              >
                Search
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2.5 text-sm border rounded-lg transition-colors ${
                  showFilters || hasActiveFilters
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2.5 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as ArticleCategory | 'all')}
                    className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Categories</option>
                    {Object.values(ArticleCategory).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </RevealOnScroll>

        {error && (
          <RevealOnScroll direction="up" delay={400} duration={800}>
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-8">
              <p className="font-semibold text-sm">Error loading articles:</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={loadArticles}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm"
              >
                Try Again
              </button>
            </div>
          </RevealOnScroll>
        )}

        {featuredArticles.length > 0 && !searchTerm && (
          <section className="mb-12">
            <RevealOnScroll direction="up" delay={500} duration={800}>
              <div className="flex items-center mb-6">
                <TrendingUp className="w-6 h-6 text-brand-primary dark:text-brand-ninja-gold mr-2" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Articles</h2>
              </div>
            </RevealOnScroll>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {featuredArticles.map((article, index) => (
                <RevealOnScroll key={article.id} direction="up" delay={600 + index * 150} duration={800}>
                  <ArticleCard article={article} featured />
                </RevealOnScroll>
              ))}
            </div>
          </section>
        )}

        <section>
          <RevealOnScroll direction="up" delay={700} duration={800}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <BookOpen className="w-6 h-6 text-brand-primary dark:text-brand-ninja-gold mr-2" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {searchTerm ? 'Search Results' : selectedCategory === 'all' ? 'Latest Articles' : `${selectedCategory} Articles`}
                </h2>
              </div>
              {articles.length > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {articles.length} article{articles.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </RevealOnScroll>

          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {articles.map((article, index) => (
                <RevealOnScroll key={article.id} direction="up" delay={800 + index * 100} duration={800}>
                  <ArticleCard article={article} />
                </RevealOnScroll>
              ))}
            </div>
          ) : (
            <RevealOnScroll direction="up" delay={800} duration={800}>
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No articles found
                </h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-500">
                  {searchTerm || selectedCategory !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Check back soon for new articles!'}
                </p>
              </div>
            </RevealOnScroll>
          )}
        </section>
      </div>
    </div>
  );
};

export default ArticlesPage;