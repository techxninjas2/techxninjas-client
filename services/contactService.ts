import { supabase } from '../lib/supabaseClient';

interface ContactFormData {
  full_name: string;
  email: string;
  mobile_number: string;
  query_type: string;
  subject: string;
  message: string;
}

interface ContactSubmission {
  id: string;
  full_name: string;
  email: string;
  mobile_number: string;
  query_type: string;
  subject: string;
  message: string;
  user_id?: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  admin_reply?: string;
  admin_reply_given_at?: string;
  admin_user_id?: string;
  internal_notes?: string;
  tags?: string[];
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export const submitContactForm = async (formData: ContactFormData): Promise<ContactSubmission> => {
  try {
    // Get current user if logged in (but don't require it)
    let currentUser = null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      currentUser = user;
    } catch (authError) {
      // Ignore auth errors for anonymous submissions
      console.log('No authenticated user, proceeding with anonymous submission');
    }

    // Validate form data
    if (!formData.full_name?.trim()) {
      throw new Error('Full name is required');
    }
    if (!formData.email?.trim()) {
      throw new Error('Email address is required');
    }
    if (!formData.mobile_number?.trim()) {
      throw new Error('Mobile number is required');
    }
    if (!formData.query_type) {
      throw new Error('Query type is required');
    }
    if (!formData.subject?.trim()) {
      throw new Error('Subject is required');
    }
    if (!formData.message?.trim() || formData.message.trim().length < 20) {
      throw new Error('Message must be at least 20 characters long');
    }
    if (formData.message.trim().length > 1000) {
      throw new Error('Message cannot exceed 1000 characters');
    }

    // Email validation
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(formData.email.trim())) {
      throw new Error('Please enter a valid email address');
    }

    // Determine priority based on query type
    const getPriority = (queryType: string): 'low' | 'medium' | 'high' | 'urgent' => {
      switch (queryType) {
        case 'Bug or Technical Issue':
          return 'high';
        case 'Account/Login Issue':
          return 'high';
        case 'Feature Request':
          return 'medium';
        case 'Feedback to Improve':
          return 'medium';
        case 'General Query':
        default:
          return 'low';
      }
    };

    const submissionData = {
      full_name: formData.full_name.trim(),
      email: formData.email.trim().toLowerCase(),
      mobile_number: formData.mobile_number.trim(),
      query_type: formData.query_type,
      subject: formData.subject.trim(),
      message: formData.message.trim(),
      user_id: currentUser?.id || null,
      status: 'new' as const,
      priority: getPriority(formData.query_type),
      tags: [formData.query_type.toLowerCase().replace(/\s+/g, '_')]
    };

    console.log('Submitting contact form with data:', { 
      ...submissionData, 
      user_id: submissionData.user_id ? 'authenticated' : 'anonymous' 
    });

    const { data, error } = await supabase
      .from('contact_submissions')
      .insert(submissionData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error submitting contact form:', error);
      
      // Handle specific error types
      if (error.code === '23514') {
        // Check constraint violation
        if (error.message.includes('full_name_check')) {
          throw new Error('Full name must be at least 2 characters long');
        }
        if (error.message.includes('email_check')) {
          throw new Error('Please enter a valid email address');
        }
        if (error.message.includes('mobile_number_check')) {
          throw new Error('Mobile number must be at least 10 characters long');
        }
        if (error.message.includes('subject_check')) {
          throw new Error('Subject must be between 5 and 200 characters');
        }
        if (error.message.includes('message_check')) {
          throw new Error('Message must be between 20 and 1000 characters');
        }
      }
      
      if (error.code === '42501') {
        // Permission denied
        throw new Error('Unable to submit your message due to a permission issue. Please try again or contact support directly.');
      }
      
      throw new Error(error.message || 'Failed to submit your message. Please try again.');
    }

    if (!data) {
      throw new Error('No data returned from submission. Please try again.');
    }

    console.log('Contact form submitted successfully:', data.id);
    return data as ContactSubmission;
    
  } catch (error: any) {
    console.error('Error in submitContactForm:', error);
    
    // Re-throw with user-friendly message
    if (error.message) {
      throw error;
    } else {
      throw new Error('An unexpected error occurred. Please try again or contact support directly.');
    }
  }
};

const getContactSubmissions = async (
  status?: string,
  priority?: string,
  limit: number = 50,
  offset: number = 0
): Promise<ContactSubmission[]> => {
  try {
    let query = supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (priority) {
      query = query.eq('priority', priority);
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching contact submissions:', error);
      throw error;
    }

    return data as ContactSubmission[];
  } catch (error: any) {
    console.error('Error in getContactSubmissions:', error);
    throw error;
  }
};

const updateContactSubmission = async (
  id: string,
  updates: Partial<ContactSubmission>
): Promise<ContactSubmission> => {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating contact submission:', error);
      throw error;
    }

    return data as ContactSubmission;
  } catch (error: any) {
    console.error('Error in updateContactSubmission:', error);
    throw error;
  }
};

const addAdminReply = async (
  id: string,
  adminReply: string,
  adminUserId: string
): Promise<ContactSubmission> => {
  try {
    const updates = {
      admin_reply: adminReply,
      admin_reply_given_at: new Date().toISOString(),
      admin_user_id: adminUserId,
      status: 'in_progress' as const,
      updated_at: new Date().toISOString()
    };

    return await updateContactSubmission(id, updates);
  } catch (error: any) {
    console.error('Error in addAdminReply:', error);
    throw error;
  }
};

const resolveContactSubmission = async (
  id: string,
  adminUserId: string
): Promise<ContactSubmission> => {
  try {
    const updates = {
      status: 'resolved' as const,
      resolved_at: new Date().toISOString(),
      admin_user_id: adminUserId,
      updated_at: new Date().toISOString()
    };

    return await updateContactSubmission(id, updates);
  } catch (error: any) {
    console.error('Error in resolveContactSubmission:', error);
    throw error;
  }
};