import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
// Added for icon use and consistent styling
import { Search, X } from 'lucide-react';
import { UserCircle } from 'lucide-react';
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

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScroll = useCallback(() => {
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
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const searchTerm = query.trim();
      const results: SearchResult[] = [];

      const [eventsResponse, articlesResponse] = await Promise.all([
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

      if (eventsResponse.data) {
        results.push(...eventsResponse.data.map(event => ({
          id: event.id,
          title: event.title,
          type: 'event' as const,
          slug: event.slug,
          description: event.description,
          tags: event.tags,
          image_url: event.image_url
        })));
      }

      if (articlesResponse.data) {
        results.push(...articlesResponse.data.map(article => ({
          id: article.id,
          title: article.title,
          type: 'article' as const,
          slug: article.slug,
          description: article.excerpt,
          tags: article.tags,
          featured_image: article.featured_image
        })));
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowResults(true);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);
  };

  const handleResultClick = () => {
    setShowResults(false);
    setSearchQuery('');
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  const getResultLink = (result: SearchResult) => {
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
  };

  const getTypeLabel = (type: string) => {
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
  };

  const getTypeColor = (type: string) => {
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
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out bg-gradient-to-r from-white/95 via-white/90 to-white/95 backdrop-blur-xl border-b border-gradient-to-r from-purple-200/50 via-blue-200/50 to-purple-200/50 shadow-lg shadow-purple-100/20 dark:from-gray-900/95 dark:via-gray-900/90 dark:to-gray-900/95 dark:border-purple-500/20 dark:shadow-purple-900/20 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo Section - Consistent positioning */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link
              to="/"
              className="group flex items-center gap-4 text-brand-primary hover:text-brand-ninja-gold transition-all duration-300 transform hover:scale-105"
            >
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 via-yellow-500 to-yellow-200 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/25 group-hover:shadow-xl group-hover:shadow-orange-500/40 transition-all duration-300 animate-pulse">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-400 via-yellow-400 to-yellow-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  src="https://jzzyrbaapysjydvjyars.supabase.co/storage/v1/object/sign/techxninjas/TechXNinjas_Logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZjMxMzJhZC04ZDM5LTQ1NGMtODUwMS05NWY1Y2Y5Mzg0MjciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0ZWNoeG5pbmphcy9UZWNoWE5pbmphc19Mb2dvLnBuZyIsImlhdCI6MTc1MDQ2MTMyMSwiZXhwIjoxNzgxOTk3MzIxfQ.0exGeZ2G_kT17zy3hXISdw1WE8p82T9Go1y04EhRYGM"
                  alt="TechXNinjas Logo"
                  className="relative z-10 w-8 h-8 object-contain filter drop-shadow-lg"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<span class="relative z-10 text-white font-bold text-lg drop-shadow-lg">TX</span>';
                    }
                  }}
                />
              </div>
              <div className="hidden sm:block">
                <img
                  src="https://jzzyrbaapysjydvjyars.supabase.co/storage/v1/object/sign/techxninjas/TechXNinjas_Text.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZjMxMzJhZC04ZDM5LTQ1NGMtODUwMS05NWY1Y2Y5Mzg0MjciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0ZWNoeG5pbmphcy9UZWNoWE5pbmphc19UZXh0LnBuZyIsImlhdCI6MTc1MDQ2MTMzMywiZXhwIjoxNzgxOTk3MzMzfQ.0VCZ-IVZyA6GlsNkhJFwH_OaXa4c6gtFiwzx6QKBTHc"
                  alt={`${BRAND_NAME} Text Logo`}
                  className="h-7 object-contain filter drop-shadow-md group-hover:drop-shadow-lg transition-all duration-300"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent drop-shadow-md">${BRAND_NAME}</span>`;
                    }
                  }}
                />
              </div>
            </Link>
          </div>

          {/* Search Section - Consistent styling and behavior */}
          <div className="flex-1 max-w-3xl mx-6 lg:mx-12" ref={searchRef}>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-sm"></div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 dark:text-purple-400 w-5 h-5 pointer-events-none transition-colors duration-300" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="🔍 Discover amazing events, articles, courses & giveaways..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowResults(true)}
                  className="w-full pl-12 pr-12 py-4 text-sm bg-white/90 dark:bg-gray-800/90 border-0 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 shadow-lg backdrop-blur-sm group-hover:shadow-xl"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-all duration-300 p-1 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown - Consistent positioning */}
              {showResults && (searchQuery || searchResults.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-purple-200/50 dark:border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/10 max-h-96 overflow-y-auto z-50">
                  {isSearching ? (
                    <div className="p-8 text-center">
                      <div className="relative w-8 h-8 mx-auto">
                        <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="text-sm text-purple-600 dark:text-purple-400 mt-3 font-medium">Searching magical content...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-3">
                      {searchResults.map((result) => (
                        <Link
                          key={`${result.type}-${result.id}`}
                          to={getResultLink(result)}
                          onClick={handleResultClick}
                          className="group block px-5 py-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 transition-all duration-300 border-b border-gray-100/50 dark:border-gray-700/50 last:border-b-0"
                        >
                          <div className="flex items-start gap-4">
                            {(result.image_url || result.featured_image) && (
                              <div className="relative flex-shrink-0">
                                <img
                                  src={result.image_url || result.featured_image}
                                  alt={result.title}
                                  className="w-14 h-14 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl group-hover:from-purple-500/20 group-hover:to-blue-500/20 transition-colors duration-300"></div>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${getTypeColor(result.type)} group-hover:shadow-md transition-shadow duration-300`}>
                                  ✨ {getTypeLabel(result.type)}
                                </span>
                              </div>
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                                {result.title}
                              </h3>
                              {result.description && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                                  {result.description}
                                </p>
                              )}
                              {result.tags && result.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {result.tags.slice(0, 3).map((tag, index) => (
                                    <span
                                      key={index}
                                      className="text-xs bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 dark:from-purple-900/50 dark:to-blue-900/50 dark:text-purple-300 px-2 py-1 rounded-full font-medium"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : searchQuery ? (
                    <div className="p-8 text-center">
                      <div className="text-4xl mb-3">🔍</div>
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                        No magical results found for "{searchQuery}"
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Try searching with different keywords ✨
                      </p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* Consistent spacing */}
          <div className="flex items-center gap-4 flex-shrink-0">
          </div>
        </div>
      </div>
    </header>
  );
};

export default SearchHeader;