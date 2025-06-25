import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface AnimatedCounterProps {
  end: number | string;
  duration?: number;
  delay?: number;
  suffix?: string;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 2000,
  delay = 0,
  suffix = '',
  className = ''
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<number>(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Parse the end value to handle strings like "10+" or "15,000+"
  const parseEndValue = (): number => {
    if (typeof end === 'number') return end;
    
    // Remove any non-numeric characters except for commas
    const numericString = end.toString().replace(/[^0-9,]/g, '');
    // Remove commas
    const withoutCommas = numericString.replace(/,/g, '');
    return parseInt(withoutCommas, 10);
  };

  const endValue = parseEndValue();
  const hasSuffix = typeof end === 'string' && end.includes('+');

  useEffect(() => {
    if (!inView) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) {
        startTimestamp = timestamp + delay;
      }

      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      if (progress < 0) {
        requestAnimationFrame(step);
        return;
      }

      // Easing function for smoother animation
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const nextCount = Math.floor(easedProgress * endValue);
      
      if (nextCount !== countRef.current) {
        countRef.current = nextCount;
        setCount(nextCount);
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    const animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [inView, endValue, duration, delay]);

  // Format the number with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <span ref={ref} className={className}>
      {formatNumber(count)}{hasSuffix ? '+' : ''}{suffix}
    </span>
  );
};

export default AnimatedCounter;