import type { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';

export interface Event {
  id: string;
  title: string;
  organizer: string;
  description: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  tags: string[];
  deadline: string;
  registrationLink: string;
  imageUrl?: string;
}

export enum EventMode {
  ONLINE = 'online',
  OFFLINE = 'offline',
  HYBRID = 'hybrid'
}

export enum EventStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  PAST = 'past',
  CANCELLED = 'cancelled'
}

export interface EventBenefit {
  icon?: string;
  type?: string;
  description: string;
}

export interface TechEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  start_date: string;
  end_date?: string;
  registration_start_date: string;
  registration_end_date: string;
  mode: EventMode;
  status: EventStatus;
  location?: string;
  max_participants?: number;
  current_participants?: number;
  registration_link?: string;
  registration_platform?: string;
  organizer_website?: string;
  image_url?: string;
  tags?: string[];
  is_featured: boolean;
  has_ppi?: boolean;
  organizer_name?: string;
  organizer_email?: string;
  organizer_phone?: string;
  event_fee?: number;
  certificate_available: boolean;
  prerequisites?: any[]; // JSONB array
  registration_process?: any[]; // JSONB array
  selection_process?: any[]; // JSONB array
  benefits?: EventBenefit[]; // JSONB array of EventBenefit objects
  prizes?: any[]; // JSONB array
  agenda?: string;
  created_at?: string;
  updated_at?: string;
}

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

export interface EventStage {
  id: string;
  event_id: string;
  title: string;
  description?: any[]; // JSONB array
  stage_order: number;
  start_date: string;
  end_date: string;
  stage_type?: 'demo' | 'elimination' | 'project' | 'prototype' | 'finale' | 'workshop' | 'presentation';
  is_eliminatory?: boolean;
  requirements?: string;
  submission_guidelines?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EventFAQ {
  id: string;
  event_id: string;
  question: string;
  answer: string;
  category?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: { [key: number]: number };
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export type User = SupabaseUser;
export type Session = SupabaseSession;

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string, captchaToken?: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, captchaToken?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPasswordForEmail: (email: string, captchaToken?: string) => Promise<void>;
  signInWithGoogle: (captchaToken?: string) => Promise<void>; 
  sendMagicLink: (email: string, captchaToken?: string) => Promise<void>;
  clearError: () => void;
}

export enum UserRole {
  SCHOOL_STUDENT = "A school student",
  COLLEGE_STUDENT = "A college Student",
  FRESHER_JOB_SEEKER = "A Fresher or Job Seeker",
  WORKING_PROFESSIONAL = "A working professional",
  OTHERS = "Others"
}

export enum Pronoun {
  HE_HIM = "He/Him/His",
  SHE_HER = "She/Her",
  THEY_THEM = "They/Them",
  OTHERS = "Others"
}

export enum MobileExtension {
  INDIA = "+91",
  NEPAL = "+977",
  SRI_LANKA = "+94",
  OTHERS = "Others"
}

export enum PrimaryCareerGoal {
  FULL_STACK_DEVELOPER = "Become a Full Stack Developer",
  PRODUCT_BASED_COMPANIES = "Crack Product-Based Companies",
  WIN_HACKATHONS = "Win Hackathons & Competitions",
  BUILD_STARTUP = "Build my own Startup",
  PURSUE_RESEARCH = "Pursue Research / Higher Studies",
  SPECIALIZE_NICHE_TECH = "Specialize in a Niche Technology",
  OTHER = "Other"
}

export const PurposeOfJoiningOptions = [
  "To find a job/internship",
  "To compete & upskill",
  "To host an event",
  "To be a mentor",
  "Networking",
  "Learning & Exploration"
] as const;
export type PurposeOfJoining = typeof PurposeOfJoiningOptions[number];

export interface UserSkill {
  skill_name: string;
  rating: number;
}

export interface UserProfile {
  user_id: string;
  username: string | null;
  banner_image_url?: string | null;
  i_am_a: { value: UserRole | string } | null;
  pronoun: Pronoun | string | null;
  mobile_extension: MobileExtension | string | null;
  mobile_no: string | null;
  whatsapp_no: string | null;
  about_me: string | null;
  college_name: string | null;
  course_name: string | null;
  specialization: string | null;
  course_duration_text: string | null;
  start_year: number | null;
  end_year_expected: number | null;
  purpose_joining: PurposeOfJoining[] | null;
  primary_career_goal: PrimaryCareerGoal | string | null;
  location_city_town: string | null;
  location_state: string | null;
  location_country: string | null;
  skills: UserSkill[] | null;
  created_at?: string;
  updated_at?: string;
  username_changes_count?: number;
  username_change_history?: any[];
}

// Profile section interfaces
interface ProfileEducation {
  id: string;
  user_id: string;
  institution_name: string;
  degree: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  grade?: string;
  activities?: string;
  description?: string;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

interface ProfileExperience {
  id: string;
  user_id: string;
  company_name: string;
  position_title: string;
  employment_type?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  skills_used?: string[];
  created_at: string;
  updated_at: string;
}

interface ProfileProject {
  id: string;
  user_id: string;
  project_name: string;
  description: string;
  start_date?: string;
  end_date?: string;
  is_ongoing: boolean;
  project_url?: string;
  github_url?: string;
  technologies_used?: string[];
  created_at: string;
  updated_at: string;
}

interface ProfileCertification {
  id: string;
  user_id: string;
  certification_name: string;
  issuing_organization: string;
  issue_date?: string;
  expiration_date?: string;
  credential_id?: string;
  credential_url?: string;
  created_at: string;
  updated_at: string;
}

interface ProfileCourse {
  id: string;
  user_id: string;
  course_name: string;
  provider: string;
  completion_date?: string;
  certificate_url?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface ProfileVolunteer {
  id: string;
  user_id: string;
  organization_name: string;
  role: string;
  cause?: string;
  start_date?: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface ProfileLanguage {
  id: string;
  user_id: string;
  language_name: string;
  proficiency: 'Elementary' | 'Limited Working' | 'Professional Working' | 'Full Professional' | 'Native';
  created_at: string;
  updated_at: string;
}

interface ProfileHonor {
  id: string;
  user_id: string;
  title: string;
  issuer: string;
  issue_date?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export enum ArticleStatus {
  PUBLISHED = 'published',
  }

export enum ArticleCategory {
  TECHNOLOGY = 'Technology',
  PROGRAMMING = 'Programming',
  AI_ML = 'AI/ML',
  WEB_DEVELOPMENT = 'Web Development',
  MOBILE_DEVELOPMENT = 'Mobile Development',
  DATA_SCIENCE = 'Data Science',
  CYBERSECURITY = 'Cybersecurity',
  BLOCKCHAIN = 'Blockchain',
  CAREER = 'Career',
  TUTORIALS = 'Tutorials',
  NEWS = 'News',
  OPINION = 'Opinion'
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  category: ArticleCategory;
  tags: string[];
  status: ArticleStatus;
  is_featured: boolean;
  read_time: number;
  views_count: number;
  likes_count: number;
  comments_count: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleComment {
  id: string;
  article_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export interface ArticleLike {
  id: string;
  article_id: string;
  user_id: string;
  created_at: string;
}

// Course and Creator Interfaces
export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  color: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreatorProfile {
  id: string;
  user_id: string;
  application_id: string;
  creator_name: string;
  bio?: string;
  avatar_url?: string;
  youtube_channel_url: string;
  channel_name: string;
  subscriber_count: number;
  total_courses: number;
  total_students: number;
  average_rating: number;
  total_reviews: number;
  is_verified: boolean;
  is_active: boolean;
  verification_badge_type?: 'bronze' | 'silver' | 'gold' | 'platinum';
  website_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  github_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatorApplication {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  youtube_channel_url: string;
  channel_name: string;
  subscriber_count: number;
  experience_years: number;
  expertise_areas: string[];
  teaching_experience: string;
  sample_content_urls: string[];
  motivation: string;
  previous_teaching_platforms: string[];
  preferred_topics: string[];
  availability_hours_per_week: number;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'needs_revision';
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  creator_id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  youtube_playlist_url: string;
  playlist_id: string;
  total_videos: number;
  total_duration_minutes: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  tags: string[];
  prerequisites?: string[];
  learning_outcomes?: string[];
  thumbnail_url?: string;
  banner_url?: string;
  enrolled_count: number;
  completed_count: number;
  average_rating: number;
  total_reviews: number;
  view_count: number;
  status: 'draft' | 'under_review' | 'published' | 'archived';
  is_featured: boolean;
  is_free: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  creator?: CreatorProfile;
  category?: CourseCategory;
}

export interface CourseEnrollment {
  id: string;
  course_id: string;
  user_id: string;
  enrolled_at: string;
  started_at?: string;
  completed_at?: string;
  last_accessed_at?: string;
  progress_percentage: number;
  videos_watched: number;
  total_watch_time_minutes: number;
  status: 'enrolled' | 'in_progress' | 'completed' | 'dropped';
}

export interface CourseProgress {
  id: string;
  enrollment_id: string;
  video_id: string;
  video_title?: string;
  video_order?: number;
  watch_time_seconds: number;
  total_duration_seconds?: number;
  is_completed: boolean;
  completion_percentage: number;
  first_watched_at: string;
  last_watched_at: string;
  completed_at?: string;
}

export interface CourseReview {
  id: string;
  course_id: string;
  user_id: string;
  enrollment_id: string;
  rating: number;
  review_text?: string;
  is_verified: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  review: string;
  avatarUrl?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface HomepageMentor {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarUrl?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface PersonalInfo {
  name: string;
  professionalTitle: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  portfolio: string;
  summary: string;
}
export interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}
export interface Education {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  description: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  outcomes: string;
  url?: string;
}

export interface Certification {
  name: string;
  organization: string;
  dateObtained: string;
  expirationDate?: string;
}

export interface Language {
  name: string;
  proficiency: string;
}

export interface VolunteerWork {
  organization: string;
  role: string;
  dates: string;
  description: string;
}

export interface Award {
  name: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface Publication {
  title: string;
  publisher: string;
  date: string;
  url?: string;
}

export interface Reference {
  name: string;
  relationship: string;
  contact: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: { skill: string }[];
  projects?: Project[];
  certifications?: Certification[];
  languages?: Language[];
  volunteerWork?: VolunteerWork[];
  awards?: Award[];
  publications?: Publication[];
  references?: Reference[];
  customSections?: CustomSection[];
  sectionsOrder?: string[];
  visibleSections?: { [key: string]: boolean };
  profileImage?: string;
}

export interface Resume {
  id: string;
  user_id: string;
  name: string;
  data: ResumeData;
  template: string;
  created_at: string;
  updated_at: string;
}