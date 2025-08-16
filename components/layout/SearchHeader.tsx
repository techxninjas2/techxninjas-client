import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { BRAND_NAME } from "../../constants";
 

interface SearchResult {
  id: string;
  title: string;
  type: "event" | "article" | "course" | "giveaway";
  slug?: string;
  description?: string;
  tags?: string[];
  image_url?: string;
  featured_image?: string;
}

const SearchHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
          .from("events")
          .select("id, title, slug, description, tags, image_url")
          .or(
            `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`
          )
          .limit(5),
        supabase
          .from("articles")
          .select("id, title, slug, excerpt, tags, featured_image")
          .eq("status", "published")
          .or(
            `title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`
          )
          .limit(5),
      ]);

      if (eventsResponse.data) {
        results.push(
          ...eventsResponse.data.map((event) => ({
            id: event.id,
            title: event.title,
            type: "event" as const,
            slug: event.slug,
            description: event.description,
            tags: event.tags,
            image_url: event.image_url,
          }))
        );
      }

      if (articlesResponse.data) {
        results.push(
          ...articlesResponse.data.map((article) => ({
            id: article.id,
            title: article.title,
            type: "article" as const,
            slug: article.slug,
            description: article.excerpt,
            tags: article.tags,
            featured_image: article.featured_image,
          }))
        );
      }

      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
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
    setSearchQuery("");
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  const getResultLink = (result: SearchResult) => {
    switch (result.type) {
      case "event":
        return `/events/${result.slug}`;
      case "article":
        return `/articles/${result.slug}`;
      case "course":
        return "/courses";
      case "giveaway":
        return "/giveaways";
      default:
        return "/";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "event":
        return "Event";
      case "article":
        return "Article";
      case "course":
        return "Course";
      case "giveaway":
        return "Giveaway";
      default:
        return "";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "event":
        return "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30";
      case "article":
        return "bg-green-500/20 text-green-300 border border-green-500/30";
      case "course":
        return "bg-purple-500/20 text-purple-300 border border-purple-500/30";
      case "giveaway":
        return "bg-orange-500/20 text-orange-300 border border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        .cyberpunk-nav {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background: rgba(10, 10, 20, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 255, 255, 0.1);
          box-shadow: 0 4px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05);
        }
        
        .logo-glow {
          filter: drop-shadow(0 0 8px rgba(0, 255, 255, 0.4));
          transition: all 0.3s ease;
        }
        
        .logo-glow:hover {
          filter: drop-shadow(0 0 16px rgba(0, 255, 255, 0.6));
          transform: scale(1.05);
        }
        
        .brand-text {
          background: linear-gradient(135deg, #00ffff 0%, #0099ff 50%, #00ffcc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 6px rgba(0, 255, 255, 0.3));
          transition: all 0.3s ease;
        }
        
        .brand-text:hover {
          filter: drop-shadow(0 0 10px rgba(0, 255, 255, 0.5));
        }
        
        .search-input {
          background: rgba(15, 15, 30, 0.8);
          border: 1px solid rgba(100, 100, 120, 0.3);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          transition: all 0.3s ease;
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 0 20px rgba(0, 255, 255, 0.02);
        }
        
        .search-input:focus {
          border-color: rgba(0, 255, 255, 0.6);
          box-shadow: 0 0 25px rgba(0, 255, 255, 0.3), inset 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 0 30px rgba(0, 255, 255, 0.05);
          background: rgba(15, 15, 30, 0.9);
        }
        
        .search-results {
          background: rgba(10, 10, 20, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(100, 100, 120, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }
        
        .result-item {
          background: rgba(20, 20, 40, 0.3);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }
        
        .result-item:hover {
          background: rgba(30, 30, 60, 0.5);
          border-color: rgba(0, 255, 255, 0.3);
          box-shadow: 0 4px 20px rgba(0, 255, 255, 0.1);
        }
        
        .icon-bg {
          background: rgba(20, 20, 40, 0.4);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .icon-bg:hover {
          background: rgba(30, 30, 60, 0.6);
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
        }
        
        .loading-spinner {
          border-top-color: #00ffff;
          border-right-color: #00ffff;
        }
        
        .icon-active {
          color: #00ff88;
          background: rgba(0, 255, 136, 0.1);
          box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
          transform: scale(1.05);
        }
        
        .tooltip {
          background: rgba(10, 10, 20, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 255, 255, 0.3);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          font-size: 12px;
          padding: 6px 10px;
          border-radius: 6px;
          white-space: nowrap;
          z-index: 80;
        }
      `}</style>

      <header
        className={`fixed top-0 left-0 right-0 transition-transform duration-300 ease-in-out cyberpunk-nav ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ zIndex: 60 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Logo Section */}
            <Link
              to="/"
              className="flex items-center gap-4 text-cyan-300 hover:text-cyan-100 transition-all duration-300 flex-shrink-0 group relative"
              title={isMobile ? "TechXNinjas" : ""}
            >
              <div className="relative">
                <div className="circular-logo logo-glow   rounded-full bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/40">
                  <img
                    // src="https://jzzyrbaapysjydvjyars.supabase.co/storage/v1/object/sign/techxninjas/TechXNinjas_Logo.png ?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZjMxMzJhZC04ZDM5LTQ1NGMtODUwMS05NWY1Y2Y5Mzg0MjciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0ZWNoeG5pbmphcy9UZWNoWE5pbmphc19Mb2dvLnBuZyIsImlhdCI6MTc1MDQ2MTMyMSwiZXhwIjoxNzgxOTk3MzIxfQ.0exGeZ2G_kT17zy3hXISdw1WE8p82T9Go1y04EhRYGM"
                    src="../../techxninjas_logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZjMxMzJhZC04ZDM5LTQ1NGMtODUwMS05NWY1Y2Y5Mzg0MjciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0ZWNoeG5pbmphcy9UZWNoWE5pbmphc19Mb2dvLnBuZyIsImlhdCI6MTc1MDQ2MTMyMSwiZXhwIjoxNzgxOTk3MzIxfQ.0exGeZ2G_kT17zy3hXISdw1WE8p82T9Go1y04EhRYGM"
                    alt="TechXNinjas Logo"
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(
                      e: React.SyntheticEvent<HTMLImageElement, Event>
                    ) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML =
                          '<div class="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/40 via-blue-500/40 to-purple-500/40 flex items-center justify-center border border-cyan-500/60"><span class="text-cyan-300 font-bold text-xl tracking-wider">TX</span></div>';
                      }
                    }}
                  />
                </div>
                {/* Mobile Tooltip */}
                {isMobile && (
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 tooltip transition-opacity duration-300 pointer-events-none">
                    <span className="text-cyan-300 text-xs font-medium">
                      TechXNinjas
                    </span>
                  </div>
                )}
              </div>

              {!isMobile && (
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold brand-text tracking-wide leading-none">
                    {BRAND_NAME}
                  </span>
                </div>
              )}
            </Link>

            {/* Search Section */}
            <div
              className={`${isMobile ? "flex-1" : "flex-1 max-w-2xl"} mx-4`}
              ref={searchRef}
            >
              <div className="relative">
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 icon-bg rounded-full p-1">
                    <Search className="text-gray-400 group-focus-within:text-cyan-400 w-4 h-4 transition-colors duration-300" />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={
                      isMobile
                        ? "Search tech content..."
                        : "Search events, articles, courses, and giveaways..."
                    }
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setShowResults(true)}
                    className="w-full pl-12 pr-12 py-3 text-sm search-input rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:text-white"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 icon-bg rounded-full p-1 text-gray-400 hover:text-cyan-400 transition-all duration-300"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {showResults && (searchQuery || searchResults.length > 0) && (
                  <div
                    className="absolute top-full left-0 right-0 mt-2 search-results rounded-xl max-h-96 overflow-y-auto"
                    style={{ zIndex: 70 }}
                  >
                    {isSearching ? (
                      <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-600 loading-spinner mx-auto"></div>
                        <p className="text-sm text-gray-400 mt-3 font-medium">
                          Searching quantum database...
                        </p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="p-2">
                        {searchResults.map((result) => (
                          <Link
                            key={`${result.type}-${result.id}`}
                            to={getResultLink(result)}
                            onClick={handleResultClick}
                            className="result-item block p-4 rounded-lg mb-2 last:mb-0"
                          >
                            <div className="flex items-start gap-4">
                              {(result.image_url || result.featured_image) && (
                                <div className="relative">
                                  <img
                                    src={
                                      result.image_url || result.featured_image
                                    }
                                    alt={result.title}
                                    className="w-14 h-14 object-cover rounded-lg flex-shrink-0 border border-gray-600"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <span
                                    className={`text-xs font-medium px-2 py-1 rounded-full ${getTypeColor(
                                      result.type
                                    )}`}
                                  >
                                    {getTypeLabel(result.type)}
                                  </span>
                                </div>
                                <h3 className="text-sm font-semibold text-gray-100 line-clamp-1 mb-1">
                                  {result.title}
                                </h3>
                                {result.description && (
                                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                                    {result.description}
                                  </p>
                                )}
                                {result.tags && result.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {result.tags
                                      .slice(0, 3)
                                      .map((tag, index) => (
                                        <span
                                          key={index}
                                          className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full border border-gray-600/50"
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
                      <div className="p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-gray-700/30 to-gray-600/30 flex items-center justify-center border border-gray-600/30">
                          <Search className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-400 font-medium">
                          No results found in the matrix
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Try "{searchQuery}" with different keywords
                        </p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default SearchHeader;
