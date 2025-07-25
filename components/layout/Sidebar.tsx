import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Rating, Theme, User } from '../../types';
import { BRAND_NAME } from '../../constants';
import {
  BellIcon,
  UserCircleIcon,
  LogOut as LogoutIcon,
  LayoutDashboard as DashboardIcon,
  Home as HomeIcon,
  CalendarDays as CalendarDaysIcon,
  FileText as FileTextIcon,
  Gift as GiftIcon,
  PanelLeftClose as PanelLeftCloseIcon,
  PanelRightOpen as PanelRightOpenIcon,
  Settings as SettingsIcon, 
  GraduationCap as GraduationCapIcon, 
  Youtube as YoutubeIcon,
  StarIcon  as RatingIcon
} from 'lucide-react';
import ThemeToggle from '../ThemeToggle'; 

type NavLinkItem = {
  to: string;
  label: string;
  icon: React.ElementType;
};

const navLinks: NavLinkItem[] = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/events', label: 'Events', icon: CalendarDaysIcon },
  { to: '/courses', label: 'Courses', icon: GraduationCapIcon },
  { to: '/giveaways', label: 'Giveaways', icon: GiftIcon },
  { to: '/articles', label: 'Articles', icon: FileTextIcon },
  { to: '/feedback', label: 'Feedback', icon: RatingIcon},
];

const COLLAPSED_WIDTH = "80px"; 
const EXPANDED_WIDTH = "256px"; 

type SidebarState = 'collapsed' | 'hover-expanded' | 'pinned-expanded';

interface SidebarProps {
  user: User | null;
  theme: Theme; 
  logout: () => Promise<void>;
  openAuthModal: () => void;
  onWidthChange: (width: string) => void;
  isUserDropdownOpen: boolean;
  toggleUserDropdown: () => void;
  closeUserDropdown: () => void;
  userDropdownRef: React.RefObject<HTMLDivElement>;
}

const SidebarNavItem: React.FC<{
  to: string;
  isExpanded: boolean;
  onMouseEnter?: (event: React.MouseEvent<HTMLAnchorElement>, label: string) => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ to, isExpanded, onMouseEnter, onMouseLeave, onClick, title, children }) => (
  <NavLink
    to={to}
    title={!isExpanded ? title : undefined}
    onMouseEnter={!isExpanded && onMouseEnter ? (e) => onMouseEnter(e, title) : undefined}
    onMouseLeave={!isExpanded && onMouseLeave ? onMouseLeave : undefined}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors duration-200 mt-10 ${
        isActive
          ? 'bg-brand-primary text-white'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      } ${!isExpanded ? 'justify-center' : ''}`
    }
  >
    {children}
  </NavLink>
);

const Sidebar: React.FC<SidebarProps> = ({
  user,
  logout,
  openAuthModal,
  onWidthChange,
  isUserDropdownOpen,
  toggleUserDropdown,
  closeUserDropdown,
  userDropdownRef
}) => {
  const [sidebarState, setSidebarState] = useState<SidebarState>('collapsed');
  const [activeTooltip, setActiveTooltip] = useState<{ text: string; top: number; left: number } | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const isEffectivelyOpen = sidebarState === 'hover-expanded' || sidebarState === 'pinned-expanded';
  const currentWidthClass = isEffectivelyOpen ? 'w-64' : 'w-20';

  useEffect(() => {
    onWidthChange(isEffectivelyOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH);
  }, [isEffectivelyOpen, onWidthChange]);

  const handleMouseEnterSidebar = useCallback(() => {
    if (sidebarState === 'collapsed') {
      setSidebarState('hover-expanded');
    }
  }, [sidebarState]);

  const handleMouseLeaveSidebar = useCallback(() => {
    if (sidebarState === 'hover-expanded') {
      setSidebarState('collapsed');
      setActiveTooltip(null); 
    }
  }, [sidebarState]);

  const handleTogglePin = () => {
    if (sidebarState === 'pinned-expanded') {
      setSidebarState('collapsed');
    } else {
      setSidebarState('pinned-expanded');
    }
    setActiveTooltip(null); 
  };
  
  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple logout attempts
    
    setIsLoggingOut(true);
    closeUserDropdown();
    
    try {
      await logout();
      // Optionally show success message
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
      // Show error message to user if needed
      alert('Logout failed. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleIconMouseEnter = (event: React.MouseEvent<HTMLAnchorElement>, label: string) => {
    if (!isEffectivelyOpen) {
      const rect = event.currentTarget.getBoundingClientRect();
      setActiveTooltip({
        text: label,
        top: rect.top + rect.height / 2, 
        left: rect.right + 10, 
      });
    }
  };

  const handleIconMouseLeave = () => {
    setActiveTooltip(null);
  };
  
  const authControls = (isSidebarCollapsed: boolean) => {
    if (user) {
      if (isSidebarCollapsed) {
        return (
          <div className="relative w-full" ref={userDropdownRef}>
            <button 
              onClick={toggleUserDropdown} 
              className="w-full p-2 aspect-square flex items-center justify-center text-sm rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200"
              aria-label="User menu"
              title="User menu"
            >
              <UserCircleIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            {isUserDropdownOpen && (
              <div 
                  className="absolute left-full ml-2 bottom-0 mb-0 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5"
                  style={{ zIndex: 1000 }}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button-collapsed"
              >
                <span className="block px-4 py-2 text-xs text-gray-500 dark:text-gray-400 truncate" role="none">{user.email}</span>
                <Link 
                  to="/dashboard" 
                  onClick={closeUserDropdown} 
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  role="menuitem"
                >
                  <DashboardIcon className="w-4 h-4 mr-2 lucide" /> My Dashboard
                </Link>
                {/* Add Creator Dashboard link if user is a creator */}
                <Link 
                  to="/creator-dashboard" 
                  onClick={closeUserDropdown} 
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  role="menuitem"
                >
                  <YoutubeIcon className="w-4 h-4 mr-2 lucide" /> Creator Dashboard
                </Link>
                <button 
                  onClick={handleLogout} 
                  disabled={isLoggingOut}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  role="menuitem"
                >
                  <LogoutIcon className="w-4 h-4 mr-2 lucide" /> 
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div className="space-y-2 w-full">
            <Link
              to="/dashboard"
              className="w-full text-sm rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200 px-3 py-2 flex items-center"
              aria-label="My Profile"
              onClick={closeUserDropdown}
            >
              <UserCircleIcon className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-300" />
              <span className="flex-shrink-0">My Profile</span>
            </Link>
            <Link
              to="/creator-dashboard"
              className="w-full text-sm rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200 px-3 py-2 flex items-center"
              aria-label="Creator Dashboard"
              onClick={closeUserDropdown}
            >
              <YoutubeIcon className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-300" />
              <span className="flex-shrink-0">Creator Dashboard</span>
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full text-sm rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200 px-3 py-2 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Logout"
            >
              <LogoutIcon className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-300" />
              <span className="flex-shrink-0">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        );
      }
    }
    return (
       <button
        onClick={openAuthModal}
        className={`
          w-full text-sm rounded-md border border-brand-primary text-brand-primary 
          hover:bg-brand-primary hover:text-white transition-colors duration-200
          ${isSidebarCollapsed 
            ? 'p-2 aspect-square flex items-center justify-center' 
            : 'px-3 py-2 flex items-center' 
          } 
        `}
        title="Login / Register"
      >
        {isSidebarCollapsed ? (
          <UserCircleIcon className="w-5 h-5" />
        ) : (
          <>
            <UserCircleIcon className="w-5 h-5 mr-2" />
            <span className="flex-shrink-0">Login</span>
          </>
        )}
      </button>
    );
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        onMouseEnter={handleMouseEnterSidebar}
        onMouseLeave={handleMouseLeaveSidebar}
        className={`fixed top-[64px] left-0 h-[calc(100vh-64px)] bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out flex flex-col ${currentWidthClass} py-4`}
        style={{ 
          zIndex: 40,
          position: 'fixed'
        }}
        aria-label="Main navigation sidebar"
      >
        <div className={`flex items-center mb-6 ${isEffectivelyOpen ? 'px-4 justify-between' : 'px-0 justify-center'}`}>
          {isEffectivelyOpen && (
            <Link to="/" className="text-2xl font-bold text-brand-primary">{BRAND_NAME}</Link>
          )}
        </div>

        <nav className={`flex-grow space-y-1.5 ${isEffectivelyOpen ? 'px-4' : 'px-2'}`}>
          {navLinks.map((link) => {
            const IconComponent = link.icon || SettingsIcon; 
            return (
              <SidebarNavItem
                key={link.to}
                to={link.to}
                isExpanded={isEffectivelyOpen}
                onMouseEnter={handleIconMouseEnter}
                onMouseLeave={handleIconMouseLeave}
                title={link.label}
              >
                <IconComponent className="w-5 h-5 lucide" />
                {isEffectivelyOpen && <span className="ml-3">{link.label}</span>}
              </SidebarNavItem>
            );
          })}
        </nav>

        <div className={`mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 ${isEffectivelyOpen ? 'px-4' : 'px-2'}`}>
          <div className={`flex ${isEffectivelyOpen ? 'justify-between items-center' : 'flex-col space-y-3 items-center'} mb-3 w-full`}>
            <ThemeToggle />
            <button 
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                aria-label="Notifications"
            >
              <BellIcon className="w-5 h-5 lucide" />
              {isEffectivelyOpen && <span className="sr-only">Notifications</span>}
            </button>
          </div>
          <div className={`${isEffectivelyOpen ? '' : 'flex flex-col items-center'}`}>
            {authControls(!isEffectivelyOpen)}
          </div>
        </div>
        
        <button
          onClick={handleTogglePin}
          className="absolute -right-0 bottom-10 transform translate-x-1/2 translate-y-1/2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-brand-primary dark:text-ninja-gold p-2 rounded-full shadow-md border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          style={{ zIndex: 50 }}
          aria-label={sidebarState === 'pinned-expanded' ? 'Collapse and unpin sidebar' : 'Expand and pin sidebar'}
        >
          {sidebarState === 'pinned-expanded' ? <PanelLeftCloseIcon className="w-5 h-5 lucide" /> : <PanelRightOpenIcon className="w-5 h-5 lucide" />}
        </button>
      </aside>

      {activeTooltip && (
        <div
          className="fixed bg-gray-900 text-white text-xs px-2 py-1 rounded-md shadow-lg pointer-events-none"
          style={{ 
            top: activeTooltip.top, 
            left: activeTooltip.left, 
            transform: 'translateY(-50%)',
            zIndex: 1000
          }}
          role="tooltip"
        >
          {activeTooltip.text}
        </div>
      )}
    </>
  );
};

export default Sidebar;