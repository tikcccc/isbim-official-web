'use client';

import { m } from '@/components/motion/lazy-motion';

/**
 * DataStream Component
 * Animated flowing data lines for tech background effect
 */
export function DataStream() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      {[...Array(5)].map((_, i) => (
        <m.div
          key={i}
          className="absolute h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
          style={{
            top: `${20 + i * 20}%`,
            left: 0,
            right: 0
          }}
          animate={{
            opacity: [0, 1, 0],
            x: ['-100%', '200%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  );
}
