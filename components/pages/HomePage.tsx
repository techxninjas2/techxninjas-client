// Example HomePage.tsx
import React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold">Welcome to TechXNinjas</h2>
        <p className="mt-4">This is a sample page with theme support.</p>
      </div>
    </div>
  );
};

export default HomePage;
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

const HeroSection: React.FC = () => {
  const highlights = [
    { text: 'Build Projects', icon: Briefcase },
    { text: 'Free Certificates', icon: Award },
    { text: 'No Signup Barrier', icon: Zap },
    { text: 'Personalized Paths', icon: Lightbulb },
    { text: 'Industry-level Mentorship', icon: Users },
  ];

  return (
    <section 
      className="relative bg-gradient-to-br from-brand-dark-gray via-brand-medium-gray to-brand-ninja-gold text-white py-20 md:py-32 overflow-hidden"
    >
      <CodingBackground 
        intensity="medium" 
        style="matrix"
        className="absolute inset-0 z-0"
      />
      <div className="container mx-auto px-4 text-center relative z-10">
        <RevealOnScroll direction="down" duration={1000}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-orange-500 dark:text-white">
            Welcome to TechXNinjas
          </h1>
        </RevealOnScroll>
        
        <RevealOnScroll direction="up" delay={300} duration={1000}>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-8 max-w-3xl mx-auto">
            Your ultimate platform for hackathons, tech challenges, community interaction, and professional growth in the world of technology.
          </p>
        </RevealOnScroll>
        
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {highlights.map((highlight, index) => (
            <RevealOnScroll key={index} direction="up" delay={400 + index * 100} duration={800}>
              <div className="flex items-center bg-white/70 dark:bg-white/20 backdrop-blur-sm text-gray-800 dark:text-white rounded-full shadow-md text-xs md:text-sm py-1 md:py-2 px-3 md:px-4">
  <highlight.icon className="w-5 h-5 mr-2 text-brand-primary" />
  {highlight.text}
</div>

            </RevealOnScroll>
          ))}
        </div>
        
        <RevealOnScroll direction="up" delay={800} duration={1000}>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/events" 
              className="bg-brand-primary hover:bg-opacity-80 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300 text-lg transform hover:scale-105"
            >
              Start Exploring
            </Link>
            <Link
              to="/courses" 
              className="bg-brand-light-blue hover:bg-opacity-80 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300 text-lg transform hover:scale-105"
            >
              Browse Programs
            </Link>
            <a
              href={WHATSAPP_COMMUNITY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300 text-lg inline-flex items-center transform hover:scale-105"
            >
              <MessageSquare className="w-5 h-5 mr-2" /> Join our WhatsApp Community
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
              <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
                <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
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
          <p className="text-xl font-semibold text-brand-primary dark:text-brand-ninja-gold">
            🎁 Surprise Contests Every Month and Win TechXNinjas Hoodies!
          </p>
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
                <div className="relative bg-brand-off-white dark:bg-brand-dark-gray p-6 rounded-xl shadow-lg border-l-4 border-brand-primary dark:border-brand-ninja-gold backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
                  <div className="hidden md:block absolute top-1/2 -left-3.5 w-6 h-6 bg-brand-light-blue rounded-full border-4 border-white dark:border-gray-800 transform -translate-y-1/2"></div>
                  <div className="text-4xl mb-3">{point.emoji}</div>
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
                  <li className="flex items-start p-4 bg-white dark:bg-gray-700 rounded-lg shadow backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
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
                  <li className="flex items-center text-gray-700 dark:text-gray-300 p-3 bg-white dark:bg-gray-700 rounded-lg shadow backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-primary"></div>
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-primary"></div>
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
                  bg-brand-off-white h-[230px] dark:bg-brand-dark-gray 
                  p-6 rounded-xl border-2 border-brand-primary shadow-lg 
                  hover:shadow-2xl transition-all duration-300 
                  transform hover:-translate-y-2 hover:scale-[1.03] hover:rotate-[0.6deg] 
                  backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">

                  <feature.icon className="w-12 h-12 mx-auto mb-4 text-brand-primary dark:text-brand-ninja-gold" />
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
            className="bg-brand-primary hover:bg-opacity-80 text-white font-semibold py-3 px-10 rounded-lg shadow-lg transition duration-300 text-lg transform hover:scale-105"
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