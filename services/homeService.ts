import { supabase } from '../lib/supabaseClient';
import { Testimonial, HomepageMentor } from '../types';

export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching testimonials:', error);
      throw error;
    }

    return data as Testimonial[];
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    // Return mock data as fallback
    return [
      {
        id: '1',
        name: 'Mohammad A.',
        designation: 'Intern @ Buddi AI',
        review: `I started with zero idea about coding, but today I'm interning at a real tech company — thanks to TechXNinjas' weekly sessions!`,
        avatarUrl: `https://ui-avatars.com/api/?name=Mohammad+A&background=random&color=fff`,
        is_active: true,
        display_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Rahul R.',
        designation: 'MTS Backend @ Aquera',
        review: `They don't just teach, they walk with you through the learning path. I've never been more confident in my skills.`,
        avatarUrl: `https://ui-avatars.com/api/?name=Rahul+R&background=random&color=fff`,
        is_active: true,
        display_order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Santhosh M.',
        designation: 'DevOps @ DP World',
        review: 'The best part? No pressure. Just progress. The community is super supportive!',
        avatarUrl: `https://ui-avatars.com/api/?name=Santhosh+M&background=random&color=fff`,
        is_active: true,
        display_order: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Priya K.',
        designation: 'Frontend Developer @ Razorpay',
        review: 'The structured learning path and community support helped me land my dream job. Highly recommended!',
        avatarUrl: `https://ui-avatars.com/api/?name=Priya+K&background=random&color=fff`,
        is_active: true,
        display_order: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '5',
        name: 'Vikram S.',
        designation: 'Full Stack Developer @ Swiggy',
        review: 'The hackathons and coding challenges pushed me to learn faster than any course could. Real-world experience matters!',
        avatarUrl: `https://ui-avatars.com/api/?name=Vikram+S&background=random&color=fff`,
        is_active: true,
        display_order: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }
};

export const getHomepageMentors = async (): Promise<HomepageMentor[]> => {
  try {
    const { data, error } = await supabase
      .from('homepage_mentors')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching homepage mentors:', error);
      throw error;
    }

    return data as HomepageMentor[];
  } catch (error) {
    console.error('Failed to fetch homepage mentors:', error);
    // Return mock data as fallback
    return [
      { 
        id: '1',
        name: 'Sahil Chopra', 
        role: 'SDE', 
        company: 'SCI BI', 
        avatarUrl: `https://ui-avatars.com/api/?name=Sahil+C&background=random&color=fff`,
        is_active: true,
        display_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { 
        id: '2',
        name: 'Akshay Gagrani', 
        role: 'SDE', 
        company: 'Myntra', 
        avatarUrl: `https://ui-avatars.com/api/?name=Akshay+G&background=random&color=fff`,
        is_active: true,
        display_order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { 
        id: '3',
        name: 'Ayushi S.', 
        role: 'SDE 3', 
        company: 'Microsoft', 
        avatarUrl: `https://ui-avatars.com/api/?name=Ayushi+S&background=random&color=fff`,
        is_active: true,
        display_order: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { 
        id: '4',
        name: 'Mohit Sharma', 
        role: 'SDE 2', 
        company: 'Amazon', 
        avatarUrl: `https://ui-avatars.com/api/?name=Mohit+S&background=random&color=fff`,
        is_active: true,
        display_order: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { 
        id: '5',
        name: 'Shantanu K.', 
        role: 'SDE 2', 
        company: 'Intuit', 
        avatarUrl: `https://ui-avatars.com/api/?name=Shantanu+K&background=random&color=fff`,
        is_active: true,
        display_order: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { 
        id: '6',
        name: 'Neha P.', 
        role: 'ML Engineer', 
        company: 'Google', 
        avatarUrl: `https://ui-avatars.com/api/?name=Neha+P&background=random&color=fff`,
        is_active: true,
        display_order: 6,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { 
        id: '7',
        name: 'Rajat M.', 
        role: 'DevOps Engineer', 
        company: 'Flipkart', 
        avatarUrl: `https://ui-avatars.com/api/?name=Rajat+M&background=random&color=fff`,
        is_active: true,
        display_order: 7,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { 
        id: '8',
        name: 'Ananya D.', 
        role: 'UI/UX Designer', 
        company: 'Zomato', 
        avatarUrl: `https://ui-avatars.com/api/?name=Ananya+D&background=random&color=fff`,
        is_active: true,
        display_order: 8,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }
};