"use client";

/**
 * SpotlightCard Component
 *
 * Wrapper component that creates a mouse-following spotlight effect
 * Uses Framer Motion's useMotionValue and useMotionTemplate for GPU-accelerated tracking
 */

import { useMotionTemplate, useMotionValue } from "framer-motion";
import { m } from "@/components/motion/lazy-motion";
import type { ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

export function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`relative group bg-gray-900 overflow-hidden border border-white/10 rounded-xl ${className}`}
      onMouseMove={handleMouseMove}
    >
      <m.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full w-full bg-gray-950/90 rounded-xl">
        {children}
      </div>
    </div>
  );
}
