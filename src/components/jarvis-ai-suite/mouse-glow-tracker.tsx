'use client';

import { useEffect, useState } from 'react';

/**
 * MouseGlowTracker Component
 * Tracks mouse position and renders a smooth following glow effect
 * Optimized with CSS custom properties for performance
 */
export function MouseGlowTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(16, 185, 129, 0.08), transparent 80%)`
      }}
    />
  );
}
