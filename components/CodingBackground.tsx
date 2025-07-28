import React, { useEffect, useRef } from 'react';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { Theme } from '../types';

interface CodingBackgroundProps {
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  style?: 'matrix' | 'terminal' | 'code' | 'binary';
}

const CodingBackground: React.FC<CodingBackgroundProps> = ({ 
  className = '', 
  intensity = 'medium',
  style = 'matrix'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const { theme } = useContext(ThemeContext) || { theme: Theme.LIGHT };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation parameters based on intensity
    const getIntensityConfig = () => {
      switch (intensity) {
        case 'low':
          return { dropCount: 30, speed: 0.5, opacity: 0.4 };
        case 'high':
          return { dropCount: 100, speed: 2, opacity: 0.9 };
        default:
          return { dropCount: 60, speed: 1, opacity: 0.6 };
      }
    };

    const config = getIntensityConfig();

    // Enhanced color schemes for better visibility in both themes
    const getColorScheme = () => {
      if (theme === Theme.DARK) {
        switch (style) {
          case 'matrix':
            return {
              primary: '#00FF41', // Brighter green for better visibility
              secondary: '#008F11',
              tertiary: '#00AA00',
              background: 'rgba(0, 0, 0, 0.05)' // Slightly more opaque
            };
          case 'terminal':
            return {
              primary: '#00FFFF',
              secondary: '#0088AA',
              tertiary: '#00AAAA',
              background: 'rgba(0, 0, 0, 0.05)'
            };
          case 'code':
            return {
              primary: '#9933FF',
              secondary: '#6600CC',
              tertiary: '#7722DD',
              background: 'rgba(0, 0, 0, 0.05)'
            };
          case 'binary':
            return {
              primary: '#0066CC',
              secondary: '#004499',
              tertiary: '#0055BB',
              background: 'rgba(0, 0, 0, 0.05)'
            };
          default:
            return {
              primary: '#00FF41',
              secondary: '#008F11',
              tertiary: '#00AA00',
              background: 'rgba(0, 0, 0, 0.05)'
            };
        }
      } else {
        // Light theme - more visible colors with higher contrast
        switch (style) {
          case 'matrix':
            return {
              primary: '#0A7E36', // Darker green for light background
              secondary: '#0C5E2C',
              tertiary: '#0E8F44',
              background: 'rgba(255, 255, 255, 0.1)' // More opaque for better visibility
            };
          case 'terminal':
            return {
              primary: '#007D9C',
              secondary: '#005E7A',
              tertiary: '#008FBB',
              background: 'rgba(255, 255, 255, 0.1)'
            };
          case 'code':
            return {
              primary: '#5A1E8F',
              secondary: '#4A0C7A',
              tertiary: '#6A22AA',
              background: 'rgba(255, 255, 255, 0.1)'
            };
          case 'binary':
            return {
              primary: '#C54500',
              secondary: '#A53500',
              tertiary: '#E05500',
              background: 'rgba(255, 255, 255, 0.1)'
            };
          default:
            return {
              primary: '#0A7E36',
              secondary: '#0C5E2C',
              tertiary: '#0E8F44',
              background: 'rgba(255, 255, 255, 0.1)'
            };
        }
      }
    };

    const colors = getColorScheme();

    // Character sets for different styles - UPDATED to use only English characters
    const getCharacterSet = () => {
      switch (style) {
        case 'matrix':
          return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,./<>?';
        case 'terminal':
          return '$ > ~ # % & * + = | \\ / ? ! @ ^ _ - . , ; : " \' ` [ ] { } ( ) < > 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        case 'code':
          return '{}[]();,.<>=+-*/%&|^~!?:@#$_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        case 'binary':
          return '01';
        default:
          return '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      }
    };

    const characters = getCharacterSet();
    const fontSize = style === 'binary' ? 12 : 14;
    const columns = Math.floor(canvas.width / fontSize);

    // Initialize drops
    const drops: number[] = [];
    const dropSpeeds: number[] = [];
    const dropOpacities: number[] = [];
    const dropColors: string[] = [];

    // Adjust opacity based on theme for better visibility
    const themeOpacityMultiplier = theme === Theme.DARK ? 1 : 1.3;

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * canvas.height;
      dropSpeeds[i] = (Math.random() * config.speed + 0.5) * fontSize;
      dropOpacities[i] = Math.random() * config.opacity * themeOpacityMultiplier + 0.3;
      
      // Assign random colors from the color scheme
      const colorOptions = [colors.primary, colors.secondary, colors.tertiary];
      dropColors[i] = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    }

    // Animation function
    const animate = () => {
      // Create fade effect with more visible background
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'Courier New', monospace`;

      for (let i = 0; i < columns; i++) {
        // Skip some columns based on intensity
        if (Math.random() > config.dropCount / 100) continue;

        const text = characters[Math.floor(Math.random() * characters.length)];
        const x = i * fontSize;
        const y = drops[i];

        // Set color with enhanced opacity
        ctx.fillStyle = dropColors[i];
        ctx.globalAlpha = dropOpacities[i];
        
        // Add glow effect for better visibility
        ctx.shadowColor = dropColors[i];
        ctx.shadowBlur = theme === Theme.DARK ? 3 : 2;

        ctx.fillText(text, x, y);

        // Reset drop if it goes off screen
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          dropSpeeds[i] = (Math.random() * config.speed + 0.5) * fontSize;
          dropOpacities[i] = Math.random() * config.opacity * themeOpacityMultiplier + 0.3;
          
          // Reassign color
          const colorOptions = [colors.primary, colors.secondary, colors.tertiary];
          dropColors[i] = colorOptions[Math.floor(Math.random() * colorOptions.length)];
        }

        // Move drop down
        drops[i] += dropSpeeds[i];
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [theme, intensity, style]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: theme === Theme.DARK ? 0.9 : 0.7 // Adjusted for better visibility
      }}
    />
  );
};

export default CodingBackground;