import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/WhatsAppButton';
import { HomePage } from './components/pages/HomePage'; 
import EventsPage from './components/pages/EventsPage';
import EventDetailPage from './components/pages/EventDetailPage';
import ArticlesPage from './components/pages/ArticlesPage';
import ArticleDetailPage from './components/pages/ArticleDetailPage';
import CoursesPage from './components/pages/CoursesPage';
import CourseDetailPage from './components/pages/CourseDetailPage';
import CreatorDashboardPage from './components/pages/CreatorDashboardPage';
import UserProfilePage from './components/pages/UserProfilePage';
import PublicProfilePage from './components/pages/PublicProfilePage';
import ContactUsPage from './components/pages/ContactUsPage';
import PrivacyPolicyPage from './components/pages/PrivacyPolicyPage';
import TermsOfServicePage from './components/pages/TermsOfServicePage';
import usePageTitle from './components/usePageTitle'; 
import { useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import CodingBackground from './components/CodingBackground';
import ThemeToggle from './components/ThemeToggle';
import TechFactGenerator from './components/TechFactGenerator';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
  usePageTitle(title); 
  return (
    <div className="container mx-auto px-4 py-8 text-center relative">
      <CodingBackground intensity="low" style="code" className="absolute inset-0" />
      <div className="relative z-10">
        <h1 className="text-3xl font-bold my-10">{title}</h1>
        <p>This is a placeholder page for {title}. Content to be added.</p>
        <img 
          src={`https://picsum.photos/800/400?random=${title.replace(/\s+/g, '-')}`} 
          alt="Placeholder" 
          className="mt-8 rounded-lg shadow-md mx-auto" 
        />
        
        {/* Add TechFactGenerator to placeholder pages for engagement */}
        {title === 'Giveaways' && (
          <div className="mt-12">
            <TechFactGenerator />
          </div>
        )}
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-primary"></div>
      </div>
    );
  }
  return user ? children : <Navigate to="/" replace />;
};

const App: React.FC = () => {
  const [mainContentLayout, setMainContentLayout] = useState<React.CSSProperties>({
    paddingTop: '80px',
    paddingBottom: '0px',
    marginLeft: '0px'
  });

  const handleMainContentLayoutChange = (style: React.CSSProperties) => {
    setMainContentLayout(style);
  };

  return (
    <ErrorBoundary>
      <BrowserRouter> 
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Header onMainContentLayoutChange={handleMainContentLayoutChange} />
          <main 
            id="main-content" 
            className="flex-grow transition-all duration-300 ease-in-out"
            style={mainContentLayout}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:slug" element={<EventDetailPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/articles/:slug" element={<ArticleDetailPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:slug" element={<CourseDetailPage />} />
              <Route path="/giveaways" element={<PlaceholderPage title="Giveaways" />} />
              <Route path="/contact-us" element={<ContactUsPage />} />
              <Route path="/about-us" element={<PlaceholderPage title="About Us" />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <UserProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/creator-dashboard" 
                element={
                  <ProtectedRoute>
                    <CreatorDashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/profile/:username" element={<PublicProfilePage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              {/* Catch all route for 404 */}
              <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
            </Routes>
          </main>
          <Footer layoutStyle={mainContentLayout} />
          <ScrollToTopButton />
          <WhatsAppButton />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;