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
      className={`fixed top-0 left-0 right-0 transition-transform duration-300 ease-in-out ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{
        backgroundColor: window.innerWidth >= 1024 
          ? 'rgba(255, 255, 255, 0.3)' 
          : 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        zIndex: 60
      }}
    >
      

      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-2xl mx-auto lg:mx-0" ref={searchRef}>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search events, articles, courses, giveaways..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setShowResults(true)}

                    // Added focus-visible styles for keyboard accessibility
                    className="w-full pl-10 pr-10 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {showResults && (searchQuery || searchResults.length > 0) && (
                  <div 
                    className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto"
                    style={{ zIndex: 70 }}
                  >
                    {isSearching ? (
                      <div className="p-4 text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-brand-primary mx-auto"></div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Searching...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="py-2">
                        {searchResults.map((result) => (
                          <Link
                            key={`${result.type}-${result.id}`}
                            to={getResultLink(result)}
                            onClick={handleResultClick}
                            className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              {(result.image_url || result.featured_image) && (
                                <img
                                  src={result.image_url || result.featured_image}
                                  alt={result.title}
                                  className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                />
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
                                        className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 px-1.5 py-0.5 rounded"
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
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="flex items-center gap-3 text-brand-primary hover:text-brand-ninja-gold transition-colors"
              >
                <div className="circular-logo">
                  <img
  src="https://jzzyrbaapysjydvjyars.supabase.co/storage/v1/object/sign/techxninjas/TechXNinjas_Logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZjMxMzJhZC04ZDM5LTQ1NGMtODUwMS05NWY1Y2Y5Mzg0MjciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0ZWNoeG5pbmphcy9UZWNoWE5pbmphc19Mb2dvLnBuZyIsImlhdCI6MTc1MDQ2MTMyMSwiZXhwIjoxNzgxOTk3MzIxfQ.0exGeZ2G_kT17zy3hXISdw1WE8p82T9Go1y04EhRYGM"
  alt="TechXNinjas Logo"
  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget; // ✅ Safe in React
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent) {
      parent.innerHTML = '<span class="text-white font-bold text-lg">TX</span>';
    }
  }}
/>
                </div>
                <div className="hidden lg:flex items-center gap-2">
  <img
    src="https://jzzyrbaapysjydvjyars.supabase.co/storage/v1/object/sign/techxninjas/TechXNinjas_Text.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZjMxMzJhZC04ZDM5LTQ1NGMtODUwMS05NWY1Y2Y5Mzg0MjciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0ZWNoeG5pbmphcy9UZWNoWE5pbmphc19UZXh0LnBuZyIsImlhdCI6MTc1MDQ2MTMzMywiZXhwIjoxNzgxOTk3MzMzfQ.0VCZ-IVZyA6GlsNkhJFwH_OaXa4c6gtFiwzx6QKBTHc"
    alt="TechXNinjas Text Logo"
    className="h-6 object-contain"
    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const target = e.currentTarget;
      target.style.display = 'none';
      const parent = target.parentElement;
      if (parent) {
        parent.innerHTML = `<span class='text-base font-semibold text-brand-primary'>TechXNinjas</span>`;
      }
    }}
  />
</div>

              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );<img
  src="https://jzzyrbaapysjydvjyars.supabase.co/storage/v1/object/sign/techxninjas/TechXNinjas_Text.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZjMxMzJhZC04ZDM5LTQ1NGMtODUwMS05NWY1Y2Y5Mzg0MjciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0ZWNoeG5pbmphcy9UZWNoWE5pbmphc19UZXh0LnBuZyIsImlhdCI6MTc1MDQ2MTMzMywiZXhwIjoxNzgxOTk3MzMzfQ.0VCZ-IVZyA6GlsNkhJFwH_OaXa4c6gtFiwzx6QKBTHc"
  alt={`${BRAND_NAME} Text Logo`}
  className="h-8 object-contain"
  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget; // ✅ Use currentTarget instead of target
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent) {
      parent.innerHTML = `<span class="text-xl font-bold text-brand-primary">${BRAND_NAME}</span>`;
    }
  }}
/>

};

export default SearchHeader;