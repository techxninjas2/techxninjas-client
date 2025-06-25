import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import FormattedText from '../layout/FormattedText';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  ExternalLink, 
  Star, 
  Wifi, 
  WifiOff, 
  Globe, 
  ArrowLeft,
  Award,
  DollarSign,
  FileText,
  User,
  Mail,
  Phone,
  Share2,
  Copy,
  Twitter,
  MessageSquare,
  Linkedin,
  CheckCircle,
  AlertCircle,
  Trophy,
  Target,
  Briefcase,
  Code,
  BookOpen,
  MessageCircle,
  HelpCircle,
  Eye,
  UserPlus,
  Building,
  Gift,
  Zap,
  TrendingUp,
  Shield,
  Info,
  ChevronDown,
  ChevronUp,
  Hash
} from 'lucide-react';
import { getEventBySlug, getSimilarEvents, getEventStages, getEventFAQs } from '../../services/eventService';
import { TechEvent, EventMode, EventStatus, EventStage, EventFAQ, EventBenefit } from '../../types';
import usePageTitle from '../usePageTitle';
import ReviewSection from '../ReviewSection';

const EventDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState<TechEvent | null>(null);
  const [eventStages, setEventStages] = useState<EventStage[]>([]);
  const [eventFAQs, setEventFAQs] = useState<EventFAQ[]>([]);
  const [similarEvents, setSimilarEvents] = useState<TechEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  // Refs for sections
  const overviewRef = useRef<HTMLDivElement>(null);
  const whyParticipateRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const howToApplyRef = useRef<HTMLDivElement>(null);
  const prizesRef = useRef<HTMLDivElement>(null);
  const faqsRef = useRef<HTMLDivElement>(null);

  usePageTitle(event?.title || "Event Details");

  useEffect(() => {
    if (slug) {
      loadEventDetails();
    }
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      // Update active section based on scroll position
      const scrollPosition = window.scrollY + 100; // Offset for header height

      const sections = [
        { id: 'overview', ref: overviewRef },
        { id: 'why-participate', ref: whyParticipateRef },
        { id: 'schedule', ref: scheduleRef },
        { id: 'how-to-apply', ref: howToApplyRef },
        { id: 'prizes', ref: prizesRef },
        { id: 'faqs', ref: faqsRef }
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.ref.current && section.ref.current.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }

      // Show floating header when scrolling down past the navigation header
      const navHeader = document.getElementById('event-nav-header');
      if (navHeader) {
        const navHeaderPosition = navHeader.getBoundingClientRect().top;
        setIsHeaderVisible(navHeaderPosition < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadEventDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!slug) {
        setError('Event not found');
        return;
      }

      const eventData = await getEventBySlug(slug);
      if (!eventData) {
        setError('Event not found');
        return;
      }

      setEvent(eventData);

      // Fetch event stages
      if (eventData.id) {
        try {
          console.log('Fetching stages for event:', eventData.id);
          const stages = await getEventStages(eventData.id);
          console.log('Fetched stages:', stages);
          setEventStages(stages);
        } catch (stageError: any) {
          console.error('Failed to load event stages:', stageError);
          // Don't set error state here to allow the page to load even if stages fail
        }

        // Fetch event FAQs
        try {
          console.log('Fetching FAQs for event:', eventData.id);
          const faqs = await getEventFAQs(eventData.id);
          console.log('Fetched FAQs:', faqs);
          setEventFAQs(faqs);
        } catch (faqError: any) {
          console.error('Failed to load event FAQs:', faqError);
          // Don't set error state here to allow the page to load even if FAQs fail
        }
      }

      if (eventData.tags && eventData.tags.length > 0) {
        const similar = await getSimilarEvents(eventData.id, eventData.tags);
        setSimilarEvents(similar);
      }
    } catch (err: any) {
      console.error('Failed to load event details:', err);
      setError(err.message || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getModeIcon = (mode: EventMode) => {
    switch (mode) {
      case EventMode.ONLINE:
        return <Wifi className="w-3 h-3 sm:w-4 sm:h-4" />;
      case EventMode.OFFLINE:
        return <WifiOff className="w-3 h-3 sm:w-4 sm:h-4" />;
      case EventMode.HYBRID:
        return <Globe className="w-3 h-3 sm:w-4 sm:h-4" />;
      default:
        return <Globe className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  const getModeColor = (mode: EventMode) => {
    switch (mode) {
      case EventMode.ONLINE:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case EventMode.OFFLINE:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case EventMode.HYBRID:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const shareEvent = async () => {
    if (navigator.share && event) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Event link copied to clipboard!');
  };

  const isRegistrationClosed = event && (
    event.status === EventStatus.PAST || 
    event.status === EventStatus.CANCELLED || 
    new Date() > new Date(event.registration_end_date)
  );

  const getRegistrationStatus = () => {
    if (!event) return 'Unknown';
    if (isRegistrationClosed) return 'Registration Closed';
    return 'Registration Open';
  };

  const daysLeft = event ? Math.ceil((new Date(event.registration_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Define sections for the header
  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'why-participate', label: 'Why Participate?' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'how-to-apply', label: 'How to Apply' },
    { id: 'prizes', label: 'Prizes' },
    { id: 'faqs', label: 'FAQs' }
  ];

  // Function to get the appropriate icon component based on the benefit icon string
  const getBenefitIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'trophy':
        return Trophy;
      case 'users':
        return Users;
      case 'briefcase':
        return Briefcase;
      case 'code':
        return Code;
      case 'award':
        return Award;
      case 'target':
        return Target;
      case 'gift':
        return Gift;
      default:
        return Trophy; // Default icon
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-brand-dark-gray">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-brand-dark-gray">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Event Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'The event you are looking for does not exist.'}</p>
            <Link
              to="/events"
              className="bg-brand-primary hover:bg-brand-ninja-gold text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
            >
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark-gray">
      {/* Floating Header - This will be hidden initially and shown on scroll */}
      {isHeaderVisible && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-80 backdrop-blur-md shadow-md py-2 sm:py-3">
          <div className="container mx-auto px-4">
            <nav className="flex space-x-3 sm:space-x-6 overflow-x-auto hide-scrollbar">
              {sections.map((section) => (
                <button 
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`section-nav-item whitespace-nowrap px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium ${
                    activeSection === section.id 
                      ? 'text-brand-primary active' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Back button */}
        <Link
          to="/events"
          className="inline-flex items-center text-brand-primary hover:text-brand-ninja-gold mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          Back to Events
        </Link>

        {/* Event Banner */}
        <div className="relative h-40 sm:h-48 md:h-64 lg:h-80 rounded-lg sm:rounded-xl overflow-hidden mb-4 sm:mb-6">
          <img 
            src={event.image_url || `https://picsum.photos/seed/${event.id}/1200/400`} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            {/* Main Content Box */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-4 sm:mb-6">
              {/* Event Title and Organizer */}
              <div className="mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {event.title}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Organized by: {' '}
                  {event.organizer_website ? (
                    <a 
                      href={event.organizer_website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-brand-primary hover:text-brand-ninja-gold dark:text-brand-ninja-gold dark:hover:text-brand-primary"
                    >
                      {event.organizer_name}
                    </a>
                  ) : (
                    <span className="font-medium">{event.organizer_name}</span>
                  )}
                </p>
              </div>

              {/* Event Tags/Features */}
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
                <span className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${getModeColor(event.mode)}`}>
                  {getModeIcon(event.mode)}
                  <span className="ml-1 capitalize">{event.mode}</span>
                </span>
                
                {event.is_featured && (
                  <span className="inline-flex items-center bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Featured
                  </span>
                )}
                
                {event.certificate_available && (
                  <span className="inline-flex items-center bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                    <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Certificate
                  </span>
                )}
                
                {event.status === EventStatus.ONGOING && (
                  <span className="inline-flex items-center bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Ongoing
                  </span>
                )}
                
                {event.has_ppi && (
                  <span className="inline-flex items-center bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                    <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Pre-Placement Interviews
                  </span>
                )}
              </div>
            </div>

            {/* Event Navigation Header - Added after title box */}
            <div id="event-nav-header" className="bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-80 backdrop-blur-md rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 mb-4 sm:mb-6 overflow-x-auto hide-scrollbar">
              <nav className="flex space-x-3 sm:space-x-6">
                {sections.map((section) => (
                  <button 
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`section-nav-item whitespace-nowrap px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium ${
                      activeSection === section.id 
                        ? 'text-brand-primary active' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Overview Section */}
            <section id="overview" ref={overviewRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Overview</h2>
              <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none mb-4 sm:mb-6">
                <FormattedText content={event.description} className="text-gray-700 dark:text-gray-300 text-sm sm:text-base" />
              </div>

              {/* Eligibility Criteria */}
              {event.prerequisites && event.prerequisites.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">Eligibility Criteria</h3>
                  <ul className="space-y-1 sm:space-y-2">
                    {event.prerequisites.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-1 sm:mr-2 flex-shrink-0 mt-0.5" />
                        <FormattedText content={item} className="text-gray-700 dark:text-gray-300 text-sm sm:text-base" />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Selection Process */}
              {event.selection_process && event.selection_process.length > 0 && (
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">Selection Process</h3>
                  <ul className="space-y-1 sm:space-y-2">
                    {event.selection_process.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <Target className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary mr-1 sm:mr-2 flex-shrink-0 mt-0.5" />
                        <FormattedText content={item} className="text-gray-700 dark:text-gray-300 text-sm sm:text-base" />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Why Participate Section */}
            <section id="why-participate" ref={whyParticipateRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Why Participate?</h2>
              
              {event.benefits && event.benefits.length > 0 ? (
                <ul className="space-y-3 sm:space-y-4">
                  {event.benefits.map((benefit, index) => {
                    // Check if benefit is a string or an object
                    if (typeof benefit === 'string') {
                      // If it's a string, use default icon
                      return (
                        <li key={index} className="flex items-start">
                          <div className="bg-brand-primary bg-opacity-10 rounded-full p-1.5 sm:p-2 mr-2 sm:mr-3 flex-shrink-0">
                            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                          </div>
                          <div>
                            <FormattedText content={benefit} className="text-gray-700 dark:text-gray-300 text-sm sm:text-base" /> 
                          </div>
                        </li>
                      );
                    } else {
                      // If it's an object, use the specified icon or description
                      const IconComponent = getBenefitIcon(benefit.icon);
                      return (
                        <li key={index} className="flex items-start">
                          <div className="bg-brand-primary bg-opacity-10 rounded-full p-1.5 sm:p-2 mr-2 sm:mr-3 flex-shrink-0">
                            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                          </div>
                          <div>
                            <FormattedText content={benefit.description} className="text-gray-700 dark:text-gray-300 text-sm sm:text-base"/>
                          </div>
                        </li>
                      );
                    }
                  })}
                </ul>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start">
                    <div className="bg-brand-primary bg-opacity-10 rounded-full p-1.5 sm:p-2 mr-2 sm:mr-3 flex-shrink-0">
                      <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Showcase your skills and creativity to industry experts and potential employers.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-brand-primary bg-opacity-10 rounded-full p-1.5 sm:p-2 mr-2 sm:mr-3 flex-shrink-0">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Network with like-minded individuals and build connections in the tech community.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-brand-primary bg-opacity-10 rounded-full p-1.5 sm:p-2 mr-2 sm:mr-3 flex-shrink-0">
                      <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Opportunity to win exciting prizes and potential job/internship offers.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-brand-primary bg-opacity-10 rounded-full p-1.5 sm:p-2 mr-2 sm:mr-3 flex-shrink-0">
                      <Code className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Learn new technologies and enhance your problem-solving skills.</p>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Schedule & Timeline Section */}
            <section id="schedule" ref={scheduleRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-6">Schedule & Timeline</h2>
              
              {eventStages.length > 0 ? (
                <div className="space-y-6 sm:space-y-8">
                  {eventStages.map((stage, index) => (
                    <div key={stage.id} className="relative">
                      {index !== eventStages.length - 1 && (
                        <div className="timeline-connector"></div>
                      )}
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="flex flex-col items-center z-10">
                          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-brand-primary rounded-lg flex flex-col items-center justify-center text-white font-bold">
                            <span className="text-base sm:text-lg">{new Date(stage.start_date).getDate()}</span>
                            <span className="text-xs">{new Date(stage.start_date).toLocaleString('default', { month: 'short' })}</span>
                          </div>
                        </div>
                        <div className="flex-1 pb-6 sm:pb-8">
                          <div className="flex items-center justify-between mb-1 sm:mb-2">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                              {stage.title}
                            </h3>
                            {stage.is_eliminatory !== undefined && (
                              <span className={`text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full ${stage.is_eliminatory ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>
                                {stage.is_eliminatory ? 'Eliminatory' : 'Non-eliminatory'}
                              </span>
                            )}
                          </div>
                          
                          {stage.description && stage.description.length > 0 && (
                            <div className="text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 leading-relaxed text-sm sm:text-base">
                              <ul className="space-y-1">
                                {stage.description.map((item, idx) => (
                                  <li key={idx}>
                                    <FormattedText content={item} />
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            <p><strong>Start:</strong> {formatDate(stage.start_date)}, {formatTime(stage.start_date)} IST</p>
                            <p><strong>End:</strong> {formatDate(stage.end_date)}, {formatTime(stage.end_date)} IST</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">
                    No stages available
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500 text-sm">
                    Event timeline information will be added soon
                  </p>
                </div>
              )}
            </section>

            {/* How to Apply Section */}
            <section id="how-to-apply" ref={howToApplyRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">How to Apply</h2>
              
              {event.registration_process && event.registration_process.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {event.registration_process.map((step, index) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-brand-primary text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold mr-2 sm:mr-3 flex-shrink-0 text-xs sm:text-sm">
                        {index + 1}
                      </div>
                      <FormattedText content={step} className="text-gray-700 dark:text-gray-300 text-sm sm:text-base" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start">
                    <div className="bg-brand-primary text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold mr-2 sm:mr-3 flex-shrink-0 text-xs sm:text-sm">
                      1
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                      Visit the official registration page by clicking the "Register Now" button.
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-brand-primary text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold mr-2 sm:mr-3 flex-shrink-0 text-xs sm:text-sm">
                      2
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                      Create an account or log in to your existing account on the {event.registration_platform || 'registration platform'}.
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-brand-primary text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold mr-2 sm:mr-3 flex-shrink-0 text-xs sm:text-sm">
                      3
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                      Fill out the registration form with your personal and team details.
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-brand-primary text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold mr-2 sm:mr-3 flex-shrink-0 text-xs sm:text-sm">
                      4
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                      Submit your application before the registration deadline: <strong>{formatDate(event.registration_end_date)}</strong>.
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 sm:mt-6">
                {isRegistrationClosed ? (
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 sm:p-4 rounded-lg text-center">
                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mx-auto mb-1 sm:mb-2" />
                    <p className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">Registration is now closed</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <a
                      href={event.registration_link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-brand-primary hover:bg-brand-ninja-gold text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition duration-300 register-button-pulse text-sm sm:text-base"
                    >
                      Register Now
                      <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" />
                    </a>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Registration closes on {formatDate(event.registration_end_date)}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Prizes & Rewards Section */}
            <section id="prizes" ref={prizesRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-6">Prizes & Rewards</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {event.prizes && event.prizes.length > 0 ? (
                  event.prizes.map((prize, index) => {
                    // Determine icon based on type or position
                    let IconComponent = Trophy;
                    let iconColor = 'text-brand-primary';
                    
                    if (prize.type === 'Trophy' || prize.type === 'Award') {
                      IconComponent = Trophy;
                      if (prize.position === 'Winner') {
                        iconColor = 'text-yellow-500';
                      } else if (prize.position === 'First Runners-Up') {
                        iconColor = 'text-gray-400';
                      } else if (prize.position === 'Second Runners-Up') {
                        iconColor = 'text-amber-600';
                      }
                    } else if (prize.type === 'Briefcase') {
                      IconComponent = Briefcase;
                      iconColor = 'text-blue-500';
                    } else if (prize.type === 'Gift') {
                      IconComponent = Gift;
                      iconColor = 'text-purple-500';
                    }
                    
                    return (
                      <div key={index} className="prize-card bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
                        <div className="flex items-start">
                          <div className={`p-2 sm:p-3 rounded-lg bg-white dark:bg-gray-600 ${iconColor}`}>
                            <IconComponent className="w-4 h-4 sm:w-6 sm:h-6" />
                          </div>
                          <div className="ml-3 sm:ml-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{prize.position}</h3>
                            <FormattedText content={prize.description} className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm"/>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div className="prize-card bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
                      <div className="flex items-start">
                        <div className="p-2 sm:p-3 rounded-lg bg-white dark:bg-gray-600 text-yellow-500">
                          <Trophy className="w-4 h-4 sm:w-6 sm:h-6" />
                        </div>
                        <div className="ml-3 sm:ml-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">First Prize</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">₹50,000 cash prize and internship opportunities</p>
                        </div>
                      </div>
                    </div>
                    <div className="prize-card bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
                      <div className="flex items-start">
                        <div className="p-2 sm:p-3 rounded-lg bg-white dark:bg-gray-600 text-gray-400">
                          <Trophy className="w-4 h-4 sm:w-6 sm:h-6" />
                        </div>
                        <div className="ml-3 sm:ml-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Second Prize</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">₹30,000 cash prize and exclusive merchandise</p>
                        </div>
                      </div>
                    </div>
                    <div className="prize-card bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
                      <div className="flex items-start">
                        <div className="p-2 sm:p-3 rounded-lg bg-white dark:bg-gray-600 text-amber-600">
                          <Trophy className="w-4 h-4 sm:w-6 sm:h-6" />
                        </div>
                        <div className="ml-3 sm:ml-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Third Prize</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">₹20,000 cash prize and exclusive merchandise</p>
                        </div>
                      </div>
                    </div>
                    <div className="prize-card bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
                      <div className="flex items-start">
                        <div className="p-2 sm:p-3 rounded-lg bg-white dark:bg-gray-600 text-brand-primary">
                          <Gift className="w-4 h-4 sm:w-6 sm:h-6" />
                        </div>
                        <div className="ml-3 sm:ml-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Special Mentions</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Certificates and exclusive merchandise for top 10 teams</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 sm:p-4">
                <div className="flex items-start">
                  <Info className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400 mr-1.5 sm:mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1 text-sm sm:text-base">Important Note</h4>
                    <p className="text-yellow-700 dark:text-yellow-200 text-xs sm:text-sm">
                      All participants will receive a certificate of participation. Winners will be announced within 2 weeks after the event conclusion.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQs Section */}
            <section id="faqs" ref={faqsRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-3 sm:space-y-4">
                {eventFAQs.length > 0 ? (
                  eventFAQs.map((faq, index) => (
                    <div key={faq.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                        className="w-full text-left p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex justify-between items-center"
                      >
                        <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{faq.question}</span>
                        {expandedFAQ === index ? (
                          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
                        )}
                      </button>
                      <div className={`faq-answer px-3 sm:px-4 bg-white dark:bg-gray-800 ${expandedFAQ === index ? 'expanded py-3 sm:py-4' : ''}`}>
                        <FormattedText content={faq.answer} className="text-gray-700 dark:text-gray-300 text-sm sm:text-base" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <HelpCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">
                      No FAQs available
                    </h3>
                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                      Frequently asked questions will be added soon
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">Still have questions?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
                  Contact the event organizers directly for any additional information.
                </p>
                {event.organizer_email && (
                  <a 
                    href={`mailto:${event.organizer_email}`}
                    className="inline-flex items-center text-brand-primary hover:text-brand-ninja-gold dark:text-brand-ninja-gold dark:hover:text-brand-primary text-sm sm:text-base"
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                    {event.organizer_email}
                  </a>
                )}
              </div>
            </section>

            {/* Reviews Section */}
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-4 sm:mb-6">
              <ReviewSection eventId={event.id} />
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20 sm:top-24 space-y-4 sm:space-y-6">
              {/* Event Details Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <div className="text-center mb-3 sm:mb-4">
                  <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1">
                    {event.event_fee && event.event_fee > 0 ? `₹${event.event_fee}` : 'Free'}
                  </div>
                  <div className={`text-xs sm:text-sm font-medium ${isRegistrationClosed ? 'text-red-600' : 'text-green-600'}`}>
                    {getRegistrationStatus()}
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Registered</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {event.current_participants?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Team Size</span>
                    <span className="font-medium text-gray-900 dark:text-white">2 - 3 Members</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Registration Platform</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {event.registration_platform || 'Official Website'}
                    </span>
                  </div>
                </div>

                <div className="mb-4 sm:mb-6">
                  {isRegistrationClosed ? (
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg cursor-not-allowed text-sm sm:text-base"
                    >
                      Registration Closed
                    </button>
                  ) : (
                    <a
                      href={event.registration_link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center bg-brand-primary hover:bg-brand-ninja-gold text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition duration-300 text-sm sm:text-base"
                    >
                      Register Now
                      <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:ml-2" />
                    </a>
                  )}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-4">
                  <div className="flex justify-center space-x-2 sm:space-x-3">
                    <button 
                      onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(event.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button 
                      onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(event.title + ' ' + window.location.href)}`, '_blank')}
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-green-500 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button 
                      onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-700 transition-colors"
                    >
                      <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button 
                      onClick={copyLink}
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Important Dates Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 text-sm sm:text-base">Important Dates & Deadlines</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Registration Deadline</span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      {formatDate(event.registration_end_date)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Event Start Date</span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      {formatDate(event.start_date)}
                    </span>
                  </div>
                  {event.end_date && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Event End Date</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        {formatDate(event.end_date)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Organizers Card */}
              {(event.organizer_email || event.organizer_phone) && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 text-sm sm:text-base">Contact the Organisers</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {event.organizer_email && (
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Helpdesk</div>
                          <a href={`mailto:${event.organizer_email}`} className="text-xs sm:text-sm text-brand-primary hover:underline">
                            {event.organizer_email}
                          </a>
                        </div>
                      </div>
                    )}
                    {event.organizer_phone && (
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Phone Support</div>
                          <a href={`tel:${event.organizer_phone}`} className="text-xs sm:text-sm text-brand-primary hover:underline">
                            {event.organizer_phone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;