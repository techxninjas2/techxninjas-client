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
    
    // Enhanced base classes with impressive animations (fixed scaling)
    const baseClasses = `
      flex flex-col items-center justify-center p-2 flex-1 text-xs 
      transition-all duration-300 ease-in-out
      ${isSpecial ? 'hover:scale-115 active:scale-105' : 'hover:scale-105 active:scale-95'}
      cursor-pointer
      relative
      group
      ${isSpecial ? 'h-full' : 'py-1'}
      transform-gpu
    `;
    
    // Enhanced color classes with smooth hover transitions
    const activeColorClass = "text-brand-primary font-semibold transform";
    const inactiveColorClass = `
      text-brand-text dark:text-dark-text 
      group-hover:text-brand-primary dark:group-hover:text-brand-primary 
      transition-all duration-300
    `;
    
    let content;

    if (isSpecial) {
      content = (
        <div className={`
          flex flex-col items-center justify-center w-16 h-16 p-1 rounded-full -mt-5 
          shadow-lg transition-all duration-300 ease-in-out
          hover:scale-115 hover:shadow-2xl hover:-translate-y-1
          active:scale-105 active:translate-y-0
          group-hover:rotate-2
          ${isActive 
            ? 'bg-gradient-to-br from-ninja-gold to-yellow-500 hover:from-yellow-400 hover:to-ninja-gold' 
            : 'bg-gradient-to-br from-brand-primary to-blue-600 hover:from-blue-500 hover:to-brand-primary'
          } 
          text-white
          before:absolute before:inset-0 before:rounded-full 
          before:bg-gradient-to-br before:from-white/20 before:to-transparent 
          before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
        `}>
          <Icon className={`
            w-6 h-6 mb-0.5 transition-all duration-300
            group-hover:scale-110 group-hover:rotate-12
          `} />
          <span className={`
            text-xs leading-tight font-medium
            group-hover:font-semibold transition-all duration-300
          `}>
            {label}
          </span>
          
          {/* Glow effect for special button */}
          <div className={`
            absolute inset-0 rounded-full blur-lg opacity-0 
            group-hover:opacity-30 transition-all duration-500
            ${isActive ? 'bg-ninja-gold' : 'bg-brand-primary'}
            -z-10
          `} />
        </div>
      );
    } else {
      content = (
        <div className="relative overflow-visible p-1">
          {/* Background hover effect */}
          <div className={`
            absolute inset-1 rounded-xl bg-gradient-to-t 
            from-brand-primary/10 to-transparent 
            scale-0 group-hover:scale-100 
            transition-transform duration-300 ease-out
            ${isActive ? 'scale-100 bg-brand-primary/20' : ''}
          `} />
          
          {/* Icon with enhanced animations */}
          <Icon className={`
            w-5 h-5 mb-1 transition-all duration-300 ease-out
            ${isActive ? activeColorClass : inactiveColorClass}
            group-hover:scale-110 group-hover:-translate-y-0.5
            relative z-10 mx-auto
          `} />
          
          {/* Label with enhanced animations */}
          <span className={`
            leading-tight transition-all duration-300 ease-out text-center block
            ${isActive ? activeColorClass : inactiveColorClass}
            group-hover:font-semibold
            relative z-10
          `}>
            {label}
          </span>
          
          {/* Active indicator dot */}
          {isActive && (
            <div className="
              absolute -top-0.5 left-1/2 transform -translate-x-1/2
              w-1 h-1 bg-brand-primary rounded-full
              animate-pulse
            " />
          )}
          
          {/* Subtle glow effect on hover */}
          <div className={`
            absolute inset-0 rounded-xl 
            bg-brand-primary/10 scale-75 
            group-hover:scale-100 group-hover:opacity-60
            transition-all duration-400 ease-out
            opacity-0 blur-sm
          `} />
        </div>
      );
    }

    if (isAction) {
        return (
            <button 
              onClick={onClick} 
              className={baseClasses}
              aria-label={`${label} navigation button`}
            >
                {content}
            </button>
        );
    }

    return (
      <NavLink 
        to={to} 
        className={baseClasses}
        aria-label={`Navigate to ${label}`}
      >
        {content}
      </NavLink>
    );
  };

  return (
    <>
      <SearchHeader />
      
      <div className="lg:hidden">
        <nav className={`
          fixed bottom-0 left-0 right-0 h-16 
          bg-transparent flex items-center justify-around px-1 z-30
          border-t border-gray-200/50 dark:border-gray-700/50 
          bg-opacity-95 backdrop-blur-xl backdrop-saturate-150
          bg-white/95 dark:bg-gray-800/95
          shadow-2xl shadow-black/10 dark:shadow-black/30
          transition-all duration-300
          before:absolute before:inset-0 
          before:bg-gradient-to-t before:from-white/5 before:to-transparent
          before:pointer-events-none
          overflow-visible
        `}>
          {mobileNavItems.map((item, index) => (
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
          
          {/* Floating action indicator */}
          <div className="
            absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1
            w-8 h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent
            rounded-full opacity-50
          " />
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