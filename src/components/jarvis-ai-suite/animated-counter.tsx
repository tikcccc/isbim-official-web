'use client';

import { useEffect, useRef } from 'react';
import { m } from '@/components/motion/lazy-motion';
import { useInView, useSpring, useTransform } from 'framer-motion';

/**
 * AnimatedCounter Component
 * Animates numbers from 0 to target value when in view
 * Supports percentages and different number formats
 */

interface AnimatedCounterProps {
  value: string;
  label: string;
  className?: string;
  glow?: boolean;
}

export function AnimatedCounter({ value, label, className = '', glow = false }: AnimatedCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Parse the value
  const isPercentage = value.includes('%');
  const isDays = value.toLowerCase().includes('day');
  const isZero = value.toLowerCase() === 'zero';

  // Extract numeric value
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;

  // Spring animation for smooth counting with slower, more visible animation
  const count = useSpring(0, {
    stiffness: 50,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (isInView) {
      count.set(numericValue);
    }
  }, [isInView, numericValue, count]);

  // Transform based on value type
  const display = useTransform(count, (latest) => {
    if (isZero) return 'Zero';
    if (isPercentage) return `${latest.toFixed(1)}%`;
    if (isDays) return `${Math.round(latest)}-Day`;
    return Math.round(latest).toString();
  });

  return (
    <div ref={ref} className="flex flex-col items-center group cursor-default">
      <m.span
        className={`text-3xl md:text-5xl font-bold transition-transform group-hover:scale-110 duration-500 ${
          glow ? 'text-emerald-400 text-glow' : 'text-white'
        } ${className}`}
      >
        {isInView ? display : isZero ? 'Zero' : '0'}
      </m.span>
      <span className="text-xs font-mono text-gray-500 tracking-widest mt-2 uppercase">
        {label}
      </span>
    </div>
  );
}
