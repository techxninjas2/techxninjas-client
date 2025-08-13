import React, { useState, useEffect, useContext } from 'react';
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
} from 'lucide-react';
import { WHATSAPP_COMMUNITY_LINK } from '../../constants';
import usePageTitle from '../usePageTitle';
import CodingBackground from '../CodingBackground';
import RevealOnScroll from '../RevealOnScroll';
import AnimatedCounter from '../AnimatedCounter';
import TestimonialsSlider from '../TestimonialsSlider';
import MentorsSlider from '../MentorsSlider';
import { getTestimonials, getHomepageMentors } from '../../services/homeService';
import { Testimonial, HomepageMentor, ThemeContextType } from '../../types';
import { ThemeContext } from '../../contexts/ThemeContext';

const HeroSection: React.FC = () => {
  const { theme } = useContext(ThemeContext) as ThemeContextType;
  const highlights = [
    { text: 'Build Projects', icon: Briefcase },
    { text: 'Free Certificates', icon: Award },
    { text: 'No Signup Barrier', icon: Zap },
    { text: 'Personalized Paths', icon: Lightbulb },
    { text: 'Industry-level Mentorship', icon: Users },
  ];

  return (
    <section
      className={`relative py-16 md:py-20 overflow-hidden min-h-screen flex items-center ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white'
          : 'bg-gradient-to-br from-gray-100 via-white to-gray-200 text-gray-900'
      }`}
    >
      <CodingBackground
        intensity="low"
        style="code"
        className="absolute inset-0 z-0 opacity-30"
      />
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-purple-500/10"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-brand-primary/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-blue-500/20 to-brand-primary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <div className="container mx-auto px-4 text-center relative z-10 -mt-16">
        <RevealOnScroll direction="down" duration={1000}>
          <div className="mb-8">
            <div className="inline-flex items-center bg-gradient-to-r from-brand-primary/20 to-purple-500/20 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-white/20">
              <span className={`text-sm font-medium flex items-center gap-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Welcome to the future of tech learning ✨
              </span>
            </div>
            <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Tech<span className="bg-gradient-to-r from-brand-primary to-purple-500 bg-clip-text text-transparent">X</span>Ninjas
            </h1>
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-brand-primary"></div>
              <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
              <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-purple-500"></div>
            </div>
          </div>
        </RevealOnScroll>
        
        <RevealOnScroll direction="up" delay={300} duration={1000}>
          <p className={`text-lg md:text-xl mb-16 max-w-3xl mx-auto font-normal leading-relaxed opacity-90 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Your ultimate platform for hackathons, tech challenges, community interaction, and professional growth in the world of technology.
          </p>
        </RevealOnScroll>
        
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {highlights.map((highlight, index) => (
            <RevealOnScroll key={index} direction="up" delay={400 + index * 100} duration={800}>
              <div className={`flex items-center backdrop-blur-sm rounded-full text-sm py-2 px-4 transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-white/30'
                  : 'bg-gray-900/10 text-gray-800 border border-gray-800/20 hover:bg-gray-900/15 hover:border-gray-800/30'
              }`}>
  <highlight.icon className={`w-4 h-4 mr-2 ${
    theme === 'dark' ? 'text-white/80' : 'text-gray-700'
  }`} />
  {highlight.text}
</div>

            </RevealOnScroll>
          ))}
        </div>
        
        <RevealOnScroll direction="up" delay={800} duration={1000}>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-2xl mx-auto">
            <Link
              to="/events"
              className="bg-gradient-to-r from-brand-primary to-orange-500 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-brand-primary/25 transform hover:-translate-y-1 flex items-center gap-2"
            >
              <span>Start Exploring</span>
              <span className="text-lg">🚀</span>
            </Link>
            <Link
              to="/courses"
              className="bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25 transform hover:-translate-y-1 flex items-center gap-2"
            >
              <span>Browse Programs</span>
              <span className="text-lg">📚</span>
            </Link>
            <a
              href={WHATSAPP_COMMUNITY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-emerald-600 to-green-500 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/25 transform hover:-translate-y-1 inline-flex items-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Join Community</span>
              <span className="text-lg">💬</span>
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

const CommunityStatsSection: React.FC = () => {
  const stats = [
    { value: '10+', label: 'National Tech Events', icon: CalendarDays, color: 'text-brand-primary' },
    { value: '15,000+', label: 'Community Members', icon: Users, color: 'text-brand-light-blue' },
    { value: '10+', label: 'Dedicated Mentors', icon: UserCheck, color: 'text-green-500' },
    { value: '500+', label: 'Certificates Issued', icon: Award, color: 'text-brand-ninja-gold' },
  ];
  return (
    <section className="relative py-16 bg-brand-off-white dark:bg-brand-dark-gray overflow-hidden">
      <CodingBackground 
        intensity="low" 
        style="binary"
        className="absolute inset-0 z-0"
      />
      <div className="container mx-auto px-4 text-center relative z-10">
        <RevealOnScroll direction="up" duration={800}>
          <h2 className="text-3xl font-bold mb-4 text-brand-dark-gray dark:text-brand-off-white">
            The TechXNinjas tribe is growing — and you're welcome to join!
          </h2>
        </RevealOnScroll>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 my-10">
          {stats.map((stat, index) => (
            <RevealOnScroll key={index} direction="up" delay={300 + index * 150} duration={800}>
              <div className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 p-10 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-110 hover:-translate-y-5 hover:rotate-2 transition-all duration-500 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95 border-2 border-gray-200 dark:border-gray-500 hover:border-brand-primary hover:border-4 dark:hover:border-brand-ninja-gold group pulse-glow hover:pulse-glow">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-600 dark:to-gray-700 w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                  <stat.icon className={`w-12 h-12 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                </div>
                <p className={`text-4xl font-extrabold ${stat.color} mb-2`}>
                  <AnimatedCounter 
                    end={stat.value} 
                    duration={2000} 
                    delay={500 + index * 200} 
                  />
                </p>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
        
        <RevealOnScroll direction="up" delay={1000} duration={800}>
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-700/50 shadow-lg backdrop-blur-sm">
            <p className="text-xl font-semibold bg-gradient-to-r from-brand-primary to-yellow-500 dark:from-brand-ninja-gold dark:to-yellow-400 bg-clip-text text-transparent">
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
    { emoji: '🤯', title: 'The Maze of Choices', text: 'Lost in the sea of tech options, unsure where to begin.' },
    { emoji: '💡', title: 'A Spark of Clarity', text: 'Realized true need: not just content, but guidance and community.' },
    { emoji: '🤝', title: 'Helping Hand Extended', text: 'Started sharing knowledge, one student at a time.' },
    { emoji: '🚀', title: 'Community Takes Flight', text: 'From a small group to a thriving, supportive network.' },
  ];
  return (
    <section className="relative py-16 bg-white dark:bg-gray-800 overflow-hidden">
      <CodingBackground 
        intensity="low" 
        style="code"
        className="absolute inset-0 z-0"
      />
      <div className="container mx-auto px-4 relative z-10">
        <RevealOnScroll direction="up" duration={800}>
          <h2 className="text-3xl font-bold text-center mb-12 text-brand-dark-gray dark:text-white">
            From One Student's Struggle… <br className="sm:hidden" />to a Movement of Thousands.
          </h2>
        </RevealOnScroll>
        
        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-brand-light-blue opacity-50 transform -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {journeyPoints.map((point, index) => (
              <RevealOnScroll key={index} direction="up" delay={300 + index * 150} duration={800}>
                <div className="relative bg-brand-off-white dark:bg-brand-dark-gray p-8 rounded-2xl shadow-xl hover:shadow-2xl border-l-4 border-brand-primary dark:border-brand-ninja-gold backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 transform hover:-translate-y-1 transition-all duration-300 group">
                  <div className="hidden md:block absolute top-1/2 -left-3.5 w-6 h-6 bg-brand-light-blue rounded-full border-4 border-white dark:border-gray-800 transform -translate-y-1/2"></div>
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{point.emoji}</div>
                  <h3 className="text-xl font-semibold mb-2 text-brand-primary dark:text-brand-ninja-gold">{point.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{point.text}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
        
        <RevealOnScroll direction="up" delay={900} duration={800}>
          <div className="text-center mt-12 text-gray-600 dark:text-gray-400">
            <p className="text-lg font-semibold">2024 <ArrowRight className="inline w-5 h-5 mx-1" /> Present</p>
            <p>And we're just getting started!</p>
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
    { text: '"I feel left behind. Everyone is doing something…" 😔', emoji: '���' },
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
    <section className="relative py-16 bg-brand-off-white dark:bg-brand-dark-gray overflow-hidden">
      <CodingBackground 
        intensity="low" 
        style="terminal"
        className="absolute inset-0 z-0"
      />
      <div className="container mx-auto px-4 relative z-10">
        <RevealOnScroll direction="up" duration={800}>
          <h2 className="text-3xl font-bold text-center mb-12 text-brand-dark-gray dark:text-brand-off-white">
            Been There. Felt That. Solved It.
          </h2>
        </RevealOnScroll>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <RevealOnScroll direction="left" duration={800}>
              <h3 className="text-2xl font-semibold mb-6 text-brand-primary dark:text-brand-ninja-gold text-center md:text-left">Common Student Hurdles:</h3>
            </RevealOnScroll>
            
            <ul className="space-y-4">
              {struggles.map((struggle, index) => (
                <RevealOnScroll key={index} direction="left" delay={300 + index * 100} duration={800}>
                  <li className="flex items-start p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-600">
                    <span className="text-2xl mr-3">{struggle.emoji}</span>
                    <p className="text-gray-700 dark:text-gray-300">{struggle.text}</p>
                  </li>
                </RevealOnScroll>
              ))}
            </ul>
          </div>
          
          <div>
            <RevealOnScroll direction="right" duration={800}>
              <h3 className="text-2xl font-semibold mb-6 text-brand-primary dark:text-brand-ninja-gold text-center md:text-left">How TechXNinjas Helps:</h3>
            </RevealOnScroll>
            
            <ul className="space-y-3">
              {solutions.map((solution, index) => (
                <RevealOnScroll key={index} direction="right" delay={300 + index * 100} duration={800}>
                  <li className="flex items-center text-gray-700 dark:text-gray-300 p-5 bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-600 group">
                    <CheckCircle className="w-6 h-6 mr-4 text-green-500 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    {solution}
                  </li>
                </RevealOnScroll>
              ))}
            </ul>
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
    <section className="relative py-16 bg-white dark:bg-gray-800 overflow-hidden">
      <CodingBackground 
        intensity="low" 
        style="code"
        className="absolute inset-0 z-0"
      />
      <div className="container mx-auto px-4 relative z-10">
        <RevealOnScroll direction="up" duration={800}>
          <h2 className="text-3xl font-bold text-center mb-12 text-brand-dark-gray dark:text-white">
            Here's what our learners have to say…
          </h2>
        </RevealOnScroll>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-brand-primary border-r-brand-primary absolute top-0 left-0"></div>
            </div>
          </div>
        ) : (
          <TestimonialsSlider testimonials={testimonials} />
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
    <section className="relative py-16 bg-brand-off-white dark:bg-brand-dark-gray overflow-hidden">
      <CodingBackground 
        intensity="low" 
        style="binary"
        className="absolute inset-0 z-0"
      />
      <div className="container mx-auto px-4 relative z-10">
        <RevealOnScroll direction="up" duration={800}>
          <h2 className="text-3xl font-bold text-center mb-4 text-brand-dark-gray dark:text-brand-off-white">
            Meet the Mentors
          </h2>
          <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12">
            Real engineers. Real experience. Real-time support.
          </p>
        </RevealOnScroll>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-brand-primary border-r-brand-primary absolute top-0 left-0"></div>
            </div>
          </div>
        ) : (
          <MentorsSlider mentors={mentors} />
        )}
      </div>
    </section>
  );
};

const ExploreFeaturesSection: React.FC = () => {
  const features = [
    { name: 'Resume Builder', icon: FileText, dev: true },
    { name: 'Shareable Portfolio Page', icon: Globe, dev: true },
    { name: 'Earn TechPoints', icon: Gift, dev: true },
    { name: 'Join Our WhatsApp Community', icon: MessageSquare, dev: false, link: WHATSAPP_COMMUNITY_LINK, external: true },
    { name: 'Take Smart Notes', icon: NotebookText, dev: true },
    { name: 'Track Your Progress', icon: TrendingUp, dev: true },
  ];

  return (
    <section className="relative py-16 bg-white dark:bg-gray-800 overflow-hidden">
      <CodingBackground 
        intensity="low" 
        style="terminal"
        className="absolute inset-0 z-0"
      />
      <div className="relative flex flex-col justify-between container mx-auto px-4 md:px-8 max-w-screen-xl text-center relative z-10">

        <RevealOnScroll direction="up" duration={800}>
          <h2 className="text-3xl font-bold mb-12 text-brand-dark-gray dark:text-white">
            Explore What's Inside TechXNinjas
          </h2>
        </RevealOnScroll>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <RevealOnScroll key={index} direction="up" delay={300 + index * 150} duration={800}>
              <div className="group perspective-[1200px]">
                <div className="relative flex flex-col items-center justify-center
                  bg-gradient-to-br from-brand-off-white via-white to-gray-50 dark:from-brand-dark-gray dark:via-gray-700 dark:to-gray-600 h-[280px]
                  p-10 rounded-3xl border-4 border-brand-primary dark:border-brand-ninja-gold shadow-2xl
                  hover:shadow-3xl hover:border-orange-400 dark:hover:border-yellow-400 hover:shadow-brand-primary/30 transition-all duration-500
                  transform hover:-translate-y-6 hover:scale-[1.08] hover:rotate-[2deg]
                  backdrop-blur-md bg-opacity-98 dark:bg-opacity-98 group overflow-hidden card-hover-lift">

                  <div className="bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 dark:from-brand-ninja-gold/10 dark:to-brand-ninja-gold/5 w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                    <feature.icon className="w-12 h-12 text-brand-primary dark:text-brand-ninja-gold group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-brand-dark-gray dark:text-white">
                    {feature.name}
                  </h4>

                  {feature.dev && (
                    <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                      In Development
                    </span>
                  )}

                  {feature.link && (
                    <Link
                      to={feature.link}
                      target={feature.external ? "_blank" : "_self"}
                      rel={feature.external ? "noopener noreferrer" : ""}
                      className="text-sm text-brand-light-blue hover:underline mt-2 inline-block"
                    >
                      Access Now <ArrowRight className="inline w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll direction="up" delay={900} duration={800}>
          <Link
            to="/events"
            className="bg-gradient-to-r from-brand-primary to-orange-600 hover:from-orange-600 hover:to-red-500 text-white font-semibold py-4 px-12 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg transform hover:scale-105 hover:-translate-y-1 ring-2 ring-transparent hover:ring-orange-300/50"
          >
            Explore Features
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export const HomePage: React.FC = () => {
  usePageTitle("Home");
  return (
    <div className="bg-white dark:bg-gray-800">
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
