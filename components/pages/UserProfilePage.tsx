import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getProfile, updateProfile, createProfile } from '../../services/profileService';
import { UserProfile, UserRole, Pronoun, MobileExtension, PrimaryCareerGoal, PurposeOfJoiningOptions, UserSkill, PurposeOfJoining } from '../../types';
import usePageTitle from '../usePageTitle';
import { BRAND_NAME } from '../../constants';
import { Edit3, Save, X, Plus, Trash2, AlertTriangle, Info, UserCircle, Briefcase, GraduationCap, Target, MapPin, Award, Sparkles, Image as ImageIcon, Building, Users, Calendar, ExternalLink, Globe, Github, AlignCenterVertical as Certificate, BookOpen, Heart, Languages, Trophy, Share2, Link as LinkIcon, Copy } from 'lucide-react';
import AddSectionModal from '../AddSectionModal';
import EditProfileModal from '../EditProfileModal';
import CodingBackground from '../CodingBackground';

const sectionIconProps = "w-5 h-5 mr-2 text-brand-primary dark:text-brand-ninja-gold";

const ProfileSectionCard: React.FC<{
  title: string, 
  icon: React.ElementType, 
  children: React.ReactNode, 
  editMode?: boolean, 
  onEditClick?: () => void, 
  id?: string,
  completed?: boolean,
  recommended?: boolean
}> = ({ title, icon: Icon, children, editMode, onEditClick, id, completed = false, recommended = false }) => {
  return (
    <section id={id} className="mb-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center">
          <Icon className={sectionIconProps} />
          <h2 className="text-xl font-semibold text-brand-dark-gray dark:text-brand-off-white">
            {title}
          </h2>
          {completed && (
            <div className="ml-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          {recommended && (
            <span className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-2 py-0.5 rounded-full">
              Recommended
            </span>
          )}
        </div>
        {onEditClick && (
          <button
            onClick={onEditClick}
            className="flex items-center text-sm font-medium text-brand-primary hover:text-brand-ninja-gold dark:text-brand-ninja-gold dark:hover:text-brand-primary transition-colors"
          >
            <Edit3 className="w-4 h-4 mr-1" />
            Edit
          </button>
        )}
      </div>
      <div className="p-5 sm:p-6">
        {children}
      </div>
    </section>
  );
};

const UserProfilePage: React.FC = () => {
  usePageTitle("My Profile");
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [hasTriedLoading, setHasTriedLoading] = useState(false);
  const [shareTooltip, setShareTooltip] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    setHasTriedLoading(true);
    try {
      let userProfile = await getProfile(user.id);
      if (!userProfile) {
        const suggestedUsername = user.email?.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') || `user${Math.floor(Math.random() * 10000)}`;
        userProfile = await createProfile(user.id, {
          username: suggestedUsername,
          i_am_a: { value: UserRole.OTHERS },
        });
        alert(`Welcome! Your profile has been initialized. Please review and complete your details. Your username is set to "${suggestedUsername}". You can change this twice if you wish.`);
      }
      setProfile(userProfile);
      localStorage.setItem("userProfile", JSON.stringify(userProfile)); // Save to localStorage
    } catch (err: any) {
      console.error("Failed to load profile:", err);
      setError(err.message || "Could not load profile.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setIsLoading(false);
      setHasTriedLoading(true);
    } else {
      loadProfile();
    }
  }, [loadProfile]);

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile)); // ✅ Save updated profile
  };

  const shareProfile = () => {
    if (!profile?.username) {
      alert('Please set a username before sharing your profile.');
      return;
    }

    const profileUrl = `${window.location.origin}/profile/${profile.username}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${profile.username}'s Profile on ${BRAND_NAME}`,
        text: `Check out my profile on ${BRAND_NAME}`,
        url: profileUrl,
      }).catch(err => {
        console.error('Error sharing:', err);
        copyToClipboard(profileUrl);
      });
    } else {
      copyToClipboard(profileUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setShareTooltip(true);
        setTimeout(() => setShareTooltip(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy profile link. Please try again.');
      });
  };

  const renderFieldValue = (value: any, defaultValue: string = "N/A") => {
    if (value === null || typeof value === 'undefined' || (typeof value === 'string' && value.trim() === '')) return defaultValue;
    if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : defaultValue;
    if (typeof value === 'object' && 'value' in value) return String((value as {value: string}).value) || defaultValue;
    return String(value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertTriangle className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-gray-600 dark:text-gray-400">Please log in to view your profile.</p>
      </div>
    );
  }

  if (hasTriedLoading && !profile && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertTriangle className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-brand-text dark:text-dark-text mb-2">Profile Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">We couldn't find your profile. It might be an issue on our end or your profile is not yet created.</p>
        <button
          onClick={loadProfile}
          className="bg-brand-primary hover:bg-ninja-gold text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
        >
          Retry Loading Profile
        </button>
        {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">Error: {error}</p>}
      </div>
    );
  }

  const userFullName = user.user_metadata?.full_name || user.email;
  const userAvatarUrl = user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userFullName || 'User')}&background=random&color=fff&size=128`;
  const shortBio = profile?.about_me ? (profile.about_me.length > 150 ? profile.about_me.substring(0, 150) + '...' : profile.about_me) : 'No bio yet.';
  const displayLocation = [profile?.location_city_town, profile?.location_country].filter(Boolean).join(', ') || 'Location not set';

  // Default banner URL from Figma
  const defaultBannerUrl = 'https://s3-alpha.figma.com/hub/file/2701591584/93cab340-b40e-42bd-9714-99f76b7df9db-cover.png';
  const bannerUrl = profile?.banner_image_url || defaultBannerUrl;

  // Calculate profile completion
  const profileFields = [
    profile?.username,
    profile?.about_me,
    profile?.college_name,
    profile?.course_name,
    profile?.location_city_town,
    profile?.skills && profile.skills.length > 0,
    profile?.primary_career_goal,
    profile?.purpose_joining && profile.purpose_joining.length > 0
  ];
  const completedFields = profileFields.filter(Boolean).length;
  const completionPercentage = Math.round((completedFields / profileFields.length) * 100);

  return (
    <div className="bg-gray-100 dark:bg-brand-dark-gray min-h-screen">
      <CodingBackground 
        intensity="low" 
        style="code"
        className="absolute inset-0 z-0"
      />
      
      <div className="container mx-auto px-2 sm:px-4 py-8 relative z-10">
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden mb-8 border border-gray-200 dark:border-gray-700">
          {/* Banner Image */}
          <div 
            className="h-48 md:h-64 lg:h-80 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${bannerUrl})` }}
          />

          {/* Profile Info */}
          <div className="p-6 md:p-8 relative">
            <div className="flex flex-col lg:flex-row">
              {/* Profile Picture */}
              <div className="-mt-16 sm:-mt-24 md:-mt-32 z-10 mb-4 lg:mb-0 lg:mr-6 flex justify-center lg:justify-start">
                <img 
                  src={userAvatarUrl} 
                  alt={userFullName} 
                  className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full border-4 border-white dark:border-gray-800 shadow-lg bg-gray-200 dark:bg-gray-700 object-cover"
                />
              </div>

              {/* Text Info */}
              <div className="flex-grow pt-2 text-center lg:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-brand-dark-gray dark:text-brand-off-white">{userFullName}</h1>
                {profile?.username && (
                  <p className="text-sm text-brand-primary dark:text-brand-ninja-gold font-medium">
                    {`www.${BRAND_NAME.toLowerCase().split('.')[0]}.com/${profile.username}`}
                  </p>
                )}
                <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm md:text-base">{shortBio}</p>
                <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-2 space-y-0.5">
                  <p className="flex items-center justify-center lg:justify-start"><MapPin size={14} className="mr-1.5" /> {displayLocation}</p>
                  <p className="flex items-center justify-center lg:justify-start"><Building size={14} className="mr-1.5" /> {renderFieldValue(profile?.college_name, 'College not set')}</p>
                  <p className="flex items-center justify-center lg:justify-start"><Users size={14} className="mr-1.5" /> 500+ Connections</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="lg:ml-auto mt-4 lg:mt-0 flex flex-col space-y-2 items-center lg:items-end">
                <button
                  onClick={() => setIsEditProfileModalOpen(true)}
                  className="flex items-center text-sm font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-md w-full lg:w-auto justify-center bg-brand-primary hover:bg-ninja-gold text-white"
                >
                  <Edit3 className="w-5 h-5 mr-2" />
                  Edit Profile
                </button>
                <button
                  onClick={shareProfile}
                  className="flex items-center text-sm font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-md w-full lg:w-auto justify-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 relative"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Profile
                  {shareTooltip && (
                    <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded shadow-lg">
                      Link copied!
                    </span>
                  )}
                </button>
                <button
                  onClick={() => alert("AI Profile Enhancement Coming Soon!")}
                  className="flex items-center text-sm font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white w-full lg:w-auto justify-center"
                >
                  <Sparkles className="w-5 h-5 mr-2" /> Enhance with AI
                </button>
              </div>
            </div>

            {/* Profile Completion Bar */}
            <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile Strength</span>
                <span className="text-sm font-bold text-brand-primary dark:text-brand-ninja-gold">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-brand-primary to-brand-ninja-gold h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Complete your profile to increase visibility and opportunities
              </p>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-md">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        <ProfileSectionCard title="Academic Details" icon={GraduationCap} completed={!!profile?.college_name && !!profile?.course_name}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <p><strong className="font-medium text-gray-700 dark:text-gray-300">Institution:</strong> {renderFieldValue(profile?.college_name)}</p>
            <p><strong className="font-medium text-gray-700 dark:text-gray-300">Course:</strong> {renderFieldValue(profile?.course_name)}</p>
            <p><strong className="font-medium text-gray-700 dark:text-gray-300">Major:</strong> {renderFieldValue(profile?.specialization)}</p>
            <p><strong className="font-medium text-gray-700 dark:text-gray-300">Duration:</strong> {renderFieldValue(profile?.course_duration_text)}</p>
            <p><strong className="font-medium text-gray-700 dark:text-gray-300">Start Year:</strong> {renderFieldValue(profile?.start_year)}</p>
            <p><strong className="font-medium text-gray-700 dark:text-gray-300">End Year:</strong> {renderFieldValue(profile?.end_year_expected)}</p>
          </div>
        </ProfileSectionCard>
        
        <ProfileSectionCard title="Purpose & Goals" icon={Target} completed={!!profile?.primary_career_goal && !!profile?.purpose_joining?.length}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <strong className="font-medium text-gray-700 dark:text-gray-300">Purpose of Joining {BRAND_NAME}:</strong>
              <p className="text-sm mt-1">{renderFieldValue(profile?.purpose_joining)}</p>
            </div>
            <p><strong className="font-medium text-gray-700 dark:text-gray-300">Primary Career Goal:</strong> {renderFieldValue(profile?.primary_career_goal)}</p>
          </div>
        </ProfileSectionCard>

        <ProfileSectionCard title="Location" icon={MapPin} completed={!!profile?.location_city_town && !!profile?.location_country}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
            <p><strong className="font-medium text-gray-700 dark:text-gray-300">City/Town:</strong> {renderFieldValue(profile?.location_city_town)}</p>
            <p><strong className="font-medium text-gray-700 dark:text-gray-300">State:</strong> {renderFieldValue(profile?.location_state)}</p>
            <p><strong className="font-medium text-gray-700 dark:text-gray-300">Country:</strong> {renderFieldValue(profile?.location_country)}</p>
          </div>
        </ProfileSectionCard>

        <ProfileSectionCard title="Skills" icon={Award} completed={!!profile?.skills?.length}>
          <div>
            {profile?.skills && profile.skills.length > 0 ? (
              <ul className="flex flex-wrap gap-3">
                {profile.skills.map(skill => (
                  <li key={skill.skill_name} className="bg-brand-primary bg-opacity-10 text-brand-primary dark:bg-brand-ninja-gold dark:bg-opacity-10 dark:text-brand-ninja-gold text-sm font-medium px-3 py-1.5 rounded-full flex items-center">
                    {skill.skill_name} - <span className="ml-1.5 text-yellow-500">{"⭐".repeat(skill.rating)}<span className="text-gray-400">{"☆".repeat(5-skill.rating)}</span></span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No skills listed.</p>
            )}
          </div>
        </ProfileSectionCard>

        {/* Add Section Button */}
        <div className="flex justify-center my-8">
          <button
            onClick={() => setIsAddSectionModalOpen(true)}
            className="flex items-center bg-brand-primary hover:bg-brand-ninja-gold text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Section
          </button>
        </div>

        {/* Add Section Modal */}
        <AddSectionModal 
          isOpen={isAddSectionModalOpen} 
          onClose={() => setIsAddSectionModalOpen(false)} 
        />

        {/* Edit Profile Modal */}
        {profile && (
          <EditProfileModal
            isOpen={isEditProfileModalOpen}
            onClose={() => setIsEditProfileModalOpen(false)}
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;