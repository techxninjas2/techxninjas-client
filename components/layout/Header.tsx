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
    
    const baseClasses = "flex flex-col items-center justify-center p-1 flex-1 text-xs transition-all duration-500 ease-out transform hover:scale-105";
    const activeColorClass = "text-brand-primary font-semibold";
    const inactiveColorClass = theme === 'dark' ? "text-gray-300" : "text-gray-600";
    
    let content;

    if (isSpecial) {
      content = (
        <div className={`flex flex-col items-center justify-center w-16 h-16 p-1 rounded-full -mt-4 shadow-lg ring-2 transform hover:scale-105 transition-all duration-500 ease-out ${
          theme === 'dark' ? 'ring-gray-600/30' : 'ring-gray-300/50'
        } ${
          isActive
            ? 'bg-gradient-to-br from-brand-primary to-orange-500 text-white'
            : theme === 'dark'
              ? 'bg-gradient-to-br from-gray-100 to-white text-brand-primary'
              : 'bg-gradient-to-br from-gray-100 to-white text-brand-primary'
        }`}>
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
        <nav className={`fixed bottom-0 left-0 right-0 h-16 flex items-center justify-around px-2 z-30 shadow-lg backdrop-blur-md ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 border-t border-gray-600/50'
            : 'bg-gradient-to-r from-white via-gray-50 to-white border-t border-gray-200'
        }`}>
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
