import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  UserCircle, 
  Briefcase, 
  GraduationCap, 
  Target, 
  MapPin, 
  Award, 
  ArrowLeft, 
  Building, 
  Calendar, 
  AlertTriangle, 
  Share2
} from 'lucide-react';
import { getProfileByUsername } from '../../services/profileService';
import { UserProfile, UserRole, UserSkill } from '../../types';
import usePageTitle from '../usePageTitle';
import { BRAND_NAME } from '../../constants';
import CodingBackground from '../CodingBackground';

const sectionIconProps = "w-5 h-5 mr-2 text-brand-primary dark:text-brand-ninja-gold";

const ProfileSectionCard: React.FC<{
  title: string, 
  icon: React.ElementType, 
  children: React.ReactNode, 
  id?: string
}> = ({ title, icon: Icon, children, id }) => {
  return (
    <section id={id} className="mb-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center">
          <Icon className={sectionIconProps} />
          <h2 className="text-xl font-semibold text-brand-dark-gray dark:text-brand-off-white">
            {title}
          </h2>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        {children}
      </div>
    </section>
  );
};

const PublicProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  console.log('PublicProfilePage: username from useParams:', username);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  usePageTitle(profile?.username ? `${profile.username}'s Profile` : "Profile");

  useEffect(() => {
    const loadProfile = async () => {
      if (!username) {
        setError('Username not provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const userProfile = await getProfileByUsername(username);
        console.log('PublicProfilePage: fetched userProfile:', userProfile);
        if (!userProfile) {
          setError('Profile not found');
        } else {
          setProfile(userProfile);
        }
      } catch (err: any) {
        console.error("Failed to load profile:", err);
        setError(err.message || "Could not load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [username]);

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

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertTriangle className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-brand-text dark:text-dark-text mb-2">Profile Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{error || "The profile you're looking for doesn't exist."}</p>
        <Link
          to="/"
          className="bg-brand-primary hover:bg-ninja-gold text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  // Get user info from profile
  const userFullName = profile.i_am_a?.value || "User";
  const userAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userFullName || 'User')}&background=random&color=fff&size=128`;
  const shortBio = profile.about_me ? (profile.about_me.length > 150 ? profile.about_me.substring(0, 150) + '...' : profile.about_me) : 'No bio yet.';
  const displayLocation = [profile.location_city_town, profile.location_country].filter(Boolean).join(', ') || 'Location not set';

  // Default banner URL from Figma
  const defaultBannerUrl = 'https://s3-alpha.figma.com/hub/file/2701591584/93cab340-b40e-42bd-9714-99f76b7df9db-cover.png';
  const bannerUrl = profile.banner_image_url || defaultBannerUrl;

  const shareProfile = () => {
    const profileUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: `${profile.username}'s Profile on ${BRAND_NAME}`,
        text: `Check out ${profile.username}'s profile on ${BRAND_NAME}`,
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
        alert('Profile link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy profile link. Please try again.');
      });
  };

  return (
    <div className="bg-gray-100 dark:bg-brand-dark-gray min-h-screen">
      <CodingBackground 
        intensity="low" 
        style="code"
        className="absolute inset-0 z-0"
      />
      
      <div className="container mx-auto px-2 sm:px-4 py-8 relative z-10">
        <Link
          to="/"
          className="inline-flex items-center text-brand-primary hover:text-brand-ninja-gold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
        
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
                {profile.username && (
                  <p className="text-sm text-brand-primary dark:text-brand-ninja-gold font-medium">
                    {`www.${BRAND_NAME.toLowerCase().split('.')[0]}.com/${profile.username}`}
                  </p>
                )}
                <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm md:text-base">{shortBio}</p>
                <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-2 space-y-0.5">
                  <p className="flex items-center justify-center lg:justify-start"><MapPin size={14} className="mr-1.5" /> {displayLocation}</p>
                  <p className="flex items-center justify-center lg:justify-start"><Building size={14} className="mr-1.5" /> {renderFieldValue(profile.college_name, 'College not set')}</p>
                  <p className="flex items-center justify-center lg:justify-start"><Calendar size={14} className="mr-1.5" /> Joined {new Date(profile.created_at || '').toLocaleDateString()}</p>
                </div>
              </div>

              {/* Share Button */}
              <div className="lg:ml-auto mt-4 lg:mt-0 flex flex-col space-y-2 items-center lg:items-end">
                <button
                  onClick={shareProfile}
                  className="flex items-center text-sm font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-md w-full lg:w-auto justify-center bg-brand-primary hover:bg-ninja-gold text-white"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <ProfileSectionCard title="Academic Details" icon={GraduationCap}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <p><strong className="font-medium text-gray-700 dark:text-gray-300">Institution:</strong> {renderFieldValue(profile.college_name)}</p>
            <p><strong className="font-medium text-gray-700 dark:text-gray-300">Course:</strong> {renderFieldValue(profile.course_name)}</p>
            <p><strong className="font-medium text-gray-700 dark:text-gray-300">Major:</strong> {renderFieldValue(profile.specialization)}</p>
            <p><strong className="font-medium text-gray-700 dark:text-gray-300">Duration:</strong> {renderFieldValue(profile.course_duration_text)}</p>
            <p><strong className="font-medium text-gray-700 dark:text-gray-300">Start Year:</strong> {renderFieldValue(profile.start_year)}</p>
            <p><strong className="font-medium text-gray-700 dark:text-gray-300">End Year:</strong> {renderFieldValue(profile.end_year_expected)}</p>
          </div>
        </ProfileSectionCard>
        
        <ProfileSectionCard title="Purpose & Goals" icon={Target}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <strong className="font-medium text-gray-700 dark:text-gray-300">Purpose of Joining {BRAND_NAME}:</strong>
              <p className="text-sm mt-1">{renderFieldValue(profile.purpose_joining)}</p>
            </div>
            <p><strong className="font-medium text-gray-700 dark:text-gray-300">Primary Career Goal:</strong> {renderFieldValue(profile.primary_career_goal)}</p>
          </div>
        </ProfileSectionCard>

        <ProfileSectionCard title="Location" icon={MapPin}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
            <p><strong className="font-medium text-gray-700 dark:text-gray-300">City/Town:</strong> {renderFieldValue(profile.location_city_town)}</p>
            <p><strong className="font-medium text-gray-700 dark:text-gray-300">State:</strong> {renderFieldValue(profile.location_state)}</p>
            <p><strong className="font-medium text-gray-700 dark:text-gray-300">Country:</strong> {renderFieldValue(profile.location_country)}</p>
          </div>
        </ProfileSectionCard>

        <ProfileSectionCard title="Skills" icon={Award}>
          <div>
            {profile.skills && profile.skills.length > 0 ? (
              <ul className="flex flex-wrap gap-3">
                {profile.skills.map((skill: UserSkill) => (
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
      </div>
    </div>
  );
};

export default PublicProfilePage;