"use client";

import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import './ScrollReveal.css';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'zoom-in';
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  animation = 'fade-up', 
  delay = 0, 
  duration = 600,
  className = '',
  once = true
}) => {
  const [ref, isVisible] = useScrollReveal({ triggerOnce: once });

  const style = {
    transitionDelay: `${delay}ms`,
    transitionDuration: `${duration}ms`,
  };

  return (
    <div
      ref={ref}
      className={`reveal reveal-${animation} ${isVisible ? 'visible' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
