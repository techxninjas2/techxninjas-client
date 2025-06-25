import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { getEvents } from '../../services/eventService';
import { getArticles } from '../../services/articleService';
import { TechEvent, EventMode, EventStatus, Article } from '../../types';
import usePageTitle from '../usePageTitle';
import CodingBackground from '../CodingBackground';
import RevealOnScroll from '../RevealOnScroll';
import OptimizedEventCard from '../OptimizedEventCard';
import OptimizedArticleCard from '../OptimizedArticleCard';
import useDebounce from '../../hooks/useDebounce';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { memoize } from '../../utils/performance';

type TabType = 'hackathons' | 'community' | 'articles';

const ITEMS_PER_PAGE = 12;

// Memoized filter functions
const filterEventsByTab = memoize((events: TechEvent[], tab: TabType) => {
  if (tab === 'hackathons') {
    return events.filter(event => 
      event.tags?.some(tag => tag.toLowerCase().includes('hackathon')) ||
      event.title.toLowerCase().includes('hackathon')
    );
  } else if (tab === 'community') {
    return events.filter(event => 
      event.tags?.some(tag => 
        tag.toLowerCase().includes('event') || 
        tag.toLowerCase().includes('workshop') ||
        tag.toLowerCase().includes('meetup') ||
        tag.toLowerCase().includes('conference')
      ) ||
      event.title.toLowerCase().includes('workshop') ||
      event.title.toLowerCase().includes('meetup') ||
      event.title.toLowerCase().includes('conference') ||
      (!event.tags?.some(tag => tag.toLowerCase().includes('hackathon')) && !event.title.toLowerCase().includes('hackathon'))
    );
  }
  return events;
});

const filterEventsBySearch = memoize((events: TechEvent[], searchTerm: string, mode: EventMode | 'all', status: EventStatus | 'all') => {
  return events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.tags && event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesMode = mode === 'all' || event.mode === mode;
    const matchesStatus = status === 'all' || event.status === status;
    
    return matchesSearch && matchesMode && matchesStatus;
  });
});

const filterArticlesBySearch = memoize((articles: Article[], searchTerm: string) => {
  return articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
});

const OptimizedEventsPage: React.FC = () => {
  usePageTitle("Events & Articles");
  
  const [activeTab, setActiveTab] = useState<TabType>('hackathons');
  const [events, setEvents] = useState<TechEvent[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMode, setSelectedMode] = useState<EventMode | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<EventStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [displayedItems, setDisplayedItems] = useState(ITEMS_PER_PAGE);

  // Debounce search term to avoid excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (activeTab === 'articles') {
        const articlesData = await getArticles();
        setArticles(articlesData);
      } else {
        const eventsData = await getEvents();
        setEvents(eventsData);
      }
    } catch (err: any) {
      console.error('Failed to load data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Memoized filtered data
  const filteredData = useMemo(() => {
    if (activeTab === 'articles') {
      return filterArticlesBySearch(articles, debouncedSearchTerm);
    } else {
      const tabFilteredEvents = filterEventsByTab(events, activeTab);
      return filterEventsBySearch(tabFilteredEvents, debouncedSearchTerm, selectedMode, selectedStatus);
    }
  }, [activeTab, events, articles, debouncedSearchTerm, selectedMode, selectedStatus]);

  // Paginated data
  const paginatedData = useMemo(() => {
    return filteredData.slice(0, displayedItems);
  }, [filteredData, displayedItems]);

  // Infinite scroll
  const { isFetching } = useInfiniteScroll({
    hasNextPage: displayedItems < filteredData.length,
    fetchNextPage: async () => {
      setDisplayedItems(prev => Math.min(prev + ITEMS_PER_PAGE, filteredData.length));
    }
  });

  const clearFilters = () => {
    setSelectedMode('all');
    setSelectedStatus('all');
    setSearchTerm('');
    setDisplayedItems(ITEMS_PER_PAGE);
  };

  const hasActiveFilters = selectedMode !== 'all' || selectedStatus !== 'all' || searchTerm !== '';

  const tabs = [
    { id: 'hackathons' as TabType, label: 'Hackathons', icon: '💻', color: 'text-purple-600' },
    { id: 'community' as TabType, label: 'Community Events', icon: '☕', color: 'text-green-600' },
    { id: 'articles' as TabType, label: 'Articles', icon: '📚', color: 'text-blue-600' }
  ];

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gray-100 dark:bg-brand-dark-gray">
        <CodingBackground 
          intensity="low" 
          style="terminal"
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
    <div className="relative min-h-screen bg-gray-100 dark:bg-brand-dark-gray">
      <CodingBackground 
        intensity="low" 
        style="terminal"
        className="absolute inset-0"
      />
      <div className="container mx-auto px-4 py-6 sm:py-8 relative z-10">
        <RevealOnScroll direction="up" duration={800}>
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-dark-gray dark:text-white mb-3 sm:mb-4">
              Events & Learning Hub
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
              Discover hackathons, community events, and insightful articles to accelerate your tech journey.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll direction="up" delay={300} duration={800}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 sm:mb-8 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex justify-center px-4 py-2" aria-label="Tabs">
                <div className="flex space-x-1 sm:space-x-2 md:space-x-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setDisplayedItems(ITEMS_PER_PAGE);
                      }}
                      className={`flex flex-col items-center justify-center py-3 px-2 sm:px-3 md:px-4 border-b-2 font-medium transition-all duration-300 min-h-[60px] sm:min-h-[70px] ${
                        activeTab === tab.id
                          ? 'border-brand-primary text-brand-primary'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      <span className={`text-lg sm:text-xl md:text-2xl mb-1 ${activeTab === tab.id ? tab.color : ''}`}>
                        {tab.icon}
                      </span>
                      <span className="text-xs sm:text-sm md:text-base text-center leading-tight">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </nav>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab === 'articles' ? 'articles' : 'events'}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {activeTab !== 'articles' && (
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
                    {hasActiveFilters && (
                      <span className="bg-white text-brand-primary rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
                        !
                      </span>
                    )}
                  </button>
                )}

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

              {showFilters && activeTab !== 'articles' && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Mode</label>
                      <select
                        value={selectedMode}
                        onChange={(e) => setSelectedMode(e.target.value as EventMode | 'all')}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:text-white"
                      >
                        <option value="all">All Modes</option>
                        <option value={EventMode.ONLINE}>Online</option>
                        <option value={EventMode.OFFLINE}>Offline</option>
                        <option value={EventMode.HYBRID}>Hybrid</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as EventStatus | 'all')}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:text-white"
                      >
                        <option value="all">All Events</option>
                        <option value={EventStatus.UPCOMING}>Upcoming</option>
                        <option value={EventStatus.ONGOING}>Ongoing</option>
                        <option value={EventStatus.PAST}>Past Events</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </RevealOnScroll>

        {error && (
          <RevealOnScroll direction="up" delay={400} duration={800}>
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6 sm:mb-8">
              <p className="font-semibold text-sm">Error loading {activeTab}:</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={loadData}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm"
              >
                Try Again
              </button>
            </div>
          </RevealOnScroll>
        )}

        {paginatedData.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {activeTab === 'articles' 
                ? (paginatedData as Article[]).map((article, index) => (
                    <RevealOnScroll key={article.id} direction="up" delay={500 + (index % 8) * 100} duration={800}>
                      <OptimizedArticleCard article={article} />
                    </RevealOnScroll>
                  ))
                : (paginatedData as TechEvent[]).map((event, index) => (
                    <RevealOnScroll key={event.id} direction="up" delay={500 + (index % 8) * 100} duration={800}>
                      <OptimizedEventCard event={event} />
                    </RevealOnScroll>
                  ))
              }
            </div>
            
            {isFetching && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-brand-primary"></div>
              </div>
            )}
            
            {displayedItems < filteredData.length && !isFetching && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setDisplayedItems(prev => Math.min(prev + ITEMS_PER_PAGE, filteredData.length))}
                  className="bg-brand-primary hover:bg-brand-ninja-gold text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
                >
                  Load More ({filteredData.length - displayedItems} remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          <RevealOnScroll direction="up" delay={500} duration={800}>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">
                {activeTab === 'articles' ? '📚' : activeTab === 'hackathons' ? '💻' : '☕'}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No {activeTab === 'articles' ? 'articles' : activeTab} found
              </h3>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-500">
                {searchTerm || (activeTab !== 'articles' && (selectedMode !== 'all' || selectedStatus !== 'all'))
                  ? 'Try adjusting your search or filters'
                  : `Check back soon for new ${activeTab === 'articles' ? 'articles' : 'events'}!`}
              </p>
            </div>
          </RevealOnScroll>
        )}
      </div>
    </div>
  );
};

export default OptimizedEventsPage;
