import React, { useState, useEffect, useRef } from 'react';

interface EventDetailHeaderProps {
  sections: {
    id: string;
    label: string;
  }[];
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}

const EventDetailHeader: React.FC<EventDetailHeaderProps> = ({ 
  sections, 
  activeSection, 
  onSectionClick 
}) => {
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Show header after scrolling past the title area (100px)
      setIsSticky(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={headerRef}
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        isSticky 
          ? 'top-0 opacity-100 transform translate-y-0' 
          : 'top-0 opacity-0 transform -translate-y-full pointer-events-none'
      }`}
    >
      <div className="bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-80 backdrop-blur-md shadow-md py-2 sm:py-3">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-3 sm:space-x-6 overflow-x-auto hide-scrollbar">
            {sections.map((section) => (
              <button 
                key={section.id}
                onClick={() => onSectionClick(section.id)}
                className={`section-nav-item whitespace-nowrap px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium ${
                  activeSection === section.id 
                    ? 'text-brand-primary active' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default EventDetailHeader;