import React, { useState, useEffect } from 'react';
import { X, Youtube, User, Award, Clock, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { submitCreatorApplication, getCreatorApplication } from '../services/courseService';
import { CreatorApplication } from '../types';

interface CreatorApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatorApplicationModal: React.FC<CreatorApplicationModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [existingApplication, setExistingApplication] = useState<CreatorApplication | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    youtube_channel_url: '',
    channel_name: '',
    subscriber_count: 0,
    experience_years: 1,
    expertise_areas: [] as string[],
    teaching_experience: '',
    sample_content_urls: [] as string[],
    motivation: '',
    previous_teaching_platforms: [] as string[],
    preferred_topics: [] as string[],
    availability_hours_per_week: 5
  });

  const expertiseOptions = [
    'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning',
    'Artificial Intelligence', 'Cybersecurity', 'Cloud Computing', 'DevOps',
    'UI/UX Design', 'Game Development', 'Blockchain', 'IoT', 'Programming Languages',
    'Database Management', 'System Administration', 'Digital Marketing'
  ];

  const topicOptions = [
    'Beginner Programming', 'Advanced Programming', 'Web Development Fundamentals',
    'React/Vue/Angular', 'Backend Development', 'Database Design', 'API Development',
    'Mobile App Development', 'Data Analysis', 'Machine Learning Basics',
    'AI Applications', 'Cybersecurity Fundamentals', 'Cloud Platforms',
    'DevOps Practices', 'UI/UX Design Principles', 'Project Management'
  ];

  const platformOptions = [
    'YouTube', 'Udemy', 'Coursera', 'edX', 'Skillshare', 'Pluralsight',
    'LinkedIn Learning', 'Khan Academy', 'FreeCodeCamp', 'Codecademy',
    'University/College', 'Corporate Training', 'Bootcamps', 'Workshops'
  ];

  useEffect(() => {
    if (isOpen && user) {
      loadExistingApplication();
      // Pre-fill user data
      setFormData(prev => ({
        ...prev,
        full_name: user.user_metadata?.full_name || ''
      }));
    }
  }, [isOpen, user]);

  const loadExistingApplication = async () => {
    if (!user) return;
    
    try {
      const application = await getCreatorApplication(user.id);
      if (application) {
        setExistingApplication(application);
        setFormData({
          full_name: application.full_name,
          youtube_channel_url: application.youtube_channel_url,
          channel_name: application.channel_name,
          subscriber_count: application.subscriber_count || 0,
          experience_years: application.experience_years,
          expertise_areas: application.expertise_areas || [],
          teaching_experience: application.teaching_experience,
          sample_content_urls: application.sample_content_urls || [],
          motivation: application.motivation,
          previous_teaching_platforms: application.previous_teaching_platforms || [],
          preferred_topics: application.preferred_topics || [],
          availability_hours_per_week: application.availability_hours_per_week || 5
        });
      }
    } catch (error) {
      console.error('Error loading existing application:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleMultiSelectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }));
  };

  const handleArrayInputChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).map((item, i) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as string[]), '']
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.full_name.trim()) {
      setErrorMessage('Full name is required');
      return false;
    }
    if (!formData.youtube_channel_url.trim()) {
      setErrorMessage('YouTube channel URL is required');
      return false;
    }
    if (!formData.youtube_channel_url.match(/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/)) {
      setErrorMessage('Please enter a valid YouTube channel URL');
      return false;
    }
    if (!formData.channel_name.trim()) {
      setErrorMessage('Channel name is required');
      return false;
    }
    if (formData.experience_years < 1) {
      setErrorMessage('Experience must be at least 1 year');
      return false;
    }
    if (formData.expertise_areas.length === 0) {
      setErrorMessage('Please select at least one expertise area');
      return false;
    }
    if (formData.teaching_experience.trim().length < 50) {
      setErrorMessage('Teaching experience description must be at least 50 characters');
      return false;
    }
    if (formData.motivation.trim().length < 100) {
      setErrorMessage('Motivation must be at least 100 characters');
      return false;
    }
    if (formData.preferred_topics.length === 0) {
      setErrorMessage('Please select at least one preferred topic');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!validateForm()) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Filter out empty URLs from sample content
      const cleanedData = {
        ...formData,
        sample_content_urls: formData.sample_content_urls.filter(url => url.trim() !== '')
      };

      await submitCreatorApplication(cleanedData);
      setSubmitStatus('success');
      
      // Close modal after success
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
      }, 2000);
    } catch (error: any) {
      console.error('Error submitting creator application:', error);
      setErrorMessage(error.message || 'Failed to submit application. Please try again.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (existingApplication && existingApplication.status !== 'rejected') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Application Status</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="text-center">
            {existingApplication.status === 'pending' && (
              <>
                <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Application Under Review
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your creator application is being reviewed by our team. We'll notify you once it's processed.
                </p>
              </>
            )}
            
            {existingApplication.status === 'approved' && (
              <>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Application Approved!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Congratulations! Your creator application has been approved. You can now create and manage courses.
                </p>
                <button
                  onClick={onClose}
                  className="bg-brand-primary hover:bg-brand-ninja-gold text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
                >
                  Start Creating
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500 to-pink-500">
          <div>
            <h2 className="text-2xl font-bold text-white">Become a Creator</h2>
            <p className="text-white text-opacity-90 text-sm mt-1">
              Share your knowledge and help others learn
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-white hover:text-gray-200 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-200 rounded-lg flex items-start">
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Application Submitted Successfully!</p>
                <p className="text-sm">We'll review your application and get back to you soon.</p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && errorMessage && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg flex items-start">
              <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Error:</p>
                <p className="text-sm">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <User className="w-5 h-5 mr-2 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* YouTube Channel Information */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Youtube className="w-5 h-5 mr-2 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">YouTube Channel</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    YouTube Channel URL *
                  </label>
                  <input
                    type="url"
                    name="youtube_channel_url"
                    value={formData.youtube_channel_url}
                    onChange={handleInputChange}
                    placeholder="https://www.youtube.com/@yourchannel"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Channel Name *
                  </label>
                  <input
                    type="text"
                    name="channel_name"
                    value={formData.channel_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subscriber Count (Approximate)
                  </label>
                  <input
                    type="number"
                    name="subscriber_count"
                    value={formData.subscriber_count}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Experience & Expertise */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Award className="w-5 h-5 mr-2 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Experience & Expertise</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Years of Experience *
                  </label>
                  <select
                    name="experience_years"
                    value={formData.experience_years}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:text-white"
                  >
                    {[...Array(20)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} year{i > 0 ? 's' : ''}</option>
                    ))}
                    <option value={21}>20+ years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Availability (Hours/Week)
                  </label>
                  <select
                    name="availability_hours_per_week"
                    value={formData.availability_hours_per_week}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:text-white"
                  >
                    <option value={5}>5 hours/week</option>
                    <option value={10}>10 hours/week</option>
                    <option value={15}>15 hours/week</option>
                    <option value={20}>20 hours/week</option>
                    <option value={30}>30+ hours/week</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expertise Areas * (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                  {expertiseOptions.map(option => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.expertise_areas.includes(option)}
                        onChange={() => handleMultiSelectChange('expertise_areas', option)}
                        className="mr-2 h-4 w-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Teaching Experience * (Min 50 characters)
                </label>
                <textarea
                  name="teaching_experience"
                  value={formData.teaching_experience}
                  onChange={handleInputChange}
                  rows={4}
                  required
                  placeholder="Describe your teaching experience, methodologies, and any formal education background..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.teaching_experience.length}/50 minimum</p>
              </div>
            </div>

            {/* Content & Motivation */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content & Motivation</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sample Content URLs (Optional)
                </label>
                {formData.sample_content_urls.map((url, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleArrayInputChange('sample_content_urls', index, e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('sample_content_urls', index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('sample_content_urls')}
                  className="text-purple-500 hover:text-purple-600 text-sm"
                >
                  + Add Sample URL
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Previous Teaching Platforms (Optional)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                  {platformOptions.map(platform => (
                    <label key={platform} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.previous_teaching_platforms.includes(platform)}
                        onChange={() => handleMultiSelectChange('previous_teaching_platforms', platform)}
                        className="mr-2 h-4 w-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Topics to Teach * (Select all that apply)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {topicOptions.map(topic => (
                    <label key={topic} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.preferred_topics.includes(topic)}
                        onChange={() => handleMultiSelectChange('preferred_topics', topic)}
                        className="mr-2 h-4 w-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{topic}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Why do you want to become a creator on TechXNinjas? * (Min 100 characters)
                </label>
                <textarea
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  rows={4}
                  required
                  placeholder="Share your motivation for joining our creator community and how you plan to contribute..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.motivation.length}/100 minimum</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-semibold py-2 px-6 rounded-lg transition duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatorApplicationModal;