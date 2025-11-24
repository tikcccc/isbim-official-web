'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

/**
 * InnerOverlayRunner - Page transition animation core component
 *
 * Animation Flow:
 * 1. Initial: x=0% (overlay covers screen)
 * 2. Animate: x=200vw (slide right) -> transitionEnd teleport to x=-200vw (hidden left)
 * 3. Exit: x=0% (slide back from left to cover)
 *
 * This approach creates a unidirectional looping brush effect, avoiding the rewind feeling
 */
export const InnerOverlayRunner = () => {
    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">

            {/* 1. Giant Parallelogram Brush */}
            <motion.div
                className="absolute top-0 bottom-0 h-full"
                style={{
                    width: '150vw',
                    left: '-25vw',
                }}
                initial={{ x: "0%" }}
                animate={{
                    x: "200vw",
                    transitionEnd: {
                        x: "-200vw" // After animation, silently reset to left side
                    }
                }}
                exit={{ x: "0%" }}
                transition={{
                    duration: 1,
                    ease: [0.22, 1, 0.36, 1]
                }}
            >
                <div
                    className="w-full h-full bg-[#767676]"
                    style={{
                        transform: 'skewX(-20deg)',
                        transformOrigin: 'bottom left'
                    }}
                />
            </motion.div>

            {/* 2. Logo with Shimmer Effect */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center z-[10000]"
                initial={{ opacity: 1 }}
                animate={{
                    opacity: 0,
                    transition: {
                        delay: 0.7,
                        duration: 0.3,
                    }
                }}
                exit={{
                    opacity: 1,
                    transition: {
                        duration: 0.2,
                    }
                }}
            >
                <div className="relative w-48 h-32">
                    {/* Background Layer - Black Logo (底層，半透明灰階) */}
                    <div className="absolute inset-0 opacity-30 grayscale">
                        <Image
                            src="/icons/isbim_black.svg"
                            alt="isBIM"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Foreground Layer - White Logo with Shimmer Mask */}
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            maskImage: 'linear-gradient(110deg, transparent 30%, black 45%, black 55%, transparent 70%)',
                            WebkitMaskImage: 'linear-gradient(110deg, transparent 30%, black 45%, black 55%, transparent 70%)',
                            maskSize: '250% 100%',
                            WebkitMaskSize: '250% 100%',
                        }}
                        animate={{
                            maskPosition: ['-120% 0', '220% 0'],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'linear',
                            repeatDelay: 0.5,
                        }}
                    >
                        <Image
                            src="/icons/isbim_white.svg"
                            alt="isBIM"
                            fill
                            className="object-contain drop-shadow-sm"
                            priority
                        />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

/**
 * PageTransition - Main page transition wrapper component
 * Compatible with Next.js App Router template.tsx
 *
 * Usage in template.tsx:
 * ```tsx
 * import { PageTransition } from "@/components/layout/page-transition";
 *
 * export default function Template({ children }) {
 *   return <PageTransition>{children}</PageTransition>;
 * }
 * ```
 */
interface PageTransitionProps {
    children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
    return (
        <AnimatePresence mode="wait">
            <div className="relative w-full min-h-screen">
                {/* Page content fade in/out */}
                <motion.div
                    className="min-h-screen w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        delay: 0.2,
                        duration: 0.5
                    }}
                >
                    {children}
                </motion.div>

                {/* Transition overlay */}
                <InnerOverlayRunner />
            </div>
        </AnimatePresence>
    );
};

/**
 * PageWrapper - Alternative page wrapper for custom usage
 * Use this if you need more control over the transition behavior
 */
interface PageWrapperProps {
    children: React.ReactNode;
    className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = '' }) => {
    return (
        <div className="relative w-full min-h-screen">
            <motion.div
                className={`min-h-screen w-full ${className}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                    delay: 0.2,
                    duration: 0.5
                }}
            >
                {children}
            </motion.div>

            <InnerOverlayRunner />
        </div>
    );
};

export default PageTransition;
