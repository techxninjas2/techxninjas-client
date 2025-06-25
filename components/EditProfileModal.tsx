import React, { useState, useEffect } from 'react';
import { X, Save, AlertTriangle, Info, User, MapPin, Briefcase, Target, Award, Plus, Trash2 } from 'lucide-react';
import { UserProfile, UserRole, Pronoun, MobileExtension, PrimaryCareerGoal, PurposeOfJoiningOptions, UserSkill, PurposeOfJoining } from '../types';
import { updateProfile } from '../services/profileService';
import { supabase } from '../lib/supabaseClient';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  profile, 
  onProfileUpdate 
}) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canChangeUsername, setCanChangeUsername] = useState(true);
  const [usernameChangesLeft, setUsernameChangesLeft] = useState(2);
  
  // Skills management
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillRating, setNewSkillRating] = useState<number>(3);

  useEffect(() => {
    if (isOpen && profile) {
      setFormData(profile);
      checkUsernameChangeEligibility();
    }
  }, [isOpen, profile]);

  const checkUsernameChangeEligibility = async () => {
    try {
      const { data, error } = await supabase.rpc('can_change_username', {
        p_user_id: profile.user_id
      });
      
      if (!error) {
        setCanChangeUsername(data);
        // Calculate changes left
        const changesUsed = profile.username_changes_count || 0;
        setUsernameChangesLeft(Math.max(0, 2 - changesUsed));
      }
    } catch (err) {
      console.error('Error checking username eligibility:', err);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === "whatsapp_same_as_mobile") {
      if (checked && formData.mobile_no) {
        setFormData(prev => ({ ...prev, whatsapp_no: prev.mobile_no }));
      } else if (!checked) {
        setFormData(prev => ({ ...prev, whatsapp_no: '' }));
      }
    }
  };

  const handleMultiSelectChange = (value: PurposeOfJoining) => {
    setFormData(prev => {
      const currentPurposes = Array.isArray(prev.purpose_joining) ? prev.purpose_joining : [];
      const newPurposes = currentPurposes.includes(value)
        ? currentPurposes.filter(item => item !== value)
        : [...currentPurposes, value];
      return { ...prev, purpose_joining: newPurposes };
    });
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill: UserSkill = { skill_name: newSkillName.trim(), rating: newSkillRating };
    setFormData(prev => ({
      ...prev,
      skills: [...(prev.skills || []), newSkill]
    }));
    setNewSkillName('');
    setNewSkillRating(3);
  };

  const handleRemoveSkill = (skillNameToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: (prev.skills || []).filter(skill => skill.skill_name !== skillNameToRemove)
    }));
  };

  const handleSave = async () => {
    if (formData.about_me && (formData.about_me.length < 50 || formData.about_me.length > 1000)) {
      setError("About Me must be between 50 and 1000 characters.");
      return;
    }

    // Check username change eligibility
    if (formData.username !== profile.username && !canChangeUsername) {
      setError("You have reached the maximum number of username changes (2).");
      return;
    }

    setIsSaving(true);
    setError(null);
    
    try {
      const dataToSave = { ...formData };
      if (dataToSave.i_am_a && typeof dataToSave.i_am_a === 'string') {
        dataToSave.i_am_a = { value: dataToSave.i_am_a as UserRole };
      } else if (dataToSave.i_am_a && typeof (dataToSave.i_am_a as any).value === 'string') {
        dataToSave.i_am_a = { value: (dataToSave.i_am_a as any).value as UserRole };
      }

      const updatedProfile = await updateProfile(profile.user_id, dataToSave);
      onProfileUpdate(updatedProfile);
      onClose();
    } catch (err: any) {
      console.error("Failed to save profile:", err);
      setError(err.message || "Could not save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-brand-primary to-brand-ninja-gold">
          <div>
            <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
            <p className="text-white text-opacity-90 text-sm mt-1">
              Update your professional information
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 text-white hover:text-gray-200 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg flex items-start">
              <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Error:</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {/* Personal Information Section */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <User className="w-5 h-5 mr-2 text-brand-primary dark:text-brand-ninja-gold" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username || ''}
                    onChange={handleChange}
                    disabled={!canChangeUsername}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm dark:bg-gray-600 dark:text-white ${
                      !canChangeUsername ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'border-gray-300 dark:border-gray-500'
                    }`}
                  />
                  <div className="mt-1 flex items-center text-xs">
                    <Info className="w-3 h-3 mr-1 text-gray-400" />
                    <span className="text-gray-500 dark:text-gray-400">
                      {canChangeUsername 
                        ? `${usernameChangesLeft} change${usernameChangesLeft !== 1 ? 's' : ''} remaining`
                        : 'Maximum changes reached (2/2)'
                      }
                    </span>
                  </div>
                </div>

                <div>
                  <label htmlFor="i_am_a" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    I am a
                  </label>
                  <select
                    name="i_am_a"
                    id="i_am_a"
                    value={(formData.i_am_a as any)?.value || formData.i_am_a || ''}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm dark:bg-gray-600 dark:text-white"
                  >
                    <option value="">Select...</option>
                    {Object.values(UserRole).map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="pronoun" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pronoun
                  </label>
                  <select
                    name="pronoun"
                    id="pronoun"
                    value={formData.pronoun || ''}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm dark:bg-gray-600 dark:text-white"
                  >
                    <option value="">Select...</option>
                    {Object.values(Pronoun).map(pronoun => (
                      <option key={pronoun} value={pronoun}>{pronoun}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="mobile_extension" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mobile Extension
                  </label>
                  <select
                    name="mobile_extension"
                    id="mobile_extension"
                    value={formData.mobile_extension || ''}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm dark:bg-gray-600 dark:text-white"
                  >
                    <option value="">Select...</option>
                    {Object.values(MobileExtension).map(ext => (
                      <option key={ext} value={ext}>{ext}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="mobile_no" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mobile No.
                  </label>
                  <input
                    type="tel"
                    name="mobile_no"
                    id="mobile_no"
                    value={formData.mobile_no || ''}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm dark:bg-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="whatsapp_no" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    WhatsApp No.
                  </label>
                  <input
                    type="tel"
                    name="whatsapp_no"
                    id="whatsapp_no"
                    value={formData.whatsapp_no || ''}
                    onChange={handleChange}
                    disabled={(formData.mobile_no === formData.whatsapp_no && !!formData.mobile_no)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm dark:bg-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500"
                  />
                  <div className="mt-2 flex items-center">
                    <input
                      type="checkbox"
                      id="whatsapp_same_as_mobile"
                      name="whatsapp_same_as_mobile"
                      checked={(formData.mobile_no === formData.whatsapp_no && !!formData.mobile_no)}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                    />
                    <label htmlFor="whatsapp_same_as_mobile" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Same as Mobile No.
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="about_me" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    About Me
                  </label>
                  <textarea
                    name="about_me"
                    id="about_me"
                    value={formData.about_me || ''}
                    onChange={handleChange}
                    rows={4}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm dark:bg-gray-600 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Min 50, Max 1000 characters. Current: {String(formData.about_me)?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Details Section */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Briefcase className="w-5 h-5 mr-2 text-brand-primary dark:text-brand-ninja-gold" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Academic Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="college_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    College/Institution Name
                  </label>
                  <input
                    type="text"
                    name="college_name"
                    id="college_name"
                    value={formData.college_name || ''}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm dark:bg-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="course_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current or Highest Course
                  </label>
                  <input
                    type="text"
                    name="course_name"
                    id="course_name"
                    value={formData.course_name || ''}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm dark:bg-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Specialization/Major
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    id="specialization"
                    value={formData.specialization || ''}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm dark:bg-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="course_duration_text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration of Course
                  </label>
                  <input
                    type="text"
                    name="course_duration_text"
                    id="course_duration_text"
                    value={formData.course_duration_text || ''}
                    onChange={handleChange}
                    placeholder="e.g., 3 years"
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm dark:bg-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="start_year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Year
                  </label>
                  <input
                    type="number"
                    name="start_year"
                    id="start_year"
                    value={formData.start_year || ''}
                    onChange={handleChange}
                    placeholder="YYYY"
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm dark:bg-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="end_year_expected" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Year (Expected)
                  </label>
                  <input
                    type="number"
                    name="end_year_expected"
                    id="end_year_expected"
                    value={formData.end_year_expected || ''}
                    onChange={handleChange}
                    placeholder="YYYY"
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm dark:bg-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Purpose & Goals Section */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Target className="w-5 h-5 mr-2 text-brand-primary dark:text-brand-ninja-gold" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Purpose & Goals</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Purpose of Joining TechXNinjas (Select multiple)
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {PurposeOfJoiningOptions.map(purpose => (
                      <div key={purpose} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`purpose-${purpose.replace(/\s+/g, '-')}`}
                          value={purpose}
                          checked={(formData.purpose_joining || []).includes(purpose)}
                          onChange={() => handleMultiSelectChange(purpose)}
                          className="h-4 w-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                        />
                        <label htmlFor={`purpose-${purpose.replace(/\s+/g, '-')}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {purpose}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="primary_career_goal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Primary Career Goal
                  </label>
                  <select
                    name="primary_career_goal"
                    id="primary_career_goal"
                    value={formData.primary_career_goal || ''}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm dark:bg-gray-600 dark:text-white"
                  >
                    <option value="">Select...</option>
                    {Object.values(PrimaryCareerGoal).map(goal => (
                      <option key={goal} value={goal}>{goal}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <MapPin className="w-5 h-5 mr-2 text-brand-primary dark:text-brand-ninja-gold" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Location</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="location_city_town" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City/Town
                  </label>
                  <input
                    type="text"
                    name="location_city_town"
                    id="location_city_town"
                    value={formData.location_city_town || ''}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm dark:bg-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="location_state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="location_state"
                    id="location_state"
                    value={formData.location_state || ''}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm dark:bg-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="location_country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="location_country"
                    id="location_country"
                    value={formData.location_country || ''}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm dark:bg-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Award className="w-5 h-5 mr-2 text-brand-primary dark:text-brand-ninja-gold" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Skills</h3>
              </div>
              
              {/* Add Skill Form */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 border border-dashed border-brand-primary dark:border-brand-ninja-gold rounded-lg items-end">
                <div className="flex-grow">
                  <label htmlFor="newSkillName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    id="newSkillName"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="e.g., React"
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm dark:bg-gray-600 dark:text-white"
                  />
                </div>
                <div className="sm:w-48">
                  <label htmlFor="newSkillRating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rating (1-5)
                  </label>
                  <select
                    id="newSkillRating"
                    value={newSkillRating.toString()}
                    onChange={(e) => setNewSkillRating(Number(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm dark:bg-gray-600 dark:text-white"
                  >
                    <option value="1">1 (Basic)</option>
                    <option value="2">2 (Familiar)</option>
                    <option value="3">3 (Intermediate)</option>
                    <option value="4">4 (Advanced)</option>
                    <option value="5">5 (Expert)</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300 flex items-center justify-center h-10 mt-2 sm:mt-0"
                >
                  <Plus className="w-5 h-5 mr-2" /> Add
                </button>
              </div>

              {/* Skills List */}
              <div>
                {formData.skills && formData.skills.length > 0 ? (
                  <ul className="flex flex-wrap gap-3">
                    {formData.skills.map(skill => (
                      <li key={skill.skill_name} className="bg-brand-primary bg-opacity-10 text-brand-primary dark:bg-brand-ninja-gold dark:bg-opacity-10 dark:text-brand-ninja-gold text-sm font-medium px-3 py-1.5 rounded-full flex items-center group">
                        {skill.skill_name} - <span className="ml-1.5 text-yellow-500">{"⭐".repeat(skill.rating)}<span className="text-gray-400">{"☆".repeat(5-skill.rating)}</span></span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill.skill_name)}
                          className="ml-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No skills added yet. Use the form above to add skills.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-semibold py-2 px-6 rounded-lg transition duration-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-brand-primary hover:bg-ninja-gold text-white font-semibold py-2 px-6 rounded-lg transition duration-300 flex items-center"
          >
            <Save className="w-5 h-5 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;