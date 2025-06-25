import { supabase } from '../lib/supabaseClient';
import { UserProfile, UserRole } from '../types';

export const getProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116: 'exact one row not found'
    console.error('Error fetching profile:', error);
    throw error;
  }
  return data as UserProfile | null;
};

export const getProfileByUsername = async (username: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116: 'exact one row not found'
    console.error('Error fetching profile by username:', error);
    throw error;
  }
  return data as UserProfile | null;
};

export const updateProfile = async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile> => {
  // Ensure 'i_am_a' is structured correctly if provided
  if (updates.i_am_a && typeof updates.i_am_a === 'string') {
    updates.i_am_a = { value: updates.i_am_a as UserRole };
  } else if (updates.i_am_a && typeof (updates.i_am_a as any).value === 'string') {
    updates.i_am_a = { value: (updates.i_am_a as any).value as UserRole };
  }

  // Check if username is being changed
  if (updates.username) {
    // Check if user can change username
    const { data: canChange, error: checkError } = await supabase.rpc('can_change_username', {
      p_user_id: userId
    });
    
    if (checkError) {
      console.error('Error checking username change eligibility:', checkError);
      throw new Error('Could not verify username change eligibility');
    }
    
    if (!canChange) {
      throw new Error('You have reached the maximum number of username changes (2)');
    }
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
  if (!data) {
    throw new Error('Profile update failed, no data returned.');
  }
  return data as UserProfile;
};

// Function to create a profile if one doesn't exist.
// Username should be handled carefully due to the "set once" rule.
// This might be called on first login or when user visits profile page for the first time.
export const createProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> => {
  // Ensure 'i_am_a' is structured correctly if provided and it's just a string value
  if (profileData.i_am_a && typeof (profileData.i_am_a as any).value === 'string') {
    profileData.i_am_a = { value: (profileData.i_am_a as any).value as UserRole };
  } else if (profileData.i_am_a && typeof profileData.i_am_a === 'string') {
    // If passed as string directly, wrap it
    profileData.i_am_a = { value: profileData.i_am_a as UserRole };
  }

  // Initialize username_changes_count to 0
  profileData.username_changes_count = 0;
  profileData.username_change_history = [];

  const { data, error } = await supabase
    .from('user_profiles')
    .insert({ ...profileData, user_id: userId })
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
  if (!data) {
    throw new Error('Profile creation failed, no data returned.');
  }
  return data as UserProfile;
};

// Check if user can change username
const canChangeUsername = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('can_change_username', {
      p_user_id: userId
    });
    
    if (error) {
      console.error('Error checking username change eligibility:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in canChangeUsername:', error);
    return false;
  }
};

// Get username change history
const getUsernameChangeHistory = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('username_change_history')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching username change history:', error);
      return [];
    }
    
    return data?.username_change_history || [];
  } catch (error) {
    console.error('Error in getUsernameChangeHistory:', error);
    return [];
  }
};