import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Star, 
  BarChart2, 
  Youtube, 
  Settings, 
  AlertCircle, 
  CheckCircle,
  Clock,
  FileText,
  User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getCreatorProfile, getCreatorCourses } from '../../services/courseService';
import { Course, CreatorProfile } from '../../types';
import usePageTitle from '../usePageTitle';
import LazyImage from '../LazyImage';

const CreatorDashboardPage: React.FC = () => {
  usePageTitle("Creator Dashboard");
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('courses');

  useEffect(() => {
    if (user) {
      loadCreatorData();
    }
  }, [user]);

  const loadCreatorData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        setError('You must be logged in to access the creator dashboard');
        return;
      }

      const profile = await getCreatorProfile(user.id);
      if (!profile) {
        setError('Creator profile not found. Please apply to become a creator first.');
        return;
      }

      setCreatorProfile(profile);
      
      const coursesData = await getCreatorCourses(profile.id);
      setCourses(coursesData);
    } catch (err: any) {
      console.error('Failed to load creator data:', err);
      setError(err.message || 'Failed to load creator data');
    } finally {
      setLoading(false);
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

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-brand-dark-gray">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Access Denied</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'You must be logged in to access the creator dashboard'}</p>
            {!user ? (
              <button
                onClick={() => navigate('/')}
                className="bg-brand-primary hover:bg-brand-ninja-gold text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
              >
                Go to Login
              </button>
            ) : (
              <Link
                to="/courses"
                className="bg-brand-primary hover:bg-brand-ninja-gold text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
              >
                Apply to Become a Creator
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!creatorProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-brand-dark-gray">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <User className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Creator Profile Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You don't have a creator profile yet. Please apply to become a creator first.
            </p>
            <Link
              to="/courses"
              className="bg-brand-primary hover:bg-brand-ninja-gold text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
            >
              Apply to Become a Creator
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark-gray">
      <div className="container mx-auto px-4 py-6">
        <Link
          to="/courses"
          className="flex items-center text-brand-primary hover:text-brand-ninja-gold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Courses
        </Link>

        {/* Creator Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <LazyImage
              src={creatorProfile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(creatorProfile.creator_name)}&background=random&color=fff&size=128`}
              alt={creatorProfile.creator_name}
              className="w-24 h-24 rounded-full"
            />
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {creatorProfile.creator_name}
                </h1>
                {creatorProfile.is_verified && (
                  <span className="inline-flex items-center bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified Creator
                  </span>
                )}
                {creatorProfile.verification_badge_type && (
                  <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${
                    {
                      'bronze': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
                      'silver': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
                      'gold': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                      'platinum': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    }[creatorProfile.verification_badge_type]
                  }`}>
                    {creatorProfile.verification_badge_type.charAt(0).toUpperCase() + creatorProfile.verification_badge_type.slice(1)} Creator
                  </span>
                )}
              </div>
              
              {creatorProfile.bio && (
                <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-3xl">
                  {creatorProfile.bio}
                </p>
              )}
              
              <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{creatorProfile.total_courses}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{creatorProfile.total_students.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{creatorProfile.average_rating.toFixed(1)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{creatorProfile.total_reviews}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{creatorProfile.subscriber_count.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">YouTube Subscribers</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {creatorProfile.youtube_channel_url && (
                  <a
                    href={creatorProfile.youtube_channel_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 px-3 py-1.5 rounded-lg text-sm transition-colors"
                  >
                    <Youtube className="w-4 h-4 mr-1.5" />
                    YouTube Channel
                  </a>
                )}
                <button
                  onClick={() => setActiveTab('settings')}
                  className="inline-flex items-center bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 px-3 py-1.5 rounded-lg text-sm transition-colors"
                >
                  <Settings className="w-4 h-4 mr-1.5" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'courses', label: 'My Courses', icon: FileText },
                { id: 'analytics', label: 'Analytics', icon: BarChart2 },
                { id: 'students', label: 'Students', icon: Users },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-brand-primary text-brand-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'courses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Courses</h2>
                  <button className="bg-brand-primary hover:bg-brand-ninja-gold text-white font-semibold py-2 px-4 rounded-lg transition duration-300 flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Course
                  </button>
                </div>

                {courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <div key={course.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="relative h-40">
                          <LazyImage
                            src={course.thumbnail_url || `https://picsum.photos/seed/${course.id}/400/200`}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              course.status === 'published' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : course.status === 'draft'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            }`}>
                              {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                            {course.title}
                          </h3>
                          
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>
                              {Math.floor(course.total_duration_minutes / 60)}h {course.total_duration_minutes % 60}m
                            </span>
                            <span className="mx-2">•</span>
                            <Play className="w-4 h-4 mr-1" />
                            <span>{course.total_videos} videos</span>
                          </div>
                          
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="ml-1 text-sm text-gray-700 dark:text-gray-300">
                                {course.average_rating.toFixed(1)} ({course.total_reviews})
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              <span className="ml-1 text-sm text-gray-700 dark:text-gray-300">
                                {course.enrolled_count}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Link
                              to={`/courses/${course.slug}`}
                              className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-medium py-2 px-3 rounded-lg transition duration-300 text-center text-sm"
                            >
                              <Eye className="w-4 h-4 inline mr-1" />
                              View
                            </Link>
                            <button className="flex-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 font-medium py-2 px-3 rounded-lg transition duration-300 text-sm">
                              <Edit className="w-4 h-4 inline mr-1" />
                              Edit
                            </button>
                            <button className="bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 font-medium py-2 px-3 rounded-lg transition duration-300 text-sm">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      No courses yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-500 mb-6">
                      Start creating your first course to share your knowledge
                    </p>
                    <button className="bg-brand-primary hover:bg-brand-ninja-gold text-white font-semibold py-2 px-6 rounded-lg transition duration-300 flex items-center mx-auto">
                      <Plus className="w-5 h-5 mr-2" />
                      Create Your First Course
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Views</h3>
                      <Eye className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {(Math.floor(Math.random() * 10000) + 1000).toLocaleString()}
                    </p>
                    <p className="text-xs text-green-500 mt-1">
                      +{Math.floor(Math.random() * 20) + 5}% from last month
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">New Enrollments</h3>
                      <Users className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {(Math.floor(Math.random() * 500) + 50).toLocaleString()}
                    </p>
                    <p className="text-xs text-green-500 mt-1">
                      +{Math.floor(Math.random() * 15) + 3}% from last month
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</h3>
                      <CheckCircle className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.floor(Math.random() * 30) + 40}%
                    </p>
                    <p className="text-xs text-red-500 mt-1">
                      -{Math.floor(Math.random() * 5) + 1}% from last month
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Rating</h3>
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {(Math.random() * 1 + 4).toFixed(1)}
                    </p>
                    <p className="text-xs text-green-500 mt-1">
                      +{(Math.random() * 0.5).toFixed(1)} from last month
                    </p>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Course Performance</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Views</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Enrollments</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Completion</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {courses.map((course) => (
                          <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8">
                                  <LazyImage
                                    src={course.thumbnail_url || `https://picsum.photos/seed/${course.id}/40/40`}
                                    alt={course.title}
                                    className="h-8 w-8 rounded"
                                  />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                                    {course.title}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {course.view_count.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {course.enrolled_count.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {Math.floor(course.completed_count / (course.enrolled_count || 1) * 100)}%
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="ml-1 text-sm text-gray-700 dark:text-gray-300">
                                  {course.average_rating.toFixed(1)}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Students</h2>
                
                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Student Demographics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Top Countries</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">India</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">42%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-gray-700 dark:text-gray-300">United States</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">28%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-gray-700 dark:text-gray-300">United Kingdom</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">15%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Experience Level</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">Beginner</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">55%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '55%' }}></div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-gray-700 dark:text-gray-300">Intermediate</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">35%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-gray-700 dark:text-gray-300">Advanced</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">10%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Completion Rate</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">Completed</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">38%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '38%' }}></div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-gray-700 dark:text-gray-300">In Progress</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">45%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-gray-700 dark:text-gray-300">Inactive</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">17%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '17%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Enrollments</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Enrolled On</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Progress</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {/* Mock data - in a real app, you'd fetch actual enrollments */}
                        {[...Array(5)].map((_, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8">
                                  <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Wilson'][index])}&background=random&color=fff&size=32`}
                                    alt=""
                                    className="h-8 w-8 rounded-full"
                                  />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Wilson'][index]}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {courses[index % courses.length]?.title || 'Course Title'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {['2 days ago', '1 week ago', '2 weeks ago', '3 weeks ago', '1 month ago'][index]}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                                <div 
                                  className="bg-brand-primary h-2.5 rounded-full" 
                                  style={{ width: `${[75, 45, 20, 90, 10][index]}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {[75, 45, 20, 90, 10][index]}% complete
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h2>
                
                <form className="space-y-6">
                  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Creator Name
                        </label>
                        <input
                          type="text"
                          defaultValue={creatorProfile.creator_name}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-600 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          YouTube Channel URL
                        </label>
                        <input
                          type="url"
                          defaultValue={creatorProfile.youtube_channel_url}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-600 dark:text-white"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Bio
                        </label>
                        <textarea
                          defaultValue={creatorProfile.bio || ''}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-600 dark:text-white"
                          placeholder="Tell students about yourself, your experience, and teaching style..."
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Maximum 1000 characters
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Social Links</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Website URL
                        </label>
                        <input
                          type="url"
                          defaultValue={creatorProfile.website_url || ''}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-600 dark:text-white"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          LinkedIn URL
                        </label>
                        <input
                          type="url"
                          defaultValue={creatorProfile.linkedin_url || ''}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-600 dark:text-white"
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Twitter URL
                        </label>
                        <input
                          type="url"
                          defaultValue={creatorProfile.twitter_url || ''}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-600 dark:text-white"
                          placeholder="https://twitter.com/yourhandle"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          GitHub URL
                        </label>
                        <input
                          type="url"
                          defaultValue={creatorProfile.github_url || ''}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-600 dark:text-white"
                          placeholder="https://github.com/yourusername"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="mr-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-semibold py-2 px-6 rounded-lg transition duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-brand-primary hover:bg-brand-ninja-gold text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboardPage;