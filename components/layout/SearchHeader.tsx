import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ChevronDown, Bell, UserCircle, LayoutDashboard, Youtube } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { BRAND_NAME } from '../../constants';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

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
      
      if (userDropdownRef.current && 
          !userDropdownRef.current.contains(event.target as Node) &&
          isUserDropdownOpen) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserDropdownOpen]);

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
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
      case 'article':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
      case 'course':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200';
      case 'giveaway':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-200';
    }
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 transition-transform duration-300 ease-in-out ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      } bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* TechXNinjas Branding */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-3 text-brand-primary hover:text-brand-ninja-gold transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                TX
              </div>
              <div className="hidden lg:flex items-center">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-500 dark:to-blue-400">
                  TechXNinjas
                </span>
              </div>
            </Link>
          </div>

          {/* Premium Search Bar */}
          <div className="flex-1 max-w-2xl mx-auto lg:mx-0" ref={searchRef}>
            <div className="relative">
              <motion.div
                initial={{ boxShadow: "0 0 0 0 rgba(110, 69, 226, 0.4)" }}
                animate={{ 
                  boxShadow: showResults 
                    ? "0 0 0 4px rgba(110, 69, 226, 0.4)"
                    : "0 0 0 0 rgba(110, 69, 226, 0.4)"
                }}
                className="relative rounded-lg overflow-hidden"
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search events, articles, courses, giveaways..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowResults(true)}
                  className="w-full pl-10 pr-10 py-3 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </motion.div>

              <AnimatePresence>
                {showResults && (searchQuery || searchResults.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto"
                    style={{ zIndex: 60 }}
                  >
                    {isSearching ? (
                      <div className="p-4 text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Searching...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="py-2">
                        {searchResults.map((result) => (
                          <Link
                            key={`${result.type}-${result.id}`}
                            to={getResultLink(result)}
                            onClick={handleResultClick}
                            className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              {(result.image_url || result.featured_image) && (
                                <div className="flex-shrink-0">
                                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl overflow-hidden">
                                    <img
                                      src={result.image_url || result.featured_image}
                                      alt={result.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getTypeColor(result.type)}`}>
                                    {getTypeLabel(result.type)}
                                  </span>
                                </div>
                                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
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
                                        className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-700/70 dark:text-gray-300 px-1.5 py-0.5 rounded"
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
                    ) : searchQuery ? (
                      <div className="p-4 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No results found for "{searchQuery}"
                        </p>
                      </div>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 transition-all duration-300 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="relative" ref={userDropdownRef}>
              <button 
                onClick={toggleUserDropdown}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white">
                  U
                </div>
                <span className="hidden md:inline">User</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isUserDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl py-2 ring-1 ring-black/10 dark:ring-white/10 z-50 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        username@example.com
                      </p>
                    </div>
                    <div className="py-1">
                      <Link 
                        to="/dashboard" 
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200 group"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                        <span>My Dashboard</span>
                      </Link>
                      <Link 
                        to="/creator-dashboard" 
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200 group"
                      >
                        <Youtube className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                        <span>Creator Dashboard</span>
                      </Link>
                      <button 
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200 group"
                      >
                        <UserCircle className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" /> 
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SearchHeader;