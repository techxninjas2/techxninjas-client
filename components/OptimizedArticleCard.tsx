import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Eye, Heart, MessageCircle, User, Tag, TrendingUp } from 'lucide-react';
import { Article } from '../types';
import LazyImage from './LazyImage';
import { getOptimizedImageUrl } from '../utils/imageOptimization';

interface OptimizedArticleCardProps {
  article: Article;
  featured?: boolean;
}

const OptimizedArticleCard: React.FC<OptimizedArticleCardProps> = memo(({ article, featured = false }) => {
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
    ? "w-full h-64 sm:h-80 group-hover:scale-105 transition-transform duration-300"
    : "w-full h-48 sm:h-56 group-hover:scale-105 transition-transform duration-300";

  const optimizedImageUrl = article.featured_image 
    ? getOptimizedImageUrl(article.featured_image, featured ? 800 : 400, featured ? 400 : 200)
    : `https://picsum.photos/seed/${article.id}/${featured ? '800/400' : '400/200'}`;

  return (
    <article className={cardClasses}>
      <div className="relative overflow-hidden">
        <LazyImage
          src={optimizedImageUrl}
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
          <LazyImage
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
});

OptimizedArticleCard.displayName = 'OptimizedArticleCard';

export default OptimizedArticleCard;