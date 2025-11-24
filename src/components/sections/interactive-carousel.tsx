"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";

// --- 常數定義 ---
const AUTOPLAY_DURATION = 5000; // 5 seconds per slide

// --- 數據結構 ---
interface SlideData {
  id: number;
  category: string;
  tabTitle: string;
  title: string;
  bigText: string;
  meta: string[];
  description: string;
  imageUrl: string;
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    category: "JARVIS AGENT",
    tabTitle: "JARVIS Agent",
    title: "Domain-specific AI for Construction Stakeholders",
    bigText: "Agent",
    meta: ["AI Assistant", "Invoice Scanning", "Tender Parsing"],
    description: "Automates invoice scanning, tender parsing & scoring, and form-filling via email agent.",
    imageUrl: "/videos/Agent.mp4",
  },
  {
    id: 2,
    category: "JARVIS PAY",
    tabTitle: "JARVIS Pay",
    title: "Digital Twin for Payment Certification",
    bigText: "Pay",
    meta: ["SOPL Compliant", "Working Capital", "Investor Visibility"],
    description: "60-day SOPL-compliant certification enabling better working-capital rates.",
    imageUrl: "/videos/pay.mp4",
  },
  {
    id: 3,
    category: "JARVIS AIR",
    tabTitle: "JARVIS Air",
    title: "Generative Design with 500K+ Templates",
    bigText: "Air",
    meta: ["Stable Diffusion", "Video Walkthroughs", "Prototyping"],
    description: "Instant visuals, video walkthroughs, and scenario prototyping powered by AI.",
    imageUrl: "/videos/Air.mp4",
  },
  {
    id: 4,
    category: "JARVIS EAGLE EYE",
    tabTitle: "Eagle Eye",
    title: "Real-time Digital Twin with IoT Integration",
    bigText: "Eagle Eye",
    meta: ["IoT Sensors", "360° Capture", "Anomaly Detection"],
    description: "Remote monitoring, anomaly detection, and compliance assurance in real-time.",
    imageUrl: "/videos/Eagle Eye.mp4",
  },
  {
    id: 5,
    category: "JARVIS SSSS",
    tabTitle: "JARVIS SSSS",
    title: "Smart Site Safety System",
    bigText: "4S",
    meta: ["Wearables", "AI Cameras", "Instant Alerts"],
    description: "Reduces incidents through proactive risk orchestration and real-time monitoring.",
    imageUrl: "/videos/4S.mp4",
  },
  {
    id: 6,
    category: "JARVIS DWSS",
    tabTitle: "JARVIS DWSS",
    title: "Digital Works Supervision System",
    bigText: "DWSS",
    meta: ["Secure Submission", "Automated Checks", "Audit Trails"],
    description: "Digital Works Supervision portal with secure submission and automated checks for faster approvals.",
    imageUrl: "/videos/dwss.mp4",
  },
  {
    id: 7,
    category: "JARVIS CDCP",
    tabTitle: "JARVIS CDCP",
    title: "Common Data Collaboration Platform",
    bigText: "CDCP",
    meta: ["Interoperable BIM", "Version Control", "Conflict Resolution"],
    description: "Interoperable BIM hub for version control and conflict resolution.",
    imageUrl: "/videos/CDCP.mp4",
  },
  {
    id: 8,
    category: "JARVIS ASSETS",
    tabTitle: "JARVIS Assets",
    title: "Digital Twin + AI Facility Management",
    bigText: "Assets",
    meta: ["Predictive Maintenance", "ESG Tracking", "Lifecycle Optimization"],
    description: "AI-powered facility management for predictive maintenance and sustainability.",
    imageUrl: "/videos/Assets.mp4",
  },
];

// --- 卡片動畫狀態 ---
const cardVariants = {
  center: {
    x: "0%",
    scale: 1,
    zIndex: 10,
    opacity: 1,
    filter: "brightness(1)",
    transition: { duration: 0.6, type: "spring" as const, stiffness: 80, damping: 20 },
  },
  left: {
    x: "-105%",
    scale: 1,
    zIndex: 5,
    opacity: 0.6,
    filter: "brightness(0.4)",
    transition: { duration: 0.6, type: "spring" as const, stiffness: 80, damping: 20 },
  },
  right: {
    x: "105%",
    scale: 1,
    zIndex: 5,
    opacity: 0.6,
    filter: "brightness(0.4)",
    transition: { duration: 0.6, type: "spring" as const, stiffness: 80, damping: 20 },
  },
  hidden: {
    x: "0%",
    scale: 0.8,
    zIndex: 0,
    opacity: 0,
    transition: { duration: 0.5 },
  },
};

export function InteractiveCarousel() {
  const [page, setPage] = useState(0);
  const [hovered, setHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Velocity-based parallax animation using GSAP
  useEffect(() => {
    if (!sectionRef.current) return;

    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let ticking = false;

    const updateParallax = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      // Calculate velocity with reduced sensitivity for subtle effect
      scrollVelocity = delta * 0.5;
      lastScrollY = currentScrollY;

      if (sectionRef.current) {
        // Inverse parallax effect with smaller displacement
        const targetY = -scrollVelocity * 3;

        gsap.to(sectionRef.current, {
          y: targetY,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => {
            // Smooth return to original position with bounce
            if (sectionRef.current) {
              gsap.to(sectionRef.current, {
                y: 0,
                duration: 1.0,
                ease: "elastic.out(1, 0.6)",
              });
            }
          },
        });
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (hovered) return;
    const timer = setInterval(() => {
      setPage((prev) => prev + 1);
    }, AUTOPLAY_DURATION);
    return () => clearInterval(timer);
  }, [page, hovered]);

  const nextSlide = () => setPage(page + 1);
  const prevSlide = () => setPage(page - 1);
  const jumpToSlide = (index: number) => setPage(index);

  const getVariant = (index: number) => {
    const total = SLIDES.length;
    const activeIndex = (page % total + total) % total;
    if (index === activeIndex) return "center";
    const prevIndex = (activeIndex - 1 + total) % total;
    if (index === prevIndex) return "left";
    const nextIndex = (activeIndex + 1) % total;
    if (index === nextIndex) return "right";
    return "hidden";
  };

  const activeIndex = (page % SLIDES.length + SLIDES.length) % SLIDES.length;

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-zinc-100 overflow-hidden flex flex-col items-center py-12 sm:py-20"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* --- 導航區域 (Tabs + See All) --- */}
      <div className="relative z-30 w-full max-w-[90%] md:max-w-[85%] flex flex-col md:flex-row gap-4 mb-8 sm:mb-12 items-stretch md:items-center">
        {/* Tabs 容器：Grid 佈局自動均分寬度 */}
        <div className="flex-1 grid grid-cols-4 md:grid-cols-8 gap-2">
          {SLIDES.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => jumpToSlide(index)}
                className={cn(
                  "relative overflow-hidden h-9 md:h-10 flex items-center justify-center text-[9px] md:text-[10px] uppercase tracking-wider border transition-all duration-300",
                  "w-full bg-white border-zinc-300 text-zinc-600",
                  isActive
                    ? "border-zinc-900 text-zinc-900"
                    : "hover:bg-zinc-50 hover:text-zinc-900"
                )}
              >
                {/* 進度填充層 */}
                {isActive && !hovered && (
                  <motion.div
                    key={`progress-${page}`}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: AUTOPLAY_DURATION / 1000,
                      ease: "linear",
                    }}
                    className="absolute inset-0 bg-zinc-900/20 z-0"
                    style={{ transformOrigin: "left" }}
                  />
                )}

                {/* 文字層 */}
                <span className="relative z-10 font-medium truncate px-2">
                  {slide.tabTitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* See All 按鈕 */}
        <div className="hidden md:block w-auto shrink-0">
          <button type="button" className="h-12 px-6 text-xs font-bold bg-zinc-900 text-white hover:bg-zinc-800 transition-colors uppercase tracking-wider border border-zinc-900">
            See All
          </button>
        </div>
        <div className="md:hidden w-full">
          <button type="button" className="w-full h-10 text-xs font-bold bg-zinc-900 text-white hover:bg-zinc-800 transition-colors uppercase tracking-wider">
            See All
          </button>
        </div>
      </div>

      {/* Slider Track */}
      <div
        className="relative w-full max-w-[90%] md:max-w-[85%] flex-grow flex items-center justify-center"
      >
        {SLIDES.map((slide, index) => {
          const variant = getVariant(index);
          const isCenter = variant === "center";

          return (
            <motion.div
              key={slide.id}
              variants={cardVariants}
              initial="hidden"
              animate={variant}
              className="absolute w-full h-full bg-zinc-950 border border-white/10 shadow-2xl overflow-hidden"
              style={{ minHeight: "600px", maxHeight: "700px" }}
            >
              {/* Background Video/Image */}
              <div className="absolute inset-0 z-0">
                {slide.imageUrl.endsWith(".mp4") ? (
                  <video
                    src={slide.imageUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-80 mix-blend-overlay"
                  />
                ) : (
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover opacity-80 mix-blend-overlay"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 w-full h-full p-8 md:p-12 flex flex-col justify-between text-white">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <span className="text-xs font-bold tracking-[0.15em] uppercase text-white/70">
                      {slide.category}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-light leading-tight tracking-tight mb-6">
                    {slide.title}
                    <ArrowUpRight className="inline-block ml-2 w-6 h-6 md:w-8 md:h-8 opacity-50" />
                  </h2>
                </div>

                {/* Bottom Section */}
                <div className="relative">
                  <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row items-end justify-between gap-8">
                    <h1 className="text-[12vw] md:text-[7rem] font-medium leading-[0.8] tracking-tighter text-white select-none">
                      {slide.bigText}
                    </h1>

                    <div className="hidden md:block max-w-xs text-[10px] leading-relaxed text-white/60 uppercase tracking-wider mb-4">
                      <div className="flex gap-4 mb-2 text-white">
                        <span>Built on:</span>
                        <div className="flex flex-col">
                          {slide.meta.map((m) => (
                            <span key={m}>→ {m}</span>
                          ))}
                        </div>
                      </div>
                      <p>{slide.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows (只在中心卡片 hover 時顯示) */}
              <div
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-0 z-20 pointer-events-none transition-opacity duration-300",
                  isCenter && hovered ? "opacity-100" : "opacity-0"
                )}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                  className="pointer-events-auto w-16 h-16 bg-zinc-900/90 hover:bg-zinc-800 flex items-center justify-center transition-colors text-white border-r border-y border-white/10"
                  aria-label="Previous slide"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  className="pointer-events-auto w-16 h-16 bg-zinc-900/90 hover:bg-zinc-800 flex items-center justify-center transition-colors text-white border-l border-y border-white/10"
                  aria-label="Next slide"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Slide Indicators (Dots) */}
      <div className="mt-8 flex justify-center gap-3 z-30">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => jumpToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              activeIndex === index
                ? "w-12 bg-zinc-900"
                : "w-2 bg-zinc-400 hover:bg-zinc-600"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
