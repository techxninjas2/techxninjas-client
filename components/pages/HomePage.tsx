import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Award,
  Zap,
  Lightbulb,
  Users,
  MessageSquare,
  ArrowRight,
  CalendarDays,
  UserCheck,
  FileText,
  Globe,
  Gift,
  NotebookText,
  TrendingUp,
  CheckCircle,
  Star,
  Sparkles,
  Code,
  Terminal,
  Rocket,
} from 'lucide-react';
import { WHATSAPP_COMMUNITY_LINK } from '../../constants';
import usePageTitle from '../usePageTitle';
import CodingBackground from '../CodingBackground';
import RevealOnScroll from '../RevealOnScroll';
import AnimatedCounter from '../AnimatedCounter';
import TestimonialsSlider from '../TestimonialsSlider';
import MentorsSlider from '../MentorsSlider';
import { getTestimonials, getHomepageMentors } from '../../services/homeService';
import { Testimonial, HomepageMentor } from '../../types';

// Floating particles animation component
const FloatingParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        >
          <div className="w-1 h-1 bg-white/20 rounded-full animate-ping" />
        </div>
      ))}
    </div>
  );
};

const HeroSection: React.FC = () => {
  const highlights = [
    { text: 'Build Projects', icon: Briefcase, gradient: 'from-orange-400 to-red-500' },
    { text: 'Free Certificates', icon: Award, gradient: 'from-blue-400 to-indigo-500' },
    { text: 'No Signup Barrier', icon: Zap, gradient: 'from-green-400 to-blue-500' },
    { text: 'Personalized Paths', icon: Lightbulb, gradient: 'from-purple-400 to-pink-500' },
    { text: 'Industry-level Mentorship', icon: Users, gradient: 'from-blue-400 to-indigo-500' },
  ];

  return (
    <section id="hero" className="relative text-white py-20 md:py-32 min-h-screen flex items-center">
      <CodingBackground 
        intensity="medium" 
        style="matrix"
        className="absolute inset-0 z-0 opacity-10"
      />
      <FloatingParticles />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <RevealOnScroll direction="down" duration={1000}>
          <div className="mb-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent leading-tight">
              Welcome to
            </h1>
            <div className="relative inline-block">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                TechXNinjas
              </h1>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>
            </div>
          </div>
        </RevealOnScroll>
        
        <RevealOnScroll direction="up" delay={300} duration={1000}>
          <p className="text-xl md:text-2xl text-gray-200 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Your <span className="text-cyan-400 font-semibold">ultimate platform</span> for hackathons, tech challenges, community interaction, and <span className="text-purple-400 font-semibold">professional growth</span> in the world of technology.
          </p>
        </RevealOnScroll>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {highlights.map((highlight, index) => (
            <RevealOnScroll key={index} direction="up" delay={400 + index * 100} duration={800}>
              <div className={`group relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl shadow-xl text-sm md:text-base py-3 md:py-4 px-4 md:px-6 hover:scale-105 transition-all duration-300 cursor-pointer`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${highlight.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                <div className="relative flex items-center">
                  <highlight.icon className="w-5 h-5 mr-3 text-cyan-400 group-hover:text-white transition-colors duration-300" />
                  <span className="font-medium">{highlight.text}</span>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
        
        <RevealOnScroll direction="up" delay={800} duration={1000}>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/events" 
              className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold py-4 px-10 rounded-2xl shadow-2xl transition-all duration-300 text-lg transform hover:scale-110 hover:shadow-orange-500/25"
            >
              <span className="relative z-10 flex items-center">
                <Rocket className="w-5 h-5 mr-2" />
                Start Exploring
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <Link
              to="/courses" 
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-10 rounded-2xl shadow-2xl transition-all duration-300 text-lg transform hover:scale-110 hover:shadow-blue-500/25"
            >
              <span className="relative z-10 flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Browse Programs
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <a
              href={WHATSAPP_COMMUNITY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-10 rounded-2xl shadow-2xl transition-all duration-300 text-lg transform hover:scale-110 hover:shadow-green-500/25"
            >
              <span className="relative z-10 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Join Community
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

const CommunityStatsSection: React.FC = () => {
  const stats = [
    { value: '10+', label: 'National Tech Events', icon: CalendarDays, color: 'from-orange-400 to-red-500', bgColor: 'bg-orange-500/10' },
    { value: '15,000+', label: 'Community Members', icon: Users, color: 'from-blue-400 to-indigo-500', bgColor: 'bg-blue-500/10' },
    { value: '10+', label: 'Dedicated Mentors', icon: UserCheck, color: 'from-green-400 to-emerald-500', bgColor: 'bg-green-500/10' },
    { value: '500+', label: 'Certificates Issued', icon: Award, color: 'from-purple-400 to-pink-500', bgColor: 'bg-purple-500/10' },
  ];
  
  return (
    <section id="stats" className="relative py-20 min-h-screen flex items-center">
      <CodingBackground 
        intensity="low" 
        style="binary"
        className="absolute inset-0 z-0 opacity-5"
      />
      <div className="container mx-auto px-4 text-center relative z-10 w-full">
        <RevealOnScroll direction="up" duration={800}>
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-800 dark:text-white leading-tight">
            The <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">TechXNinjas</span> tribe is growing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 font-light">
            — and you're welcome to join! 🚀
          </p>
        </RevealOnScroll>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 my-16">
          {stats.map((stat, index) => (
            <RevealOnScroll key={index} direction="up" delay={300 + index * 150} duration={800}>
              <div className={`group relative overflow-hidden ${stat.bgColor} backdrop-blur-xl border border-white/20 dark:border-gray-700/30 p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-xl`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className="relative">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} mb-6 shadow-lg`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className={`text-5xl md:text-6xl font-black mb-4 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                    <AnimatedCounter 
                      end={stat.value} 
                      duration={2000} 
                      delay={500 + index * 200} 
                    />
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">{stat.label}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
        
        <RevealOnScroll direction="up" delay={1000} duration={800}>
          <div className="relative inline-block p-8 rounded-3xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-300/20">
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🎁 Surprise Contests Every Month and Win TechXNinjas Hoodies!
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

const OurJourneySection: React.FC = () => {
  const journeyPoints = [
    { emoji: '🤯', title: 'The Maze of Choices', text: 'Lost in the sea of tech options, unsure where to begin.', color: 'from-red-400 to-pink-500' },
    { emoji: '💡', title: 'A Spark of Clarity', text: 'Realized true need: not just content, but guidance and community.', color: 'from-blue-400 to-indigo-500' },
    { emoji: '🤝', title: 'Helping Hand Extended', text: 'Started sharing knowledge, one student at a time.', color: 'from-green-400 to-blue-500' },
    { emoji: '🚀', title: 'Community Takes Flight', text: 'From a small group to a thriving, supportive network.', color: 'from-purple-400 to-indigo-500' },
  ];
  
  return (
    <section id="journey" className="relative py-20 min-h-screen flex items-center">
      <CodingBackground 
        intensity="low" 
        style="code"
        className="absolute inset-0 z-0 opacity-5"
      />
      <div className="container mx-auto px-4 relative z-10 w-full">
        <RevealOnScroll direction="up" duration={800}>
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-gray-800 dark:text-white leading-tight">
            From One Student's <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Struggle</span>…<br />
            to a <span className="bg-gradient-to-r from-pink-400 to-red-600 bg-clip-text text-transparent">Movement</span> of Thousands.
          </h2>
        </RevealOnScroll>
        
        <div className="relative max-w-6xl mx-auto">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-30 transform -translate-y-1/2 rounded-full"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {journeyPoints.map((point, index) => (
              <RevealOnScroll key={index} direction="up" delay={300 + index * 150} duration={800}>
                <div className="group relative">
                  {/* Connection dot */}
                  <div className={`hidden lg:block absolute top-1/2 -left-4 w-8 h-8 bg-gradient-to-r ${point.color} rounded-full border-4 border-white dark:border-gray-800 transform -translate-y-1/2 shadow-lg group-hover:scale-125 transition-transform duration-300`}></div>
                  
                  <div className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border-l-4 border-gradient group-hover:scale-105 transition-all duration-300 h-full`}
                       style={{ borderLeftColor: `hsl(${220 + index * 30}, 70%, 60%)` }}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${point.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-3xl`} />
                    <div className="relative">
                      <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">{point.emoji}</div>
                      <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${point.color} bg-clip-text text-transparent`}>
                        {point.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{point.text}</p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
        
        <RevealOnScroll direction="up" delay={900} duration={800}>
          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-300/20 rounded-2xl px-8 py-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">2024</span>
              <ArrowRight className="w-6 h-6 text-purple-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Present</span>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 font-medium">And we're just getting started! 🌟</p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

const WhyTechXNinjasSection: React.FC = () => {
  const struggles = [
    { text: 'Heard about Hackathons when I saw winner\'s Post on LinkedIn 😕', emoji: '😕' },
    { text: '"Where do I start? DSA or Web Dev or ML?" 😵‍💫', emoji: '😵‍💫' },
    { text: '"I feel left behind. Everyone is doing something…" 😔', emoji: '😔' },
    { text: '"I signed up for 3 courses but completed none." ❌', emoji: '❌' },
    { text: '"I am scared of coding interviews." 😭', emoji: '😭' },
  ];
  const solutions = [
    'Weekly Challenges & Hackathons',
    'Hackathons and Events Personalized Notifications and Guidance',
    'Resume-building Tools',
    'Internship & Campus Ambassador Updates',
    'Personalized Mentorship',
    'Instant Certificates & Trackable Progress',
    'A peer-to-peer vibe (not corporate!)',
  ];
  
  return (
    <section id="why" className="relative py-20 min-h-screen flex items-center">
      <CodingBackground 
        intensity="low" 
        style="terminal"
        className="absolute inset-0 z-0 opacity-5"
      />
      <div className="container mx-auto px-4 relative z-10 w-full">
        <RevealOnScroll direction="up" duration={800}>
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-gray-800 dark:text-white leading-tight">
            <span className="bg-gradient-to-r from-red-400 to-pink-600 bg-clip-text text-transparent">Been There.</span>{' '}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">Felt That.</span>{' '}
            <span className="bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">Solved It.</span>
          </h2>
        </RevealOnScroll>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
          <div>
            <RevealOnScroll direction="left" duration={800}>
              <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent text-center lg:text-left">
                Common Student Hurdles:
              </h3>
            </RevealOnScroll>
            
            <div className="space-y-6">
              {struggles.map((struggle, index) => (
                <RevealOnScroll key={index} direction="left" delay={300 + index * 100} duration={800}>
                  <div className="group flex items-start p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-red-200/30 hover:scale-105 transition-all duration-300">
                    <span className="text-4xl mr-4 group-hover:scale-110 transition-transform duration-300">{struggle.emoji}</span>
                    <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{struggle.text}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
          
          <div>
            <RevealOnScroll direction="right" duration={800}>
              <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent text-center lg:text-left">
                How TechXNinjas Helps:
              </h3>
            </RevealOnScroll>
            
            <div className="space-y-4">
              {solutions.map((solution, index) => (
                <RevealOnScroll key={index} direction="right" delay={300 + index * 100} duration={800}>
                  <div className="group flex items-center p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-green-200/30 hover:scale-105 transition-all duration-300">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{solution}</span>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const data = await getTestimonials();
        setTestimonials(data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section id="testimonials" className="relative py-20 min-h-screen flex items-center">
      <CodingBackground 
        intensity="low" 
        style="code"
        className="absolute inset-0 z-0 opacity-5"
      />
      <div className="container mx-auto px-4 relative z-10 w-full">
        <RevealOnScroll direction="up" duration={800}>
          <h2 className="text-4xl md:text-5xl font-black text-center mb-6 text-gray-800 dark:text-white leading-tight">
            Here's what our{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">learners</span>{' '}
            have to say…
          </h2>
          <div className="flex justify-center mb-16">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 text-blue-400 fill-current" />
              ))}
            </div>
          </div>
        </RevealOnScroll>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-purple-300 opacity-20"></div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl"></div>
            <div className="relative p-8">
              <TestimonialsSlider testimonials={testimonials} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const MentorsSection: React.FC = () => {
  const [mentors, setMentors] = useState<HomepageMentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const data = await getHomepageMentors();
        setMentors(data);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  return (
    <section id="mentors" className="relative py-20 min-h-screen flex items-center">
      <CodingBackground 
        intensity="low" 
        style="binary"
        className="absolute inset-0 z-0 opacity-5"
      />
      <div className="container mx-auto px-4 relative z-10 w-full">
        <RevealOnScroll direction="up" duration={800}>
          <h2 className="text-4xl md:text-5xl font-black text-center mb-6 text-gray-800 dark:text-white leading-tight">
            Meet the{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Mentors</span>
          </h2>
          <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-16 font-light max-w-3xl mx-auto">
            Real engineers. Real experience. <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent font-semibold">Real-time support.</span>
          </p>
        </RevealOnScroll>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-blue-300 opacity-20"></div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-3xl"></div>
            <div className="relative p-8">
              <MentorsSlider mentors={mentors} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const ExploreFeaturesSection: React.FC = () => {
  const features = [
    { 
      name: 'Resume Builder', 
      icon: FileText, 
      dev: true, 
      gradient: 'from-orange-400 to-red-500',
      description: 'Build professional resumes that stand out'
    },
    { 
      name: 'Shareable Portfolio Page', 
      icon: Globe, 
      dev: true, 
      gradient: 'from-blue-400 to-indigo-500',
      description: 'Showcase your projects to the world'
    },
    { 
      name: 'Earn TechPoints', 
      icon: Gift, 
      dev: true, 
      gradient: 'from-purple-400 to-pink-500',
      description: 'Get rewarded for your achievements'
    },
    { 
      name: 'Join Our WhatsApp Community', 
      icon: MessageSquare, 
      dev: false, 
      link: WHATSAPP_COMMUNITY_LINK, 
      external: true,
      gradient: 'from-green-400 to-emerald-500',
      description: 'Connect with fellow tech enthusiasts'
    },
    { 
      name: 'Take Smart Notes', 
      icon: NotebookText, 
      dev: true, 
      gradient: 'from-cyan-400 to-blue-500',
      description: 'Organize your learning efficiently'
    },
    { 
      name: 'Track Your Progress', 
      icon: TrendingUp, 
      dev: true, 
      gradient: 'from-indigo-400 to-purple-500',
      description: 'Monitor your growth journey'
    },
  ];
  
  return (
    <section id="features" className="relative py-20 min-h-screen flex items-center">
      <CodingBackground 
        intensity="low" 
        style="terminal"
        className="absolute inset-0 z-0 opacity-5"
      />
      <div className="relative flex flex-col justify-center container mx-auto px-4 md:px-8 max-w-screen-xl text-center relative z-10 w-full">
        <RevealOnScroll direction="up" duration={800}>
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-800 dark:text-white leading-tight">
            Explore What's Inside{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">TechXNinjas</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-16 font-light max-w-3xl mx-auto">
            Discover powerful tools and features designed to accelerate your tech journey
          </p>
        </RevealOnScroll>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <RevealOnScroll key={index} direction="up" delay={300 + index * 150} duration={800}>
              <div className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 cursor-pointer h-80">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative p-8 h-full flex flex-col justify-center items-center text-center">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h4 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${feature.gradient.split(' ')[1]} 0%, ${feature.gradient.split(' ')[3]} 100%)`
                      }}>
                    {feature.name}
                  </h4>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">
                    {feature.description}
                  </p>
                  
                  {feature.dev && (
                    <span className="absolute top-4 right-4 bg-gradient-to-r from-blue-400 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Coming Soon
                    </span>
                  )}
                  
                  {feature.link && (
                    <Link 
                      to={feature.link} 
                      target={feature.external ? "_blank" : "_self"} 
                      rel={feature.external ? "noopener noreferrer" : ""} 
                      className={`inline-flex items-center text-white font-semibold px-6 py-3 rounded-xl bg-gradient-to-r ${feature.gradient} hover:scale-110 transition-all duration-300 shadow-lg`}
                    >
                      Access Now 
                      <ArrowRight className="inline w-4 h-4 ml-2"/>
                    </Link>
                  )}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
        
        <RevealOnScroll direction="up" delay={900} duration={800}>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/events" 
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-12 rounded-2xl shadow-2xl transition-all duration-300 text-xl transform hover:scale-110"
            >
              <span className="relative z-10 flex items-center">
                <Terminal className="w-6 h-6 mr-3" />
                Explore All Features
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export const HomePage: React.FC = () => {
  usePageTitle("Home");
  
  return (
  <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
    <HeroSection />
    <CommunityStatsSection />
    <OurJourneySection />
    <WhyTechXNinjasSection />
    <TestimonialsSection />
    <MentorsSection />
    <ExploreFeaturesSection />
  </div>
);
};