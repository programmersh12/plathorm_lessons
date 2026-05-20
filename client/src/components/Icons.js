import React from 'react';

const IconBase = ({ children, size = 20, stroke = 1.9, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

// Beautiful logo icon with enhanced gradient
export const LogoIcon = ({ size = 26, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="vykodLogoGradient" x1="4" y1="3" x2="24" y2="25" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7e22ce" />
        <stop offset="0.55" stopColor="#4f46e5" />
        <stop offset="1" stopColor="#0ea5e9" />
      </linearGradient>
      <linearGradient id="vykodLogoInner" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a78bfa" />
        <stop offset="1" stopColor="#60a5fa" />
      </linearGradient>
    </defs>
    <rect x="2.5" y="2.5" width="23" height="23" rx="8" fill="url(#vykodLogoGradient)" />
    <rect x="4" y="4" width="20" height="20" rx="6" fill="url(#vykodLogoInner)" opacity="0.3" />
    <path
      d="M8.5 9.5L13.7 18.6L19.5 9.5M13.9 18.2L19.5 9.5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Beautiful home icon with modern design
export const HomeIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <path d="M3 11.5L12 4L21 11.5" strokeWidth="2" />
    <path d="M5.5 10.5V20H18.5V10.5" strokeWidth="2" />
    <path d="M10 20V14.5H14V20" strokeWidth="2" />
    <path d="M12 14.5L12 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </IconBase>
);

// Beautiful dashboard icon with modern design
export const DashboardIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <rect x="3" y="3" width="8" height="8" rx="2" fill="none" strokeWidth="2" />
    <rect x="13" y="3" width="8" height="5" rx="2" fill="none" strokeWidth="2" />
    <rect x="13" y="10" width="8" height="11" rx="2" fill="none" strokeWidth="2" />
    <rect x="3" y="13" width="8" height="8" rx="2" fill="none" strokeWidth="2" />
    <circle cx="7" cy="7" r="1.5" fill="currentColor" />
    <circle cx="17" cy="5.5" r="1" fill="currentColor" />
    <circle cx="17" cy="15.5" r="1" fill="currentColor" />
  </IconBase>
);

// Beautiful book open icon with modern design
export const BookOpenIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <path d="M12 7C10.5 5.8 8.3 5 6 5C4.3 5 3 6.3 3 8V19C3 17.3 4.3 16 6 16C8.3 16 10.5 16.8 12 18" strokeWidth="2" />
    <path d="M12 7C13.5 5.8 15.7 5 18 5C19.7 5 21 6.3 21 8V19C21 17.3 19.7 16 18 16C15.7 16 13.5 16.8 12 18" strokeWidth="2" />
    <path d="M6 10H6.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M18 10H18.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </IconBase>
);

// Beautiful user icon with modern design
export const UserIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <circle cx="12" cy="8" r="4" strokeWidth="2" />
    <path d="M4 20C4.8 16.8 7.6 14.5 12 14.5C16.4 14.5 19.2 16.8 20 20" strokeWidth="2" />
    <circle cx="12" cy="8" r="2" fill="currentColor" />
  </IconBase>
);

// Beautiful login icon with modern design
export const LogInIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <path d="M14 4H19V20H14" strokeWidth="2" />
    <path d="M11 8L6 12L11 16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 12H17" strokeWidth="2" strokeLinecap="round" />
  </IconBase>
);

// Beautiful user plus icon with modern design
export const UserPlusIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <circle cx="10" cy="8" r="4" strokeWidth="2" />
    <path d="M2.8 20C3.6 16.9 6.2 14.8 10 14.8C13.8 14.8 16.4 16.9 17.2 20" strokeWidth="2" />
    <path d="M19 8V14" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 11H22" strokeWidth="2" strokeLinecap="round" />
  </IconBase>
);

// Beautiful logout icon with modern design
export const LogoutIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <path d="M10 4H5V20H10" strokeWidth="2" />
    <path d="M14 8L19 12L14 16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 12H19" strokeWidth="2" strokeLinecap="round" />
  </IconBase>
);

// Beautiful globe icon with modern design
export const GlobeIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <circle cx="12" cy="12" r="9" strokeWidth="2" />
    <path d="M3 12H21" strokeWidth="2" />
    <path d="M12 3C14.5 5.5 16 8.6 16 12C16 15.4 14.5 18.5 12 21" strokeWidth="2" />
    <path d="M12 3C9.5 5.5 8 8.6 8 12C8 15.4 9.5 18.5 12 21" strokeWidth="2" />
    <path d="M3 16L21 8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 8L21 16" stroke="currentColor" strokeWidth="1.5" />
  </IconBase>
);

// Beautiful sparkles icon with modern design
export const SparklesIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <path d="M12 3L13.5 7.5L18 9L13.5 10.5L12 15L10.5 10.5L6 9L10.5 7.5L12 3Z" strokeWidth="2" />
    <path d="M19 14L19.8 16.2L22 17L19.8 17.8L19 20L18.2 17.8L16 17L18.2 16.2L19 14Z" strokeWidth="2" />
    <path d="M5 15L5.6 16.4L7 17L5.6 17.6L5 19L4.4 17.6L3 17L4.4 16.4L5 15Z" strokeWidth="2" />
  </IconBase>
);

// Beautiful clock icon with modern design
export const ClockIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <circle cx="12" cy="12" r="9" strokeWidth="2" />
    <path d="M12 7V12L15.5 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </IconBase>
);

// Beautiful star icon with modern design
export const StarIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <path d="M12 3.5L14.8 9.1L21 10L16.5 14.2L17.6 20.5L12 17.6L6.4 20.5L7.5 14.2L3 10L9.2 9.1L12 3.5Z" strokeWidth="2" fill="none" />
    <path d="M12 6L13.5 9.5L17 10L14 12.5L14.5 16L12 14L9.5 16L10 12.5L7 10L10.5 9.5L12 6Z" fill="currentColor" />
  </IconBase>
);

// Beautiful trophy icon with modern design
export const TrophyIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <path d="M8 4H16V8C16 10.8 14.2 13 12 13C9.8 13 8 10.8 8 8V4Z" strokeWidth="2" />
    <path d="M8 6H5.5C4.7 6 4 6.7 4 7.5C4 9.7 5.8 11.5 8 11.5" strokeWidth="2" />
    <path d="M16 6H18.5C19.3 6 20 6.7 20 7.5C20 9.7 18.2 11.5 16 11.5" strokeWidth="2" />
    <path d="M12 13V17" strokeWidth="2" />
    <path d="M9 20H15" strokeWidth="2" />
    <circle cx="12" cy="18" r="1" fill="currentColor" />
  </IconBase>
);

// Beautiful arrow right icon with modern design
export const ArrowRightIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <path d="M5 12H19" strokeWidth="2" strokeLinecap="round" />
    <path d="M13 6L19 12L13 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </IconBase>
);

// Beautiful arrow left icon with modern design
export const ArrowLeftIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <path d="M19 12H5" strokeWidth="2" strokeLinecap="round" />
    <path d="M11 18L5 12L11 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </IconBase>
);

// Beautiful check circle icon with modern design
export const CheckCircleIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <circle cx="12" cy="12" r="9" strokeWidth="2" />
    <path d="M8 12L11 15L16 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
  </IconBase>
);

// Beautiful lock icon with modern design
export const LockIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <rect x="5" y="11" width="14" height="10" rx="3" strokeWidth="2" />
    <path d="M8 11V8.8C8 6.7 9.8 5 12 5C14.2 5 16 6.7 16 8.8V11" strokeWidth="2" />
    <circle cx="12" cy="16" r="1" fill="currentColor" />
  </IconBase>
);

// Beautiful heart icon with modern design
export const HeartIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <path d="M12 20.2C12 20.2 4.5 15.4 4.5 9.7C4.5 7.4 6.3 5.6 8.6 5.6C10.1 5.6 11.4 6.3 12 7.5C12.6 6.3 13.9 5.6 15.4 5.6C17.7 5.6 19.5 7.4 19.5 9.7C19.5 15.4 12 20.2 12 20.2Z" strokeWidth="2" fill="none" />
    <path d="M12 16L15 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 16L9 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </IconBase>
);

// Beautiful flame icon with modern design
export const FlameIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <path d="M12 3C13.7 6.3 18.5 7.9 18.5 13.1C18.5 16.7 15.6 20 12 20C8.4 20 5.5 16.9 5.5 13.2C5.5 10.2 7.4 7.9 9.2 6C9.4 8.7 11.6 10.1 12.8 10.8C13.2 8 12.6 5.5 12 3Z" strokeWidth="2" fill="none" />
    <circle cx="12" cy="10" r="1.5" fill="currentColor" />
  </IconBase>
);

// Beautiful pencil icon with modern design
export const PencilIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <path d="M4 20H8L18.5 9.5C19.3 8.7 19.3 7.4 18.5 6.6L17.4 5.5C16.6 4.7 15.3 4.7 14.5 5.5L4 16V20Z" strokeWidth="2" fill="none" />
    <path d="M13.5 6.5L17.5 10.5" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 14L14 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </IconBase>
);

// Beautiful mail icon with modern design
export const MailIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <rect x="3" y="5" width="18" height="14" rx="3" strokeWidth="2" fill="none" />
    <path d="M4 7L12 13L20 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 10L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 10L16 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </IconBase>
);

// Beautiful shield icon with modern design
export const ShieldIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <path d="M12 3L19 6V11C19 16 15.8 19.4 12 21C8.2 19.4 5 16 5 11V6L12 3Z" strokeWidth="2" fill="none" />
    <path d="M9 12L11.3 14.3L15.2 10.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </IconBase>
);

// Beautiful new icons added for enhanced design

// Code icon
export const CodeIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <polyline points="16,18 22,12 16,6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="8,6 2,12 8,18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5" />
  </IconBase>
);

// Lightbulb icon
export const LightbulbIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z" strokeWidth="2" fill="none" />
    <path d="M9 21h6v-2H9v2zM12 15v2m-1-2h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </IconBase>
);

// Chart icon
export const ChartIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <line x1="18" y1="20" x2="18" y2="10" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="20" x2="12" y2="4" strokeWidth="2" strokeLinecap="round" />
    <line x1="6" y1="20" x2="6" y2="14" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="8" r="1" fill="currentColor" />
    <circle cx="6" cy="16" r="1" fill="currentColor" />
    <circle cx="18" cy="14" r="1" fill="currentColor" />
  </IconBase>
);

// Settings icon
export const SettingsIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <circle cx="12" cy="12" r="3" strokeWidth="2" fill="none" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" />
  </IconBase>
);

// Download icon
export const DownloadIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" />
    <polyline points="7,10 12,15 17,10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="15" x2="12" y2="3" strokeWidth="2" strokeLinecap="round" />
  </IconBase>
);

// Upload icon
export const UploadIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" />
    <polyline points="17,8 12,3 7,8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="3" x2="12" y2="15" strokeWidth="2" strokeLinecap="round" />
  </IconBase>
);

// Search icon
export const SearchIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <circle cx="11" cy="11" r="8" strokeWidth="2" fill="none" />
    <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
    <circle cx="11" cy="11" r="2" fill="currentColor" />
  </IconBase>
);

// Bell icon
export const BellIcon = ({ size, className }) => (
  <IconBase size={size} className={className}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" strokeWidth="2" fill="none" />
    <circle cx="12" cy="10" r="1" fill="currentColor" />
  </IconBase>
);
