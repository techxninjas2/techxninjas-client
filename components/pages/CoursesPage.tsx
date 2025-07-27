import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, X, Plus, Star, Users, Clock, Play, BookOpen, TrendingUp, Award, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getCourses, getCourseCategories, getFeaturedCourses } from '../../services/courseService';
import { Course, CourseCategory } from '../../types';
import usePageTitle from '../usePageTitle';
import CodingBackground from '../CodingBackground';
import RevealOnScroll from '../RevealOnScroll';
import CreatorApplicationModal from '../CreatorApplicationModal';
import LazyImage from '../LazyImage';

const CourseCard: React.FC<{ course: Course; featured?: boolean }> = ({ course, featured = false }) => {
  const cardClasses = featured 
    ? "bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 w-full"
    : "bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 w-full";

  const imageClasses = featured 
    ? "w-full h-40 sm:h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
    : "w-full h-36 sm:h-40 md:h-44 object-cover group-hover:scale-105 transition-transform duration-300";

  return (
    <article className={cardClasses}>
      <div className="relative overflow-hidden">
        <LazyImage 
          src={course.thumbnail_url || `https://picsum.photos/seed/${course.id}/400/200`} 
          alt={course.title} 
          className={imageClasses}
        />
        {course.is_featured && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full flex items-center">
              <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
              <span className="text-xs">Featured</span>
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          <span className="bg-black bg-opacity-60 text-white text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
            {course.difficulty_level}
          </span>
        </div>
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3">
          <span className="bg-brand-primary text-white text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full flex items-center">
            <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
            <span className="text-xs">{course.total_videos} videos</span>
          </span>
        </div>
      </div>

      <div className={`p-3 sm:p-4 ${featured ? 'md:p-5 lg:p-6' : 'md:p-4'}`}>
        <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
          <LazyImage 
            src={course.creator?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.creator?.creator_name || 'Creator')}&background=random&color=fff&size=32`}
            alt={course.creator?.creator_name}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
              {course.creator?.creator_name}
              {course.creator?.is_verified && (
                <span className="ml-1 text-blue-500">✓</span>
              )}
            </p>
            <div className="flex items-center space-x-1 sm:space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
              <span className="text-xs">{Math.floor(course.total_duration_minutes / 60)}h {course.total_duration_minutes % 60}m</span>
              <span>•</span>
              <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
              <span className="text-xs truncate">{course.enrolled_count} students</span>
            </div>
          </div>
        </div>

        <Link to={`/courses/${course.slug}`} className="block group">
          <h2 className={`font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-primary dark:group-hover:text-brand-ninja-gold transition-colors line-clamp-2 leading-tight ${featured ? 'text-lg sm:text-xl md:text-2xl' : 'text-base sm:text-lg'}`}>
            {course.title}
          </h2>
          
          <p className={`text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-3 leading-relaxed ${featured ? 'text-sm sm:text-base' : 'text-sm'}`}>
            {course.short_description || course.description}
          </p>
        </Link>

        <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
          {course.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-brand-primary bg-opacity-10 text-brand-primary dark:bg-brand-ninja-gold dark:bg-opacity-10 dark:text-brand-ninja-gold text-xs font-medium px-2 py-0.5 sm:py-1 rounded-full truncate max-w-24 sm:max-w-none"
            >
              {tag}
            </span>
          ))}
          {course.tags.length > 3 && (
            <span className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 text-xs font-medium px-2 py-0.5 sm:py-1 rounded-full">
              +{course.tags.length - 3}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current flex-shrink-0" />
              <span className="text-xs sm:text-sm">{course.average_rating.toFixed(1)}</span>
              <span className="text-xs sm:text-sm">({course.total_reviews})</span>
            </div>
            {course.is_free && (
              <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium px-2 py-0.5 rounded-full">
                Free
              </span>
            )}
          </div>
          
          <Link
            to={`/courses/${course.slug}`}
            className="text-brand-primary hover:text-brand-ninja-gold dark:text-brand-ninja-gold dark:hover:text-brand-primary font-medium transition-colors text-xs sm:text-sm self-start sm:self-auto"
          >
            Learn more →
          </Link>
        </div>
      </div>
    </article>
  );
};

const CoursesPage: React.FC = () => {
  usePageTitle("Courses");
  const { user } = useAuth();
  
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  //  just load initial data only once
  useEffect(() => {
    loadInitialData();
  },[])

  useEffect(() => {
    if (allCourses.length > 0) {
      loadFilteredCourses();
    }
  }, [selectedCategory, selectedDifficulty]);

  // search with debounce
  useEffect(() => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      const timeoutId = setTimeout(() => {
        loadFilteredCourses();
        setIsSearching(false);
      }, 300); // Debounce for 300ms

      return () => {
        clearTimeout(timeoutId);
        setIsSearching(false);
      };
    } else if(allCourses.length >0){
      
      setIsSearching(false);
    }
  }, [searchTerm,allCourses.length]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [coursesData, featuredData, categoriesData] = await Promise.all([
        getCourses({ }),
        getFeaturedCourses(6),
        getCourseCategories()
      ]);
      
      setAllCourses(coursesData);
      setFeaturedCourses(featuredData);
      setCategories(categoriesData);
    } catch (err: any) {
      console.error('Failed to load inital courses or data:', err);
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredCourses = async () => {
    try {
      setError(null);
      const courseData = await getCourses({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        difficulty: selectedDifficulty === 'all' ? undefined : selectedDifficulty,
        search: searchTerm || undefined
      })
      setAllCourses(courseData)
    } catch (err: any) {
      console.error('Failed to load filtered courses:', err);
      setError(err.message || 'Failed to load courses');
    }
  }
  const handleSearch = () => {
    loadFilteredCourses();
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSearchTerm('');
    setCategorySearchTerm('');
    loadInitialData();
  };

  // Filter categories based on search term (client side)
  const filteredCategories = useMemo(() => {
    return categories.filter(category => 
      category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
    )
  },[categories,categorySearchTerm])

  // Filter courses for display (client-side for immediate feedback)
  const displayedCourses = useMemo(() => {
    if (!searchTerm.trim()) return allCourses;
    
    return allCourses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.short_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      course.creator?.creator_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allCourses, searchTerm]);

  const hasActiveFilters = selectedCategory !== 'all' || selectedDifficulty !== 'all' || searchTerm !== '';

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gray-50 dark:bg-brand-dark-gray overflow-hidden">
        <CodingBackground 
          intensity="low" 
          style="code"
          className="absolute inset-0 z-0"
        />
        <div className="container mx-auto px-3 sm:px-4 py-8 relative z-10">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-brand-dark-gray overflow-hidden">
      <CodingBackground 
        intensity="low" 
        style="code"
        className="absolute inset-0 z-0"
      />
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 relative z-10 max-w-7xl">
        <RevealOnScroll direction="up" duration={800}>
          <div className="text-center mb-6 sm:mb-8 lg:mb-12 px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand-dark-gray dark:text-white mb-3 sm:mb-4 leading-tight">
              Learn from YouTube Experts
            </h1>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Discover curated YouTube courses from verified creators. Learn at your own pace with structured playlists and track your progress.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll direction="up" delay={300} duration={800}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 mb-6 sm:mb-8 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="flex-1 relative min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchTerm(value);
                    // update only category  search term , don't trigger course reload
                    setCategorySearchTerm(value);
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-9 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handleSearch}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 bg-brand-primary text-white rounded-lg hover:bg-brand-ninja-gold transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Search
                </button>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 sm:py-2.5 text-sm border rounded-lg transition-colors whitespace-nowrap ${
                    showFilters || hasActiveFilters
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden xs:inline">Filter</span>
                </button>

                {user && (
                  <button
                    onClick={() => setIsCreatorModalOpen(true)}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Be a Creator</span>
                  </button>
                )}

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-2 sm:px-3 py-2 sm:py-2.5 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden xs:inline">Clear</span>
                  </button>
                )}
              </div>
            </div>

            {showFilters && (
              <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:text-white"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.slug}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Difficulty</label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:text-white"
                    >
                      <option value="all">All Levels</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </RevealOnScroll>

        {error && (
          <RevealOnScroll direction="up" delay={400} duration={800}>
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-3 sm:px-4 py-3 rounded-lg mb-6 sm:mb-8">
              <p className="font-semibold text-sm">Error loading courses:</p>
              <p className="text-sm break-words">{error}</p>
              <button
                onClick={loadInitialData}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm"
              >
                Try Again
              </button>
            </div>
          </RevealOnScroll>
        )}

        {/* Categories Section */}
        <section className="mb-8 sm:mb-10 lg:mb-12">
          <RevealOnScroll direction="up" delay={500} duration={800}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 px-1">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-0 flex items-center">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-brand-primary dark:text-brand-ninja-gold mr-2 sm:mr-3 flex-shrink-0" />
                <span className="leading-tight">Browse by Category</span>
                {isSearching && (
                  <div className="ml-2 sm:ml-3 w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                )}
              </h2>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {isSearching ? (
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-brand-primary rounded-full animate-pulse"></div>
                    Filtering...
                  </span>
                ) : (
                  `${filteredCategories.length} categories available`
                )}
              </div>
            </div>
          </RevealOnScroll>
          
          <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 sm:gap-4 lg:gap-6 transition-opacity duration-300 ${isSearching ? 'opacity-70' : 'opacity-100'}`}>
            {filteredCategories.slice(0, 16).map((category, index) => (
              <RevealOnScroll key={category.id} direction="up" delay={600 + index * 50} duration={800}>
                <button
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`group relative w-full aspect-square p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl border transition-all duration-500 text-center backdrop-blur-sm overflow-hidden ${
                    selectedCategory === category.slug
                      ? 'border-brand-primary bg-gradient-to-br from-brand-primary/15 to-brand-primary/5 dark:from-brand-ninja-gold/15 dark:to-brand-ninja-gold/5 shadow-xl shadow-brand-primary/20 dark:shadow-brand-ninja-gold/20 transform scale-105 -translate-y-1 sm:-translate-y-2'
                      : 'border-gray-200/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-800/70 hover:border-brand-primary/50 hover:bg-white/90 dark:hover:bg-gray-800/90 hover:shadow-lg hover:shadow-gray-400/20 dark:hover:shadow-gray-900/40 hover:scale-105 hover:-translate-y-0.5 sm:hover:-translate-y-1'
                  }`}
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 w-4 h-4 sm:w-8 sm:h-8 rounded-full bg-current"></div>
                    <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 w-2 h-2 sm:w-4 sm:h-4 rounded-full bg-current"></div>
                  </div>
                  
                  {/* Content container */}
                  <div className="relative z-10 h-full flex flex-col items-center justify-center gap-1 sm:gap-2">
                    {/* Icon */}
                    <div className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl transition-all duration-300 ${
                      selectedCategory === category.slug 
                        ? 'scale-110 filter drop-shadow-lg' 
                        : 'group-hover:scale-110 group-hover:filter group-hover:drop-shadow-lg'
                    }`}>
                      {category.icon}
                    </div>
                    
                    {/* Category name */}
                    <h3 className={`text-xs sm:text-sm font-semibold text-center leading-tight transition-all duration-300 px-0.5 sm:px-1 ${
                      selectedCategory === category.slug
                        ? 'text-brand-primary dark:text-brand-ninja-gold'
                        : 'text-gray-800 dark:text-gray-200 group-hover:text-brand-primary dark:group-hover:text-brand-ninja-gold'
                    }`}>
                      <span className="line-clamp-2 break-words hyphens-auto">
                        {category.name}
                      </span>
                    </h3>
                  </div>

                  {/* Selected indicator */}
                  {selectedCategory === category.slug && (
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-brand-primary dark:bg-brand-ninja-gold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                    </div>
                  )}

                  {/* Hover gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-brand-primary/8 via-transparent to-brand-primary/4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl sm:rounded-2xl ${
                    selectedCategory === category.slug ? 'opacity-100' : ''
                  }`}></div>
                  
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                </button>
              </RevealOnScroll>
            ))}
          </div>
          
          {filteredCategories.length === 0 && categorySearchTerm && (
            <RevealOnScroll direction="up" delay={600} duration={800}>
              <div className="text-center py-8 sm:py-12 px-4 sm:px-6 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 rounded-2xl sm:rounded-3xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 mx-2">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4 opacity-50">🔍</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                  No categories found
                </h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                  We couldn't find any categories matching <span className="font-semibold text-brand-primary dark:text-brand-ninja-gold break-words">"{categorySearchTerm}"</span>. Try searching with different keywords.
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setCategorySearchTerm('');
                  }}
                  className="mt-3 sm:mt-4 px-4 sm:px-6 py-2 bg-brand-primary hover:bg-brand-ninja-gold text-white rounded-full transition-colors duration-300 text-sm font-medium"
                >
                  Clear search
                </button>
              </div>
            </RevealOnScroll>
          )}
        </section>

        {featuredCourses.length > 0 && !searchTerm && (
          <section className="mb-8 sm:mb-10 lg:mb-12">
            <RevealOnScroll direction="up" delay={700} duration={800}>
              <div className="flex items-center mb-4 sm:mb-6 px-1">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-brand-primary dark:text-brand-ninja-gold mr-2 flex-shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Featured Courses</h2>
              </div>
            </RevealOnScroll>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {featuredCourses.map((course, index) => (
                <RevealOnScroll key={course.id} direction="up" delay={800 + index * 150} duration={800}>
                  <CourseCard course={course} featured />
                </RevealOnScroll>
              ))}
            </div>
          </section>
        )}

        <section>
          <RevealOnScroll direction="up" delay={900} duration={800}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 px-1 gap-2">
              <div className="flex items-center">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-brand-primary dark:text-brand-ninja-gold mr-2 flex-shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  {searchTerm ? 'Search Results' : selectedCategory === 'all' ? 'All Courses' : `${categories.find(c => c.slug === selectedCategory)?.name} Courses`}
                </h2>
              </div>
              {displayedCourses.length > 0 && (
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {displayedCourses.length} course{displayedCourses.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </RevealOnScroll>

          {displayedCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {displayedCourses.map((course, index) => (
                <RevealOnScroll key={course.id} direction="up" delay={1000 + index * 100} duration={800}>
                  <CourseCard course={course} />
                </RevealOnScroll>
              ))}
            </div>
          ) : (
            <RevealOnScroll direction="up" delay={1000} duration={800}>
              <div className="text-center py-8 sm:py-12 px-4">
                <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No courses found
                </h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-500 max-w-md mx-auto">
                  {searchTerm || hasActiveFilters
                    ? 'Try adjusting your search or filters'
                    : 'Check back soon for new courses!'}
                </p>
              </div>
            </RevealOnScroll>
          )}
        </section>
      </div>

      {/* Creator Application Modal */}
      <CreatorApplicationModal 
        isOpen={isCreatorModalOpen}
        onClose={() => setIsCreatorModalOpen(false)}
      />
    </div>
  );
};

export default CoursesPage;
