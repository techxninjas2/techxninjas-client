import { supabase } from '../lib/supabaseClient';
import { Resume } from '../types';

export const getUserResumes = async (userId: string): Promise<Resume[]> => {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Resume[];
};

export const getResumeById = async (resumeId: string): Promise<Resume> => {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', resumeId)
    .single();

  if (error) throw error;
  return data as Resume;
};

export const saveResume = async (resume: Partial<Resume>): Promise<Resume> => {
  const { data, error } = await supabase
    .from('resumes')
    .upsert(resume)
    .select()
    .single();

  if (error) throw error;
  return data as Resume;
};

export const deleteResume = async (resumeId: string): Promise<void> => {
  const { error } = await supabase
    .from('resumes')
    .delete()
    .eq('id', resumeId);

  if (error) throw error;
}; 