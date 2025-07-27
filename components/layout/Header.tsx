import React, { useState, useEffect, useContext, useRef, useCallback, useMemo } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContextType, AuthContextType as AppAuthContextType } from '../../types';
import AuthModal from '../auth/AuthModal';
import Sidebar from './Sidebar'; 
import SearchHeader from './SearchHeader';
import {
  Home as HomeIcon,
  CalendarDays as CalendarDaysIcon,
  GraduationCap as GraduationCapIcon,
  Gift as GiftIcon,
  UserCircle as UserCircleIconLucide, 
  FileText,
} from 'lucide-react';

const COLLAPSED_SIDEBAR_WIDTH = "80px";

interface HeaderProps {
  onMainContentLayoutChange: (style: React.CSSProperties) => void;
}

const Header: React.FC<HeaderProps> = ({ onMainContentLayoutChange }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [desktopSidebarActualWidth, setDesktopSidebarActualWidth] = useState(COLLAPSED_SIDEBAR_WIDTH);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);

  const { theme } = useContext(ThemeContext) as ThemeContextType;
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  if (!authContext) {
    console.error("AuthContext is not available");
    return null; 
  }
  const { user, logout } = authContext as AppAuthContextType;

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const toggleUserDropdown = useCallback(() => {
    setIsUserDropdownOpen(prev => !prev);
  }, []);

  const closeUserDropdown = useCallback(() => {
    setIsUserDropdownOpen(false);
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        closeUserDropdown();
      }
    };
    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserDropdownOpen, closeUserDropdown]);

  const handleSidebarWidthChange = useCallback((newWidth: string) => {
    setDesktopSidebarActualWidth(newWidth);
  }, []);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Memoize the layout style to prevent unnecessary re-renders
  const layoutStyle = useMemo((): React.CSSProperties => {
    if (isMobileView) {
      return {
        paddingTop: '80px',
        paddingBottom: '64px',
        marginLeft: '0px'
      };
    } else {
      return {
        paddingTop: '80px',
        paddingBottom: '0px',
        marginLeft: desktopSidebarActualWidth
      };
    }
  }, [isMobileView, desktopSidebarActualWidth]);

  useEffect(() => {
    onMainContentLayoutChange(layoutStyle);

    if (isAuthModalOpen) {
        document.body.classList.add('overflow-hidden');
    } else {
        document.body.classList.remove('overflow-hidden');
    }

    return () => {
        document.body.classList.remove('overflow-hidden');
    };
  }, [layoutStyle, isAuthModalOpen, onMainContentLayoutChange]);

  const mobileNavItems = [
    { to: '/', label: 'Home', icon: HomeIcon },
    { to: '/events', label: 'Events', icon: CalendarDaysIcon },
    { to: '/courses', label: 'Courses', icon: GraduationCapIcon, special: true },
    { to: '/giveaways', label: 'Giveaways', icon: GiftIcon },
    { to: '/resume-builder', label: 'Resume', icon: FileText },
    { to: '/profile', label: 'Profile', icon: UserCircleIconLucide, action: true },
  ];

  const MobileBottomNavItem: React.FC<{
    to: string;
    label: string;
    icon: React.ElementType;
    isSpecial?: boolean;
    isAction?: boolean;
    onClick?: () => void;
  }> = ({ to, label, icon: Icon, isSpecial, isAction, onClick }) => {
    const isActive = location.pathname === to || (isAction && location.pathname === '/dashboard' && user);
    
    const baseClasses = "flex flex-col items-center justify-center p-1 flex-1 text-xs transition-colors duration-200";
    const activeColorClass = "text-brand-primary";
    const inactiveColorClass = "text-brand-text dark:text-dark-text";
    
    let content;

    if (isSpecial) {
      content = (
        <div className={`flex flex-col items-center justify-center w-16 h-16 p-1 rounded-full -mt-5 shadow-lg
                        ${isActive ? 'bg-ninja-gold' : 'bg-brand-primary'} text-white`}>
          <Icon className="w-6 h-6 mb-0.5" />
          <span className="text-xs leading-tight">{label}</span>
        </div>
      );
    } else {
      content = (
        <>
          <Icon className={`w-5 h-5 mb-0.5 ${isActive ? activeColorClass : inactiveColorClass}`} />
          <span className={`leading-tight ${isActive ? activeColorClass : inactiveColorClass}`}>{label}</span>
        </>
      );
    }

    if (isAction) {
        return (
            <button onClick={onClick} className={`${baseClasses} ${isSpecial ? 'h-full' : ''}`}>
                {content}
            </button>
        );
    }

    return (
      <NavLink to={to} className={`${baseClasses} ${isSpecial ? 'h-full' : ''}`}>
        {content}
      </NavLink>
    );
  };

  return (
    <>
      <SearchHeader />
      
      <div className="lg:hidden">
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-transparent flex items-center justify-around px-1 z-30
                       border-t border-gray-200 dark:border-gray-700 
                       bg-opacity-90 backdrop-blur-md 
                       bg-white dark:bg-gray-800">
          {mobileNavItems.map(item => (
            <MobileBottomNavItem
              key={item.label}
              to={item.to === '/profile' && user ? '/dashboard' : item.to}
              label={item.label}
              icon={item.icon}
              isSpecial={item.special}
              isAction={item.action}
              onClick={item.action ? () => {
                if (user) {
                  navigate('/dashboard');
                } else {
                  openAuthModal();
                }
              } : undefined}
            />
          ))}
        </nav>
      </div>
      
      <div className="hidden lg:block">
        <Sidebar 
          user={user}
          theme={theme}
          logout={logout}
          openAuthModal={openAuthModal}
          onWidthChange={handleSidebarWidthChange}
          isUserDropdownOpen={isUserDropdownOpen}
          toggleUserDropdown={toggleUserDropdown}
          closeUserDropdown={closeUserDropdown}
          userDropdownRef={userDropdownRef}
        />
      </div>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </>
  );
};

export default Header;