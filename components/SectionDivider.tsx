import React from 'react';

interface SectionDividerProps {
  className?: string;
  fillColor?: string;
  style?: 'wave' | 'curve' | 'angle';
  flip?: boolean;
}

const SectionDivider: React.FC<SectionDividerProps> = ({ 
  className = '', 
  fillColor = 'currentColor',
  style = 'wave',
  flip = false
}) => {
  const getPath = () => {
    switch (style) {
      case 'curve':
        return "M0,32L48,37.3C96,43,192,53,288,48C384,43,480,21,576,16C672,11,768,21,864,26.7C960,32,1056,32,1152,32C1248,32,1344,32,1392,32L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z";
      case 'angle':
        return "M0,0L1440,32L1440,0Z";
      default: // wave
        return "M0,32L60,42.7C120,53,240,75,360,85.3C480,96,600,96,720,80C840,64,960,32,1080,26.7C1200,21,1320,43,1380,53.3L1440,64L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z";
    }
  };

  return (
    <div className={`absolute bottom-0 left-0 right-0 ${flip ? 'transform rotate-180' : ''} ${className}`}>
      <svg 
        viewBox="0 0 1440 64" 
        className="w-full h-8 md:h-12 lg:h-16"
        preserveAspectRatio="none"
      >
        <path 
          d={getPath()}
          fill={fillColor}
          className="drop-shadow-sm"
        />
      </svg>
    </div>
  );
};

export default SectionDivider;
