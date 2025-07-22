import { supabase } from '../lib/supabaseClient';

export interface EventReview {
  id: string;
  event_id: string;
  user_id: string;
  rating: number;
  review_text?: string;
  is_verified: boolean;
  is_approved: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  // Profile data from join
  user_profiles?: {
    username: string;
  };
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: { [key: number]: number };
}

export const submitReview = async (eventId: string, rating: number, reviewText?: string): Promise<EventReview> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from('event_reviews')
    .insert({
      event_id: eventId,
      user_id: userData.user.id, // ✅ Required
      rating,
      review_text: reviewText || null
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting review:', error);
    throw error;
  }

  return data as EventReview;
};

export const updateReview = async (reviewId: string, rating: number, reviewText?: string): Promise<EventReview> => {
  const { data, error } = await supabase
    .from('event_reviews')
    .update({
      rating,
      review_text: reviewText || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', reviewId)
    .select()
    .single();

  if (error) {
    console.error('Error updating review:', error);
    throw error;
  }

  return data as EventReview;
};

export const getUserReview = async (eventId: string, userId: string): Promise<EventReview | null> => {
  const { data, error } = await supabase
    .from('event_reviews')
    .select('*')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user review:', error);
    throw error;
  }

  return data as EventReview | null;
};

export const getEventReviews = async (eventId: string, limit: number = 10, offset: number = 0): Promise<EventReview[]> => {
  const { data, error } = await supabase
    .from('event_reviews')
    .select(`
      *,
      user_profiles!event_reviews_user_id_fkey (
        username
      )
    `)
    .eq('event_id', eventId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching event reviews:', error);
    throw error;
  }

  return data as EventReview[];
};

export const getReviewStats = async (eventId: string): Promise<ReviewStats> => {
  const { data, error } = await supabase
    .rpc('get_event_review_stats', { p_event_id: eventId });

  if (error) {
    console.error('Error fetching review stats:', error);
    throw error;
  }

  return data as ReviewStats;
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  const { error } = await supabase
    .from('event_reviews')
    .delete()
    .eq('id', reviewId);

  if (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};
