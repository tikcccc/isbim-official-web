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

            {/* 2. Loading Icon - isBIM Logo with bounce effect */}
            <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center z-[10000]"
                initial={{ opacity: 1, scale: 1 }}
                exit={{
                    opacity: 1,
                    scale: 1.2,
                    transition: { duration: 0.2 }
                }}
                animate={{
                    opacity: 0,
                    scale: 0.8,
                    transition: {
                        delay: 0.4,
                        duration: 0.4
                    }
                }}
            >
                <motion.div
                    className="relative flex flex-col items-center justify-center"
                    animate={{
                        filter: [
                            "drop-shadow(0 0 0px rgba(255,255,255,0.8))",
                            "drop-shadow(0 0 20px rgba(255,255,255,0.8))",
                            "drop-shadow(0 0 0px rgba(255,255,255,0.8))"
                        ]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    {/* isBIM Logo - Bounce effect */}
                    <motion.div
                        className="relative w-32 h-32 mb-4"
                        animate={{
                            y: [0, -20, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.5, 1]
                        }}
                    >
                        <Image
                            src="/icons/isbim_black.svg"
                            alt="isBIM Loading"
                            fill
                            className="object-contain invert"
                            priority
                        />
                    </motion.div>

                    {/* Loading text */}
                    <motion.span
                        className="text-[10px] tracking-[0.3em] font-bold text-white drop-shadow-md bg-black/20 px-3 py-1.5 rounded"
                        animate={{
                            opacity: [1, 0.5, 1]
                        }}
                        transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        LOADING
                    </motion.span>
                </motion.div>
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
