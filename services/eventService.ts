import { supabase } from '../lib/supabaseClient';
import { TechEvent, EventStatus, EventMode, EventStage, EventFAQ } from '../types';

export const getEvents = async (): Promise<TechEvent[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }

  return data as TechEvent[];
};

const getEventById = async (id: string): Promise<TechEvent | null> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116: 'exact one row not found'
    console.error('Error fetching event:', error);
    throw error;
  }

  return data as TechEvent | null;
};

export const getEventBySlug = async (slug: string): Promise<TechEvent | null> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116: 'exact one row not found'
    console.error('Error fetching event by slug:', error);
    throw error;
  }

  return data as TechEvent | null;
};

export const getEventStages = async (eventId: string): Promise<EventStage[]> => {
  console.log('Fetching stages for event ID:', eventId);
  
  const { data, error } = await supabase
    .from('event_stages')
    .select('*')
    .eq('event_id', eventId)
    .order('stage_order', { ascending: true });

  if (error) {
    console.error('Error fetching event stages:', error);
    throw error;
  }

  console.log('Fetched stages:', data);
  return data as EventStage[];
};

export const getEventFAQs = async (eventId: string): Promise<EventFAQ[]> => {
  console.log('Fetching FAQs for event ID:', eventId);
  
  const { data, error } = await supabase
    .from('event_faqs')
    .select('*')
    .eq('event_id', eventId)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching event FAQs:', error);
    throw error;
  }

  console.log('Fetched FAQs:', data);
  return data as EventFAQ[];
};

const getFeaturedEvents = async (): Promise<TechEvent[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_featured', true)
    .eq('status', EventStatus.UPCOMING)
    .order('start_date', { ascending: true })
    .limit(6);

  if (error) {
    console.error('Error fetching featured events:', error);
    throw error;
  }

  return data as TechEvent[];
};

const getUpcomingEvents = async (): Promise<TechEvent[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', EventStatus.UPCOMING)
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Error fetching upcoming events:', error);
    throw error;
  }

  return data as TechEvent[];
};

const searchEvents = async (query: string): Promise<TechEvent[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Error searching events:', error);
    throw error;
  }

  return data as TechEvent[];
};

const getEventsByMode = async (mode: EventMode): Promise<TechEvent[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('mode', mode)
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Error fetching events by mode:', error);
    throw error;
  }

  return data as TechEvent[];
};

const getEventsByStatus = async (status: EventStatus): Promise<TechEvent[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', status)
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Error fetching events by status:', error);
    throw error;
  }

  return data as TechEvent[];
};

export const getSimilarEvents = async (eventId: string, tags: string[], limit: number = 4): Promise<TechEvent[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .neq('id', eventId)
    .overlaps('tags', tags)
    .eq('status', EventStatus.UPCOMING)
    .order('start_date', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching similar events:', error);
    throw error;
  }

  return data as TechEvent[];
};