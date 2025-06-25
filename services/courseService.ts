import { supabase } from '../lib/supabaseClient';
import { Course, CourseCategory, CreatorProfile, CreatorApplication } from '../types';

export interface CourseFilters {
  category?: string;
  difficulty?: string;
  search?: string;
  creator?: string;
  is_free?: boolean;
}

export const getCourses = async (filters: CourseFilters = {}): Promise<Course[]> => {
  let query = supabase
    .from('courses')
    .select(`
      *,
      creator:creator_profiles!inner(
        id,
        creator_name,
        avatar_url,
        is_verified,
        verification_badge_type
      ),
      category:course_categories!inner(
        id,
        name,
        slug,
        icon,
        color
      )
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (filters.category && filters.category !== 'all') {
    query = query.eq('course_categories.slug', filters.category);
  }

  if (filters.difficulty && filters.difficulty !== 'all') {
    query = query.eq('difficulty_level', filters.difficulty);
  }

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,tags.cs.{${filters.search}}`);
  }

  if (filters.is_free !== undefined) {
    query = query.eq('is_free', filters.is_free);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }

  return data as Course[];
};

export const getCourseBySlug = async (slug: string): Promise<Course | null> => {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      creator:creator_profiles!inner(
        id,
        creator_name,
        bio,
        avatar_url,
        youtube_channel_url,
        channel_name,
        subscriber_count,
        is_verified,
        verification_badge_type,
        website_url,
        linkedin_url,
        twitter_url,
        github_url
      ),
      category:course_categories!inner(
        id,
        name,
        slug,
        description,
        icon,
        color
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching course:', error);
    throw error;
  }

  if (data) {
    // Increment view count
    await supabase.rpc('increment_course_views', { course_id: data.id });
  }

  return data as Course | null;
};

export const getFeaturedCourses = async (limit: number = 6): Promise<Course[]> => {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      creator:creator_profiles!inner(
        id,
        creator_name,
        avatar_url,
        is_verified,
        verification_badge_type
      ),
      category:course_categories!inner(
        id,
        name,
        slug,
        icon,
        color
      )
    `)
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured courses:', error);
    throw error;
  }

  return data as Course[];
};

export const getCourseCategories = async (): Promise<CourseCategory[]> => {
  const { data, error } = await supabase
    .from('course_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching course categories:', error);
    throw error;
  }

  return data as CourseCategory[];
};

export const searchCourses = async (query: string): Promise<Course[]> => {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      creator:creator_profiles!inner(
        id,
        creator_name,
        avatar_url,
        is_verified
      ),
      category:course_categories!inner(
        id,
        name,
        slug,
        icon,
        color
      )
    `)
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error searching courses:', error);
    throw error;
  }

  return data as Course[];
};

// Creator Application Services
export const submitCreatorApplication = async (applicationData: Partial<CreatorApplication>): Promise<CreatorApplication> => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('creator_applications')
    .insert({
      ...applicationData,
      user_id: user.id,
      email: user.email,
      status: 'pending'
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting creator application:', error);
    throw error;
  }

  return data as CreatorApplication;
};

export const getCreatorApplication = async (userId: string): Promise<CreatorApplication | null> => {
  const { data, error } = await supabase
    .from('creator_applications')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching creator application:', error);
    throw error;
  }

  return data as CreatorApplication | null;
};

// Creator Profile Services
export const getCreatorProfile = async (userId: string): Promise<CreatorProfile | null> => {
  const { data, error } = await supabase
    .from('creator_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching creator profile:', error);
    throw error;
  }

  return data as CreatorProfile | null;
};

export const updateCreatorProfile = async (profileId: string, updates: Partial<CreatorProfile>): Promise<CreatorProfile> => {
  const { data, error } = await supabase
    .from('creator_profiles')
    .update(updates)
    .eq('id', profileId)
    .select()
    .single();

  if (error) {
    console.error('Error updating creator profile:', error);
    throw error;
  }

  return data as CreatorProfile;
};

// Course Management for Creators
export const createCourse = async (courseData: Partial<Course>): Promise<Course> => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  // Get creator profile
  const creatorProfile = await getCreatorProfile(user.id);
  if (!creatorProfile) {
    throw new Error('Creator profile not found');
  }

  const { data, error } = await supabase
    .from('courses')
    .insert({
      ...courseData,
      creator_id: creatorProfile.id,
      status: 'draft'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating course:', error);
    throw error;
  }

  return data as Course;
};

export const updateCourse = async (courseId: string, updates: Partial<Course>): Promise<Course> => {
  const { data, error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', courseId)
    .select()
    .single();

  if (error) {
    console.error('Error updating course:', error);
    throw error;
  }

  return data as Course;
};

export const getCreatorCourses = async (creatorId: string): Promise<Course[]> => {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      category:course_categories!inner(
        id,
        name,
        slug,
        icon,
        color
      )
    `)
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching creator courses:', error);
    throw error;
  }

  return data as Course[];
};

// Course Enrollment Services
export const enrollInCourse = async (courseId: string): Promise<void> => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('course_enrollments')
    .insert({
      course_id: courseId,
      user_id: user.id,
      status: 'enrolled'
    });

  if (error) {
    console.error('Error enrolling in course:', error);
    throw error;
  }
};

export const getUserEnrollments = async (userId: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('course_enrollments')
    .select(`
      *,
      course:courses!inner(
        id,
        title,
        slug,
        thumbnail_url,
        total_videos,
        total_duration_minutes,
        creator:creator_profiles!inner(
          creator_name,
          avatar_url
        )
      )
    `)
    .eq('user_id', userId)
    .order('enrolled_at', { ascending: false });

  if (error) {
    console.error('Error fetching user enrollments:', error);
    throw error;
  }

  return data || [];
};