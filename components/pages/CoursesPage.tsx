import React, { useState, useEffect } from 'react';
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
    ? "bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95"
    : "bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95";

  const imageClasses = featured 
    ? "w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
    : "w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300";

  return (
    <article className={cardClasses}>
      <div className="relative overflow-hidden">
        <LazyImage 
          src={course.thumbnail_url || `https://picsum.photos/seed/${course.id}/400/200`} 
          alt={course.title} 
          className={imageClasses}
        />
        {course.is_featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              Featured
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="bg-black bg-opacity-60 text-white text-xs font-medium px-2 py-1 rounded-full">
            {course.difficulty_level}
          </span>
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="bg-brand-primary text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
            <Play className="w-3 h-3 mr-1" />
            {course.total_videos} videos
          </span>
        </div>
      </div>

      <div className={`p-4 ${featured ? 'sm:p-6' : 'sm:p-5'}`}>
        <div className="flex items-center space-x-3 mb-3">
          <LazyImage 
            src={course.creator?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.creator?.creator_name || 'Creator')}&background=random&color=fff&size=32`}
            alt={course.creator?.creator_name}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {course.creator?.creator_name}
              {course.creator?.is_verified && (
                <span className="ml-1 text-blue-500">✓</span>
              )}
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{Math.floor(course.total_duration_minutes / 60)}h {course.total_duration_minutes % 60}m</span>
              <span>•</span>
              <Users className="w-3 h-3" />
              <span>{course.enrolled_count} students</span>
            </div>
          </div>
        </div>

        <Link to={`/courses/${course.slug}`} className="block group">
          <h2 className={`font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-primary dark:group-hover:text-brand-ninja-gold transition-colors line-clamp-2 ${featured ? 'text-xl sm:text-2xl' : 'text-lg'}`}>
            {course.title}
          </h2>
          
          <p className={`text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 ${featured ? 'text-base' : 'text-sm'}`}>
            {course.short_description || course.description}
          </p>
        </Link>

        <div className="flex flex-wrap gap-1 mb-4">
          {course.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-brand-primary bg-opacity-10 text-brand-primary dark:bg-brand-ninja-gold dark:bg-opacity-10 dark:text-brand-ninja-gold text-xs font-medium px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
          {course.tags.length > 3 && (
            <span className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 text-xs font-medium px-2 py-1 rounded-full">
              +{course.tags.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{course.average_rating.toFixed(1)}</span>
              <span>({course.total_reviews})</span>
            </div>
            {course.is_free && (
              <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium px-2 py-1 rounded-full">
                Free
              </span>
            )}
          </div>
          
          <Link
            to={`/courses/${course.slug}`}
            className="text-brand-primary hover:text-brand-ninja-gold dark:text-brand-ninja-gold dark:hover:text-brand-primary font-medium transition-colors"
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
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedDifficulty]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [coursesData, featuredData, categoriesData] = await Promise.all([
        getCourses({ 
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          difficulty: selectedDifficulty === 'all' ? undefined : selectedDifficulty,
          search: searchTerm || undefined
        }),
        getFeaturedCourses(6),
        getCourseCategories()
      ]);
      
      setCourses(coursesData);
      setFeaturedCourses(featuredData);
      setCategories(categoriesData);
    } catch (err: any) {
      console.error('Failed to load courses:', err);
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadData();
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSearchTerm('');
    loadData();
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedDifficulty !== 'all' || searchTerm !== '';

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gray-50 dark:bg-brand-dark-gray">
        <CodingBackground 
          intensity="low" 
          style="code"
          className="absolute inset-0 z-0"
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
        className="absolute inset-0 z-0"
      />
      <div className="container mx-auto px-4 py-6 sm:py-8 relative z-10">
        <RevealOnScroll direction="up" duration={800}>
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark-gray dark:text-white mb-4">
              Learn from YouTube Experts
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Discover curated YouTube courses from verified creators. Learn at your own pace with structured playlists and track your progress.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll direction="up" delay={300} duration={800}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search courses..."
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

              {user && (
                <button
                  onClick={() => setIsCreatorModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Be a Creator</span>
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

            {showFilters && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
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
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty</label>
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
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-8">
              <p className="font-semibold text-sm">Error loading courses:</p>
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

        {/* Categories Section */}
        <section className="mb-12">
          <RevealOnScroll direction="up" delay={500} duration={800}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <BookOpen className="w-6 h-6 text-brand-primary dark:text-brand-ninja-gold mr-2" />
              Browse by Category
            </h2>
          </RevealOnScroll>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.slice(0, 10).map((category, index) => (
              <RevealOnScroll key={category.id} direction="up" delay={600 + index * 100} duration={800}>
                <button
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`p-4 h-[10rem] w-[10rem] rounded-lg border-2 transition-all duration-300 text-center hover:shadow-lg ${
                    selectedCategory === category.slug
                      ? 'border-brand-primary bg-brand-primary bg-opacity-10 dark:bg-brand-ninja-gold dark:bg-opacity-10'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand-primary'
                  }`}
                >
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                    {category.name}
                  </h3>
                </button>
              </RevealOnScroll>
            ))}
          </div>
        </section>

        {featuredCourses.length > 0 && !searchTerm && (
          <section className="mb-12">
            <RevealOnScroll direction="up" delay={700} duration={800}>
              <div className="flex items-center mb-6">
                <Award className="w-6 h-6 text-brand-primary dark:text-brand-ninja-gold mr-2" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Courses</h2>
              </div>
            </RevealOnScroll>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Globe className="w-6 h-6 text-brand-primary dark:text-brand-ninja-gold mr-2" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {searchTerm ? 'Search Results' : selectedCategory === 'all' ? 'All Courses' : `${categories.find(c => c.slug === selectedCategory)?.name} Courses`}
                </h2>
              </div>
              {courses.length > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {courses.length} course{courses.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </RevealOnScroll>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course, index) => (
                <RevealOnScroll key={course.id} direction="up" delay={1000 + index * 100} duration={800}>
                  <CourseCard course={course} />
                </RevealOnScroll>
              ))}
            </div>
          ) : (
            <RevealOnScroll direction="up" delay={1000} duration={800}>
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No courses found
                </h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-500">
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