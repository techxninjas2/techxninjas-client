import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import { Theme, User } from '../../types';
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
  ChevronDown
} from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

type NavLinkItem = {
  to: string;
  label: string;
  icon: React.ElementType;
  subItems?: string[];
};

const navLinks: NavLinkItem[] = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { 
    to: '/events', 
    label: 'Events', 
    icon: CalendarDaysIcon,
    subItems: ['Hackathons', 'Workshops', 'Meetups']
  },
  { to: '/courses', label: 'Courses', icon: GraduationCapIcon },
  { to: '/giveaways', label: 'Giveaways', icon: GiftIcon },
  { to: '/articles', label: 'Articles', icon: FileTextIcon },
];

const COLLAPSED_WIDTH = "80px"; 
const EXPANDED_WIDTH = "280px"; 

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
  hasSubItems?: boolean;
  isSubItemActive?: boolean;
  onMouseEnter?: (event: React.MouseEvent<HTMLAnchorElement>, label: string) => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ to, isExpanded, hasSubItems, isSubItemActive, onMouseEnter, onMouseLeave, onClick, title, children }) => (
  <NavLink
    to={to}
    title={!isExpanded ? title : undefined}
    onMouseEnter={!isExpanded && onMouseEnter ? (e) => onMouseEnter(e, title) : undefined}
    onMouseLeave={!isExpanded && onMouseLeave ? onMouseLeave : undefined}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
        isActive || isSubItemActive
          ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30'
      } ${!isExpanded ? 'justify-center' : ''}`
    }
  >
    {children}
    {hasSubItems && isExpanded && (
      <m.span
        initial={{ rotate: 0 }}
        animate={{ rotate: isSubItemActive ? 180 : 0 }}
        className="ml-auto transition-transform duration-200"
      >
        <ChevronDown className="w-4 h-4" />
      </m.span>
    )}
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
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isEffectivelyOpen = sidebarState === 'hover-expanded' || sidebarState === 'pinned-expanded';

  useEffect(() => {
    onWidthChange(isEffectivelyOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH);
  }, [isEffectivelyOpen, onWidthChange]);

  // Smoother hover transitions with reduced delays
  const handleMouseEnterSidebar = useCallback(() => {
    clearTimeout(timeoutRef.current);
    if (sidebarState === 'collapsed') {
      setSidebarState('hover-expanded');
    }
  }, [sidebarState]);

  const handleMouseLeaveSidebar = useCallback(() => {
    if (sidebarState === 'hover-expanded') {
      timeoutRef.current = setTimeout(() => {
        setSidebarState('collapsed');
        setActiveTooltip(null);
        setActiveSubMenu(null);
      }, 200); // Reduced from 300ms for quicker response
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
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    closeUserDropdown();
    
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
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

  const toggleSubMenu = (label: string) => {
    setActiveSubMenu(activeSubMenu === label ? null : label);
  };
  
  const authControls = (isSidebarCollapsed: boolean) => {
    if (user) {
      if (isSidebarCollapsed) {
        return (
          <div className="relative w-full" ref={userDropdownRef}>
            <m.button 
              onClick={toggleUserDropdown} 
              className="w-full p-2 aspect-square flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700/30 text-gray-700 dark:text-gray-300 transition-all duration-300 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="User menu"
              title="User menu"
            >
              <UserCircleIcon className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
            </m.button>
            <AnimatePresence>
              {isUserDropdownOpen && (
                <m.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-full ml-2 bottom-0 mb-0 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl py-2 ring-1 ring-black/10 dark:ring-white/10 z-50 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button-collapsed"
                >
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.email.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link 
                      to="/dashboard" 
                      onClick={closeUserDropdown} 
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors duration-200 group"
                      role="menuitem"
                    >
                      <DashboardIcon className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                      <span>My Dashboard</span>
                    </Link>
                    <Link 
                      to="/creator-dashboard" 
                      onClick={closeUserDropdown} 
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors duration-200 group"
                      role="menuitem"
                    >
                      <YoutubeIcon className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                      <span>Creator Dashboard</span>
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      disabled={isLoggingOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                      role="menuitem"
                    >
                      <LogoutIcon className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" /> 
                      <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                    </button>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        );
      } else {
        return (
          <div className="space-y-2 w-full">
            <m.div
              whileHover={{ x: 2 }}
              transition={{ type: 'tween', duration: 0.2 }}
            >
              <Link
                to="/dashboard"
                className="w-full text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/30 text-gray-700 dark:text-gray-300 transition-all duration-200 px-4 py-2.5 flex items-center group"
                aria-label="My Profile"
                onClick={closeUserDropdown}
              >
                <UserCircleIcon className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                <span className="flex-shrink-0">My Profile</span>
              </Link>
            </m.div>
            <m.div
              whileHover={{ x: 2 }}
              transition={{ type: 'tween', duration: 0.2 }}
            >
              <Link
                to="/creator-dashboard"
                className="w-full text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/30 text-gray-700 dark:text-gray-300 transition-all duration-200 px-4 py-2.5 flex items-center group"
                aria-label="Creator Dashboard"
                onClick={closeUserDropdown}
              >
                <YoutubeIcon className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                <span className="flex-shrink-0">Creator Dashboard</span>
              </Link>
            </m.div>
            <m.div
              whileHover={{ x: 2 }}
              transition={{ type: 'tween', duration: 0.2 }}
            >
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/30 text-gray-700 dark:text-gray-300 transition-all duration-200 px-4 py-2.5 flex items-center group disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Logout"
              >
                <LogoutIcon className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                <span className="flex-shrink-0">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            </m.div>
          </div>
        );
      }
    }
    return (
      <m.button
        onClick={openAuthModal}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          w-full text-sm rounded-lg border border-brand-primary text-brand-primary 
          hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500 hover:text-white 
          hover:shadow-lg transition-all duration-300
          ${isEffectivelyOpen 
            ? 'px-4 py-2.5 flex items-center' 
            : 'p-2 aspect-square flex items-center justify-center' 
          } 
        `}
        title="Login / Register"
      >
        {isEffectivelyOpen ? (
          <>
            <UserCircleIcon className="w-5 h-5 mr-3" />
            <span className="flex-shrink-0">Login</span>
          </>
        ) : (
          <UserCircleIcon className="w-5 h-5" />
        )}
      </m.button>
    );
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.aside
        ref={sidebarRef}
        onMouseEnter={handleMouseEnterSidebar}
        onMouseLeave={handleMouseLeaveSidebar}
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 ease-out flex flex-col py-6 z-40 border-r border-gray-200 dark:border-gray-700`}
        initial={{ width: COLLAPSED_WIDTH }}
        animate={{ width: isEffectivelyOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH }}
        transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }} // Smoother tween transition
        aria-label="Main navigation sidebar"
      >
        {/* TechXNinjas Branding */}
        <div className={`flex items-center mb-8 ${isEffectivelyOpen ? 'px-6 justify-start' : 'px-0 justify-center'}`}>
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
              TX
            </div>
            {isEffectivelyOpen && (
              <m.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500"
              >
                TechXNinjas
              </m.span>
            )}
          </Link>
        </div>

        <nav className={`flex-grow space-y-2 ${isEffectivelyOpen ? 'px-4' : 'px-2'}`}>
          {navLinks.map((link) => {
            const IconComponent = link.icon;
            const isSubItemActive = activeSubMenu === link.label;
            
            return (
              <div key={link.to} className="relative">
                <SidebarNavItem
                  to={link.to}
                  isExpanded={isEffectivelyOpen}
                  hasSubItems={!!link.subItems}
                  isSubItemActive={isSubItemActive}
                  onMouseEnter={handleIconMouseEnter}
                  onMouseLeave={handleIconMouseLeave}
                  title={link.label}
                  onClick={link.subItems ? () => toggleSubMenu(link.label) : undefined}
                >
                  <IconComponent className="w-5 h-5" />
                  {isEffectivelyOpen && (
                    <m.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="ml-3"
                    >
                      {link.label}
                    </m.span>
                  )}
                </SidebarNavItem>

                {link.subItems && isEffectivelyOpen && isSubItemActive && (
                  <m.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }} // Smoother submenu transition
                    className="ml-4 mt-1 space-y-1 overflow-hidden"
                  >
                    {link.subItems.map((subItem) => (
                      <NavLink
                        key={subItem}
                        to={`${link.to}/${subItem.toLowerCase()}`}
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                            isActive
                              ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30'
                          }`
                        }
                      >
                        {subItem}
                      </NavLink>
                    ))}
                  </m.div>
                )}
              </div>
            );
          })}
        </nav>

        <div className={`mt-auto pt-6 border-t border-gray-200 dark:border-gray-700 ${isEffectivelyOpen ? 'px-4' : 'px-2'}`}>
          <div className={`flex ${isEffectivelyOpen ? 'justify-between items-center' : 'flex-col space-y-3 items-center'} mb-4 w-full`}>
            <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ThemeToggle />
            </m.div>
            <m.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/30 text-gray-600 dark:text-gray-300 transition-all duration-300 group relative"
              aria-label="Notifications"
            >
              <BellIcon className="w-5 h-5 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              {isEffectivelyOpen && <span className="sr-only">Notifications</span>}
            </m.button>
          </div>
          <div className={`${isEffectivelyOpen ? '' : 'flex flex-col items-center'}`}>
            {authControls(!isEffectivelyOpen)}
          </div>
        </div>
        
        <m.button
          onClick={handleTogglePin}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-brand-primary dark:text-white p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 z-50 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={sidebarState === 'pinned-expanded' ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarState === 'pinned-expanded' ? (
            <PanelLeftCloseIcon className="w-5 h-5" />
          ) : (
            <PanelRightOpenIcon className="w-5 h-5" />
          )}
        </m.button>
      </m.aside>

      <AnimatePresence>
        {activeTooltip && (
          <m.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="fixed bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl pointer-events-none z-[60] backdrop-blur-sm transition-opacity"
            style={{ 
              top: activeTooltip.top, 
              left: activeTooltip.left,
            }}
            role="tooltip"
          >
            {activeTooltip.text}
            <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
};

export default Sidebar;