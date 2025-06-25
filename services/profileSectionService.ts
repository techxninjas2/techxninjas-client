import { supabase } from '../lib/supabaseClient';
import { 
  ProfileEducation, 
  ProfileExperience, 
  ProfileProject, 
  ProfileCertification, 
  ProfileCourse, 
  ProfileVolunteer, 
  ProfileLanguage, 
  ProfileHonor 
} from '../types';

// Education Services
export const getEducation = async (userId: string): Promise<ProfileEducation[]> => {
  const { data, error } = await supabase
    .from('profile_education')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching education:', error);
    throw error;
  }
  return data as ProfileEducation[];
};

export const createEducation = async (userId: string, education: Partial<ProfileEducation>): Promise<ProfileEducation> => {
  const { data, error } = await supabase
    .from('profile_education')
    .insert({ ...education, user_id: userId })
    .select()
    .single();

  if (error) {
    console.error('Error creating education:', error);
    throw error;
  }
  return data as ProfileEducation;
};

export const updateEducation = async (id: string, education: Partial<ProfileEducation>): Promise<ProfileEducation> => {
  const { data, error } = await supabase
    .from('profile_education')
    .update(education)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating education:', error);
    throw error;
  }
  return data as ProfileEducation;
};

export const deleteEducation = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('profile_education')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting education:', error);
    throw error;
  }
};

// Experience Services
export const getExperience = async (userId: string): Promise<ProfileExperience[]> => {
  const { data, error } = await supabase
    .from('profile_experience')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching experience:', error);
    throw error;
  }
  return data as ProfileExperience[];
};

export const createExperience = async (userId: string, experience: Partial<ProfileExperience>): Promise<ProfileExperience> => {
  const { data, error } = await supabase
    .from('profile_experience')
    .insert({ ...experience, user_id: userId })
    .select()
    .single();

  if (error) {
    console.error('Error creating experience:', error);
    throw error;
  }
  return data as ProfileExperience;
};

export const updateExperience = async (id: string, experience: Partial<ProfileExperience>): Promise<ProfileExperience> => {
  const { data, error } = await supabase
    .from('profile_experience')
    .update(experience)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating experience:', error);
    throw error;
  }
  return data as ProfileExperience;
};

export const deleteExperience = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('profile_experience')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting experience:', error);
    throw error;
  }
};

// Projects Services
export const getProjects = async (userId: string): Promise<ProfileProject[]> => {
  const { data, error } = await supabase
    .from('profile_projects')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
  return data as ProfileProject[];
};

export const createProject = async (userId: string, project: Partial<ProfileProject>): Promise<ProfileProject> => {
  const { data, error } = await supabase
    .from('profile_projects')
    .insert({ ...project, user_id: userId })
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    throw error;
  }
  return data as ProfileProject;
};

export const updateProject = async (id: string, project: Partial<ProfileProject>): Promise<ProfileProject> => {
  const { data, error } = await supabase
    .from('profile_projects')
    .update(project)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    throw error;
  }
  return data as ProfileProject;
};

export const deleteProject = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('profile_projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Certifications Services
export const getCertifications = async (userId: string): Promise<ProfileCertification[]> => {
  const { data, error } = await supabase
    .from('profile_certifications')
    .select('*')
    .eq('user_id', userId)
    .order('issue_date', { ascending: false });

  if (error) {
    console.error('Error fetching certifications:', error);
    throw error;
  }
  return data as ProfileCertification[];
};

export const createCertification = async (userId: string, certification: Partial<ProfileCertification>): Promise<ProfileCertification> => {
  const { data, error } = await supabase
    .from('profile_certifications')
    .insert({ ...certification, user_id: userId })
    .select()
    .single();

  if (error) {
    console.error('Error creating certification:', error);
    throw error;
  }
  return data as ProfileCertification;
};

export const updateCertification = async (id: string, certification: Partial<ProfileCertification>): Promise<ProfileCertification> => {
  const { data, error } = await supabase
    .from('profile_certifications')
    .update(certification)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating certification:', error);
    throw error;
  }
  return data as ProfileCertification;
};

export const deleteCertification = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('profile_certifications')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting certification:', error);
    throw error;
  }
};

// Courses Services
export const getCourses = async (userId: string): Promise<ProfileCourse[]> => {
  const { data, error } = await supabase
    .from('profile_courses')
    .select('*')
    .eq('user_id', userId)
    .order('completion_date', { ascending: false });

  if (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
  return data as ProfileCourse[];
};

export const createCourse = async (userId: string, course: Partial<ProfileCourse>): Promise<ProfileCourse> => {
  const { data, error } = await supabase
    .from('profile_courses')
    .insert({ ...course, user_id: userId })
    .select()
    .single();

  if (error) {
    console.error('Error creating course:', error);
    throw error;
  }
  return data as ProfileCourse;
};

export const updateCourse = async (id: string, course: Partial<ProfileCourse>): Promise<ProfileCourse> => {
  const { data, error } = await supabase
    .from('profile_courses')
    .update(course)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating course:', error);
    throw error;
  }
  return data as ProfileCourse;
};

export const deleteCourse = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('profile_courses')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// Volunteer Services
export const getVolunteer = async (userId: string): Promise<ProfileVolunteer[]> => {
  const { data, error } = await supabase
    .from('profile_volunteer')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching volunteer experience:', error);
    throw error;
  }
  return data as ProfileVolunteer[];
};

export const createVolunteer = async (userId: string, volunteer: Partial<ProfileVolunteer>): Promise<ProfileVolunteer> => {
  const { data, error } = await supabase
    .from('profile_volunteer')
    .insert({ ...volunteer, user_id: userId })
    .select()
    .single();

  if (error) {
    console.error('Error creating volunteer experience:', error);
    throw error;
  }
  return data as ProfileVolunteer;
};

export const updateVolunteer = async (id: string, volunteer: Partial<ProfileVolunteer>): Promise<ProfileVolunteer> => {
  const { data, error } = await supabase
    .from('profile_volunteer')
    .update(volunteer)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating volunteer experience:', error);
    throw error;
  }
  return data as ProfileVolunteer;
};

export const deleteVolunteer = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('profile_volunteer')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting volunteer experience:', error);
    throw error;
  }
};

// Languages Services
export const getLanguages = async (userId: string): Promise<ProfileLanguage[]> => {
  const { data, error } = await supabase
    .from('profile_languages')
    .select('*')
    .eq('user_id', userId)
    .order('language_name', { ascending: true });

  if (error) {
    console.error('Error fetching languages:', error);
    throw error;
  }
  return data as ProfileLanguage[];
};

export const createLanguage = async (userId: string, language: Partial<ProfileLanguage>): Promise<ProfileLanguage> => {
  const { data, error } = await supabase
    .from('profile_languages')
    .insert({ ...language, user_id: userId })
    .select()
    .single();

  if (error) {
    console.error('Error creating language:', error);
    throw error;
  }
  return data as ProfileLanguage;
};

export const updateLanguage = async (id: string, language: Partial<ProfileLanguage>): Promise<ProfileLanguage> => {
  const { data, error } = await supabase
    .from('profile_languages')
    .update(language)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating language:', error);
    throw error;
  }
  return data as ProfileLanguage;
};

export const deleteLanguage = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('profile_languages')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting language:', error);
    throw error;
  }
};

// Honors Services
export const getHonors = async (userId: string): Promise<ProfileHonor[]> => {
  const { data, error } = await supabase
    .from('profile_honors')
    .select('*')
    .eq('user_id', userId)
    .order('issue_date', { ascending: false });

  if (error) {
    console.error('Error fetching honors:', error);
    throw error;
  }
  return data as ProfileHonor[];
};

export const createHonor = async (userId: string, honor: Partial<ProfileHonor>): Promise<ProfileHonor> => {
  const { data, error } = await supabase
    .from('profile_honors')
    .insert({ ...honor, user_id: userId })
    .select()
    .single();

  if (error) {
    console.error('Error creating honor:', error);
    throw error;
  }
  return data as ProfileHonor;
};

export const updateHonor = async (id: string, honor: Partial<ProfileHonor>): Promise<ProfileHonor> => {
  const { data, error } = await supabase
    .from('profile_honors')
    .update(honor)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating honor:', error);
    throw error;
  }
  return data as ProfileHonor;
};

export const deleteHonor = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('profile_honors')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting honor:', error);
    throw error;
  }
};