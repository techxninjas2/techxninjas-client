import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  Star, 
  Clock, 
  Users, 
  Award, 
  CheckCircle, 
  Youtube, 
  ExternalLink, 
  Share2, 
  Copy, 
  Twitter, 
  Linkedin, 
  List, 
  BookOpen, 
  AlertCircle,
  MessageCircle,
  ThumbsUp,
  User,
  Globe
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getCourseBySlug, enrollInCourse } from '../../services/courseService';
import { Course } from '../../types';
import usePageTitle from '../usePageTitle';
import LazyImage from '../LazyImage';

const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  usePageTitle(course?.title || "Course Details");

  useEffect(() => {
    if (slug) {
      loadCourseDetails();
    }
  }, [slug]);

  const loadCourseDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!slug) {
        setError('Course not found');
        return;
      }

      const courseData = await getCourseBySlug(slug);
      if (!courseData) {
        setError('Course not found');
        return;
      }

      setCourse(courseData);
      
      // Check if user is enrolled
      // This would be implemented with a real API call in production
      setIsEnrolled(false);
    } catch (err: any) {
      console.error('Failed to load course details:', err);
      setError(err.message || 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      // Redirect to login or show login modal
      alert('Please log in to enroll in this course');
      return;
    }

    if (!course) return;

    setIsEnrolling(true);
    try {
      await enrollInCourse(course.id);
      setIsEnrolled(true);
      alert('Successfully enrolled in the course!');
    } catch (err: any) {
      console.error('Failed to enroll in course:', err);
      alert(err.message || 'Failed to enroll in course');
    } finally {
      setIsEnrolling(false);
    }
  };

  const shareCourse = async () => {
    if (navigator.share && course) {
      try {
        await navigator.share({
          title: course.title,
          text: course.short_description || course.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Course link copied to clipboard!');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Course link copied to clipboard!');
  };

  const openYouTubePlaylist = () => {
    if (course?.youtube_playlist_url) {
      window.open(course.youtube_playlist_url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-brand-dark-gray">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-brand-dark-gray">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Course Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'The course you are looking for does not exist.'}</p>
            <Link
              to="/courses"
              className="bg-brand-primary hover:bg-brand-ninja-gold text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
            >
              Back to Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark-gray">
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-brand-primary hover:text-brand-ninja-gold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Courses
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
              {/* Course Banner */}
              <div className="relative h-48 md:h-64 lg:h-80 bg-gray-200 dark:bg-gray-700">
                <LazyImage
                  src={course.banner_url || course.thumbnail_url || `https://picsum.photos/seed/${course.id}/1200/400`}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <button
                    onClick={openYouTubePlaylist}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transition-transform transform hover:scale-110"
                  >
                    <Play className="w-8 h-8" />
                  </button>
                </div>
              </div>

              {/* Course Header */}
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-brand-primary bg-opacity-10 text-brand-primary dark:bg-brand-ninja-gold dark:bg-opacity-10 dark:text-brand-ninja-gold text-xs font-medium px-2.5 py-1 rounded-full">
                    {course.category?.name}
                  </span>
                  <span className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                    {course.difficulty_level}
                  </span>
                  <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-2.5 py-1 rounded-full">
                    {course.language}
                  </span>
                  {course.is_free && (
                    <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium px-2.5 py-1 rounded-full">
                      Free
                    </span>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {course.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{course.average_rating.toFixed(1)}</span>
                    <span className="ml-1 text-gray-600 dark:text-gray-400">({course.total_reviews} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="ml-1 text-gray-600 dark:text-gray-400">{course.enrolled_count} students</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="ml-1 text-gray-600 dark:text-gray-400">
                      {Math.floor(course.total_duration_minutes / 60)}h {course.total_duration_minutes % 60}m
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Play className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="ml-1 text-gray-600 dark:text-gray-400">{course.total_videos} videos</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <LazyImage
                    src={course.creator?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.creator?.creator_name || 'Creator')}&background=random&color=fff&size=64`}
                    alt={course.creator?.creator_name || 'Creator'}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {course.creator?.creator_name}
                      </h3>
                      {course.creator?.is_verified && (
                        <span className="ml-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-1.5 py-0.5 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {course.creator?.subscriber_count?.toLocaleString() || '0'} subscribers
                    </p>
                  </div>
                </div>

                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex space-x-8">
                    {[
                      { id: 'overview', label: 'Overview', icon: BookOpen },
                      { id: 'content', label: 'Course Content', icon: List },
                      { id: 'reviews', label: 'Reviews', icon: Star }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? 'border-brand-primary text-brand-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Course Content Tabs */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About This Course</h2>
                    <div className="prose prose-gray dark:prose-invert max-w-none mb-6">
                      <p className="text-gray-700 dark:text-gray-300">{course.description}</p>
                    </div>

                    {course.learning_outcomes && course.learning_outcomes.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">What You'll Learn</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {course.learning_outcomes.map((outcome, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700 dark:text-gray-300">{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {course.prerequisites && course.prerequisites.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Prerequisites</h3>
                        <ul className="space-y-2">
                          {course.prerequisites.map((prerequisite, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-brand-primary dark:text-brand-ninja-gold mr-2">•</span>
                              <span className="text-gray-700 dark:text-gray-300">{prerequisite}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {course.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'content' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Course Content</h2>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">{course.total_videos} videos</span> • Total {Math.floor(course.total_duration_minutes / 60)}h {course.total_duration_minutes % 60}m
                      </div>
                      <a
                        href={course.youtube_playlist_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-brand-primary hover:text-brand-ninja-gold dark:text-brand-ninja-gold dark:hover:text-brand-primary flex items-center"
                      >
                        <Youtube className="w-4 h-4 mr-1" />
                        View on YouTube
                      </a>
                    </div>

                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Playlist Videos
                        </h3>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {course.total_videos} lessons
                        </span>
                      </div>
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {/* Mock video list - in a real app, you'd fetch the actual playlist videos */}
                        {[...Array(Math.min(5, course.total_videos))].map((_, index) => (
                          <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mr-3">
                                <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center">
                                  {index + 1}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {index === 0 ? 'Introduction to the Course' : `Lesson ${index + 1}: ${['Fundamentals', 'Core Concepts', 'Advanced Techniques', 'Practical Examples'][index % 4]}`}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {Math.floor(Math.random() * 20) + 5}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')} mins
                                </p>
                              </div>
                              <div className="ml-4">
                                <Play className="w-5 h-5 text-gray-400 hover:text-brand-primary dark:hover:text-brand-ninja-gold cursor-pointer" />
                              </div>
                            </div>
                          </div>
                        ))}
                        {course.total_videos > 5 && (
                          <div className="p-4 text-center">
                            <a
                              href={course.youtube_playlist_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-brand-primary hover:text-brand-ninja-gold dark:text-brand-ninja-gold dark:hover:text-brand-primary"
                            >
                              View all {course.total_videos} videos on YouTube
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Student Reviews</h2>
                    
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {course.average_rating.toFixed(1)}
                      </div>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= Math.round(course.average_rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {course.total_reviews} rating{course.total_reviews !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Mock reviews - in a real app, you'd fetch actual reviews */}
                    <div className="space-y-4">
                      {course.total_reviews > 0 ? (
                        [...Array(Math.min(3, course.total_reviews))].map((_, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < (5 - index % 2)
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {['John D.', 'Sarah M.', 'Robert K.'][index % 3]}
                                </span>
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {['2 weeks ago', '1 month ago', '3 months ago'][index % 3]}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mb-2">
                              {[
                                'This course is excellent! The instructor explains complex concepts in a way that\'s easy to understand.',
                                'Very comprehensive content. I learned a lot and was able to apply it to my projects right away.',
                                'Great course for beginners. The pace is perfect and the examples are practical.'
                              ][index % 3]}
                            </p>
                            <div className="flex items-center space-x-2">
                              <button className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                                <ThumbsUp className="w-3 h-3" />
                                <span>Helpful ({[12, 8, 5][index % 3]})</span>
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            No reviews yet
                          </h3>
                          <p className="text-gray-500 dark:text-gray-500">
                            Be the first to review this course after enrolling
                          </p>
                        </div>
                      )}
                    </div>

                    {course.total_reviews > 3 && (
                      <div className="mt-4 text-center">
                        <button className="text-brand-primary hover:text-brand-ninja-gold dark:text-brand-ninja-gold dark:hover:text-brand-primary font-medium">
                          View all {course.total_reviews} reviews
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {course.is_free ? 'Free' : '$29.99'}
                    </div>
                    {!isEnrolled ? (
                      <button
                        onClick={handleEnroll}
                        disabled={isEnrolling}
                        className="w-full bg-brand-primary hover:bg-brand-ninja-gold text-white font-semibold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isEnrolling ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                            Enrolling...
                          </>
                        ) : (
                          <>Enroll Now</>
                        )}
                      </button>
                    ) : (
                      <div className="w-full bg-green-500 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Enrolled
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Videos</span>
                      <span className="font-medium text-gray-900 dark:text-white">{course.total_videos}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Duration</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {Math.floor(course.total_duration_minutes / 60)}h {course.total_duration_minutes % 60}m
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Level</span>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">{course.difficulty_level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Language</span>
                      <span className="font-medium text-gray-900 dark:text-white">{course.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Students</span>
                      <span className="font-medium text-gray-900 dark:text-white">{course.enrolled_count.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <a
                      href={course.youtube_playlist_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                    >
                      <Youtube className="w-5 h-5 mr-2" />
                      Watch on YouTube
                    </a>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Share this course</h3>
                    <div className="flex justify-center space-x-3">
                      <button 
                        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(course.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Twitter className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                        className="p-2 text-gray-400 hover:text-blue-700 transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={shareCourse}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={copyLink}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">About the Creator</h3>
                <div className="flex items-center space-x-3 mb-3">
                  <LazyImage
                    src={course.creator?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.creator?.creator_name || 'Creator')}&background=random&color=fff&size=64`}
                    alt={course.creator?.creator_name || 'Creator'}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {course.creator?.creator_name}
                      </h4>
                      {course.creator?.is_verified && (
                        <span className="ml-1 text-blue-500">✓</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {course.creator?.total_courses} courses • {course.creator?.total_students?.toLocaleString()} students
                    </p>
                  </div>
                </div>
                
                {course.creator?.bio && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                    {course.creator.bio}
                  </p>
                )}

                <div className="flex space-x-2">
                  {course.creator?.youtube_channel_url && (
                    <a
                      href={course.creator.youtube_channel_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                      title="YouTube Channel"
                    >
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}
                  {course.creator?.website_url && (
                    <a
                      href={course.creator.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      title="Website"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                  {course.creator?.linkedin_url && (
                    <a
                      href={course.creator.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {course.creator?.twitter_url && (
                    <a
                      href={course.creator.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      title="Twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;