import React, { ReactNode, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface RevealOnScrollProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
}

const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 800,
  distance = 50,
  once = true,
  className = '',
}) => {
  const [forceVisible, setForceVisible] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: once,
    threshold: 0.1,
    rootMargin: '50px 0px',
    fallbackInView: true,
  });

  // Fallback to ensure elements become visible after a timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setForceVisible(true);
    }, delay + 2000); // Show after delay + 2 seconds

    return () => clearTimeout(timer);
  }, [delay]);

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return `translateY(${distance}px)`;
      case 'down':
        return `translateY(-${distance}px)`;
      case 'left':
        return `translateX(${distance}px)`;
      case 'right':
        return `translateX(-${distance}px)`;
      default:
        return `translateY(${distance}px)`;
    }
  };

  const isVisible = inView || forceVisible;

  const animationStyles = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate3d(0, 0, 0)' : getTransform(),
    transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
    transitionDelay: `${delay}ms`,
  };

  return (
    <div
      ref={ref}
      style={animationStyles}
      className={className}
    >
      {children}
    </div>
  );
};

export default RevealOnScroll;