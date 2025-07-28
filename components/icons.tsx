
import React from 'react';
// Keep existing Lucide imports from Sidebar/Header
import {
  LogOut as LogoutIconLucide,
  LayoutDashboard as DashboardIconLucide,
  Home as HomeIconLucide,
  CalendarDays as CalendarDaysIconLucide,
  FileText as FileTextIconLucide,
  Gift as GiftIconLucide,
  PanelLeftClose as PanelLeftCloseIconLucide,
  PanelRightOpen as PanelRightOpenIconLucide,
  Settings as SettingsIconLucide, 
  GraduationCap as GraduationCapIconLucide, 
  UserCircle as UserCircleIconLucide, // Renamed to avoid conflict
  Edit3 as Edit3IconLucide,
  Save as SaveIconLucide,
  XCircle as XCircleIconLucide,
  PlusCircle as PlusCircleIconLucide,
  Trash2 as Trash2IconLucide,
  AlertTriangle as AlertTriangleIconLucide,
  Info as InfoIconLucide,
  Briefcase as BriefcaseIconLucide,
  Target as TargetIconLucide,
  MapPin as MapPinIconLucide,
  Award as AwardIconLucide,
  Image as ImageIconLucide, // Added for banner
  Building as BuildingIconLucide, // Added for college/org
  Users as UsersIconLucide // Added for followers/connections
} from 'lucide-react';


interface IconProps {
  className?: string;
  size?: number; // Lucide icons accept size prop
}

// Re-export Lucide icons for consistency or use them directly in components
const LogoutIcon: React.FC<IconProps> = (props) => <LogoutIconLucide {...props} />;
const DashboardIcon: React.FC<IconProps> = (props) => <DashboardIconLucide {...props} />;
const HomeIcon: React.FC<IconProps> = (props) => <HomeIconLucide {...props} />;
const CalendarDaysIcon: React.FC<IconProps> = (props) => <CalendarDaysIconLucide {...props} />;
const FileTextIcon: React.FC<IconProps> = (props) => <FileTextIconLucide {...props} />;
const GiftIcon: React.FC<IconProps> = (props) => <GiftIconLucide {...props} />;
const PanelLeftCloseIcon: React.FC<IconProps> = (props) => <PanelLeftCloseIconLucide {...props} />;
const PanelRightOpenIcon: React.FC<IconProps> = (props) => <PanelRightOpenIconLucide {...props} />;
const SettingsIcon: React.FC<IconProps> = (props) => <SettingsIconLucide {...props} />;
const GraduationCap: React.FC<IconProps> = (props) => <GraduationCapIconLucide {...props} />; // Corrected export name

// UserProfilePage specific icons (can also be imported directly from lucide-react in the component)
const Edit3Icon: React.FC<IconProps> = (props) => <Edit3IconLucide {...props} />;
const SaveIcon: React.FC<IconProps> = (props) => <SaveIconLucide {...props} />;
const XCircleIcon: React.FC<IconProps> = (props) => <XCircleIconLucide {...props} />;
const PlusCircleIcon: React.FC<IconProps> = (props) => <PlusCircleIconLucide {...props} />;
const Trash2Icon: React.FC<IconProps> = (props) => <Trash2IconLucide {...props} />;
const AlertTriangleIcon: React.FC<IconProps> = (props) => <AlertTriangleIconLucide {...props} />;
const InfoIcon: React.FC<IconProps> = (props) => <InfoIconLucide {...props} />;
const Briefcase: React.FC<IconProps> = (props) => <BriefcaseIconLucide {...props} />; // Corrected export name
const Target: React.FC<IconProps> = (props) => <TargetIconLucide {...props} />; // Corrected export name
const MapPin: React.FC<IconProps> = (props) => <MapPinIconLucide {...props} />; // Corrected export name
const Award: React.FC<IconProps> = (props) => <AwardIconLucide {...props} />; // Corrected export name
const ImageIcon: React.FC<IconProps> = (props) => <ImageIconLucide {...props} />;
const Building: React.FC<IconProps> = (props) => <BuildingIconLucide {...props} />;
const Users: React.FC<IconProps> = (props) => <UsersIconLucide {...props} />;


// Existing custom icons
const MenuIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const SunIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export const MoonIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const BellIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

// Using Lucide's UserCircle directly in components is often easier
const UserIcon: React.FC<IconProps> = ({ className }) => ( // Kept for any existing direct usage.
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
// This specific named UserCircleIcon will use the Lucide one.
const UserCircle: React.FC<IconProps> = (props) => <UserCircleIconLucide {...props} />; // Corrected export name


const ExternalLinkIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className, size }) => ( // Added size prop
    <svg className={className} width={size} height={size} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6.343 6.343l2.829 2.829m11.313-2.829l-2.829 2.829M12 21v-4M21 12h-4m-2.829-2.829l-2.829-2.829M12 2v4M3 12h4m2.829 2.829l2.829 2.829m6.343-11.313l-2.829 2.829M12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
);

export const ArrowUpIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
);

export const ArrowLeftIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);


export const WhatsAppIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.35 3.43 16.84L2 22L7.32 20.59C8.75 21.33 10.36 21.73 12.04 21.73C17.5 21.73 21.95 17.28 21.95 11.82C21.95 6.36 17.5 2 12.04 2ZM12.04 20.03C10.56 20.03 9.15 19.67 7.92 19L7.54 18.78L4.31 19.63L5.18 16.49L4.94 16.08C4.19 14.78 3.83 13.29 3.83 11.82C3.83 7.37 7.54 3.7 12.04 3.7C16.54 3.7 20.25 7.37 20.25 11.82C20.25 16.27 16.54 20.03 12.04 20.03ZM17.27 14.22C17.02 14.1 15.95 13.57 15.72 13.49C15.49 13.41 15.32 13.36 15.15 13.61C14.98 13.86 14.49 14.44 14.34 14.61C14.2 14.78 14.05 14.81 13.81 14.7C13.56 14.59 12.76 14.31 11.79 13.44C11.04 12.75 10.53 11.91 10.38 11.66C10.24 11.41 10.33 11.27 10.45 11.16C10.56 11.04 10.71 10.85 10.83 10.7C10.95 10.56 11 10.43 11.08 10.26C11.16 10.09 11.11 9.95 11.05 9.84C10.98 9.72 10.57 8.65 10.39 8.21C10.22 7.77 10.04 7.82 9.91 7.81C9.79 7.81 9.63 7.8 9.46 7.8C9.29 7.8 9.04 7.85 8.83 8.1C8.62 8.35 8.13 8.81 8.13 9.79C8.13 10.77 8.86 11.7 8.98 11.85C9.1 12 10.55 14.17 12.63 15C14.47 15.73 14.72 15.65 15.15 15.61C15.57 15.57 16.48 15.03 16.68 14.42C16.88 13.81 16.88 13.31 16.81 13.19C16.74 13.07 16.59 13.02 16.39 12.91C16.19 12.8 17.52 14.34 17.27 14.22Z" />
  </svg>
);


const ChevronLeftIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);


// Generic placeholder icon
const PlaceholderIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /> {/* Example: a simple plus sign */}
  </svg>
);

export const GoogleIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.84 0-5.22-1.94-6.08-4.53H2.15v2.84C3.97 20.98 7.72 23 12 23z" fill="#34A853"/>
    <path d="M5.92 14.41c-.25-.66-.39-1.36-.39-2.09s.14-1.43.39-2.09V7.49H2.15C1.45 8.99.96 10.66.96 12.43s.49 3.44 1.19 4.93l3.78-2.95z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.72 1 3.97 3.02 2.15 6.25l3.78 2.95c.87-2.59 3.24-4.52 6.07-4.52z" fill="#EA4335"/>
    <path d="M1 1h22v22H1z" fill="none"/>
  </svg>
);

export const GitHubIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 .296c-6.63 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

export const YoutubeIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const LinkedinIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
  </svg>
);

export const InstagramIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.359 2.618 6.78 6.98 6.98 1.281.059 1.689.073 4.948.073s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export const TelegramIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 2L12.001 7.37L2 12.74L4.855 13.99L6.878 21L9.613 15.24L16.299 9.35L11.758 13.99L22 2Z"/>
    <path d="M11.758 13.99L6.878 21L9.613 15.24L16.299 9.35L11.758 13.99Z" opacity="0.5"/>
  </svg>
);

export const MailIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export const PhoneIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.308 1.154a11.034 11.034 0 005.516 5.516l1.154-2.308a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);