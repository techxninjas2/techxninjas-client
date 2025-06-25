import React, { ReactNode } from 'react';
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
  const { ref, inView } = useInView({
    triggerOnce: once,
    threshold: 0.1,
  });

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

  const animationStyles = {
    opacity: inView ? 1 : 0,
    transform: inView ? 'translate3d(0, 0, 0)' : getTransform(),
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