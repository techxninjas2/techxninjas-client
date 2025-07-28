import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, User } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { BRAND_NAME } from '../../constants';

interface SearchResult {
  id: string;
  title: string;
  type: 'event' | 'article' | 'course' | 'giveaway';
  slug?: string;
  description?: string;
  tags?: string[];
  image_url?: string;
  featured_image?: string;
}

const SearchHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  const handleScroll = useCallback(() => {
    try {
      const currentScrollY = window.scrollY;
      const isDesktop = window.innerWidth >= 1024;

      if (isDesktop) {
        setIsHeaderVisible(true);
      } else {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsHeaderVisible(false);
        } else {
          setIsHeaderVisible(true);
        }
      }
      
      setLastScrollY(currentScrollY);
    } catch (err) {
      console.error('Scroll handling error:', err);
    }
  }, [lastScrollY]);

  useEffect(() => {
    try {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    } catch (err) {
      console.error('Scroll event listener error:', err);
    }
  }, [handleScroll]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      try {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
          setShowResults(false);
        }
      } catch (err) {
        console.error('Click outside handler error:', err);
      }
    };

    try {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    } catch (err) {
      console.error('Event listener error:', err);
    }
  }, []);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setError(null);
      return;
    }

    setIsSearching(true);
    setError(null);
    
    try {
      const searchTerm = query.trim();
      const results: SearchResult[] = [];

      const [eventsResponse, articlesResponse] = await Promise.allSettled([
        supabase
          .from('events')
          .select('id, title, slug, description, tags, image_url')
          .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`)
          .limit(5),
        supabase
          .from('articles')
          .select('id, title, slug, excerpt, tags, featured_image')
          .eq('status', 'published')
          .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`)
          .limit(5)
      ]);

      // Handle events response
      if (eventsResponse.status === 'fulfilled' && eventsResponse.value.data) {
        results.push(...eventsResponse.value.data.map(event => ({
          id: event.id,
          title: event.title,
          type: 'event' as const,
          slug: event.slug,
          description: event.description,
          tags: event.tags,
          image_url: event.image_url
        })));
      } else if (eventsResponse.status === 'rejected') {
        console.error('Events search error:', eventsResponse.reason);
        setError('Failed to load events. Please try again.');
      }

      // Handle articles response
      if (articlesResponse.status === 'fulfilled' && articlesResponse.value.data) {
        results.push(...articlesResponse.value.data.map(article => ({
          id: article.id,
          title: article.title,
          type: 'article' as const,
          slug: article.slug,
          description: article.excerpt,
          tags: article.tags,
          featured_image: article.featured_image
        })));
      } else if (articlesResponse.status === 'rejected') {
        console.error('Articles search error:', articlesResponse.reason);
        setError('Failed to load articles. Please try again.');
      }

      setSearchResults(results);
    } catch (err) {
      console.error('Unexpected search error:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const query = e.target.value;
      setSearchQuery(query);
      setShowResults(true);
      setError(null);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        performSearch(query);
      }, 300);
    } catch (err) {
      console.error('Search change error:', err);
      setError('Failed to process search. Please try again.');
    }
  };

  const handleResultClick = () => {
    try {
      setShowResults(false);
      setSearchQuery('');
      inputRef.current?.blur();
    } catch (err) {
      console.error('Result click error:', err);
    }
  };

  const clearSearch = () => {
    try {
      setSearchQuery('');
      setSearchResults([]);
      setShowResults(false);
      setError(null);
      inputRef.current?.focus();
    } catch (err) {
      console.error('Clear search error:', err);
    }
  };

  const handleAccountClick = (e: React.MouseEvent) => {
    try {
      e.preventDefault();
      navigate('/login');
    } catch (err) {
      console.error('Account navigation error:', err);
    }
  };

  const getResultLink = (result: SearchResult) => {
    try {
      switch (result.type) {
        case 'event':
          return `/events/${result.slug}`;
        case 'article':
          return `/articles/${result.slug}`;
        case 'course':
          return '/courses';
        case 'giveaway':
          return '/giveaways';
        default:
          return '/';
      }
    } catch (err) {
      console.error('Link generation error:', err);
      return '/';
    }
  };

  const getTypeLabel = (type: string) => {
    try {
      switch (type) {
        case 'event':
          return 'Event';
        case 'article':
          return 'Article';
        case 'course':
          return 'Course';
        case 'giveaway':
          return 'Giveaway';
        default:
          return '';
      }
    } catch (err) {
      console.error('Type label error:', err);
      return '';
    }
  };

  const getTypeColor = (type: string) => {
    try {
      switch (type) {
        case 'event':
          return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        case 'article':
          return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        case 'course':
          return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
        case 'giveaway':
          return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      }
    } catch (err) {
      console.error('Type color error:', err);
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const renderSearchResults = () => {
    if (error) {
      return (
        <div className="p-4 text-center">
          <p className="text-sm text-red-500 dark:text-red-400">
            {error}
          </p>
          <button
            onClick={() => performSearch(searchQuery)}
            className="mt-2 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    if (isSearching) {
      return (
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Searching...</p>
        </div>
      );
    }

    if (searchResults.length > 0) {
      return (
        <div className="py-2">
          {searchResults.map((result) => (
            <Link
              key={`${result.type}-${result.id}`}
              to={getResultLink(result)}
              onClick={handleResultClick}
              className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start gap-3">
                {(result.image_url || result.featured_image) ? (
                  <img
                    src={result.image_url || result.featured_image}
                    alt={result.title}
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {result.type.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getTypeColor(result.type)}`}>
                      {getTypeLabel(result.type)}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                    {result.title}
                  </h3>
                  {result.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                      {result.description}
                    </p>
                  )}
                  {result.tags && result.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {result.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      );
    }

    if (searchQuery) {
      return (
        <div className="p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No results found for "{searchQuery}"
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 transition-transform duration-300 ease-in-out ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      } bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo on the left */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            aria-label="Home"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center group-hover:from-blue-500 group-hover:to-indigo-600 transition-colors">
              <span className="text-white font-bold text-lg">TX</span>
            </div>
            <span className='hidden lg:block text-lg font-semibold text-gray-800 dark:text-white'>
              {BRAND_NAME}
            </span>
          </Link>

          {/* Search bar in the center */}
          <div className="flex-1 max-w-2xl mx-4" ref={searchRef}>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-400 w-5 h-5" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search events, articles, courses, giveaways..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowResults(true)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                  aria-label="Search"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search results dropdown */}
              {showResults && (searchQuery || searchResults.length > 0 || isSearching || error) && (
                <div 
                  className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
                  style={{ zIndex: 70 }}
                >
                  {renderSearchResults()}
                </div>
              )}
            </div>
          </div>

          {/* Account icon linking to login/signup */}
          <button
            onClick={handleAccountClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Account"
          >
            <User className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default SearchHeader;