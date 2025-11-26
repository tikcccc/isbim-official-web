"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { m } from "@/components/motion/lazy-motion";
import { ArrowRight } from "lucide-react";
import * as messages from "@/paraglide/messages";
import { JARVIS_VIDEOS } from "@/lib/media-config";

// Platform data structure
interface PlatformItem {
  id: string;
  titleKey: keyof typeof platformTitles;
  descKey: keyof typeof platformDescs;
  version: string;
  videoUrl: string;
}

// Map keys to message functions
const platformTitles = {
  agent: () => messages.section4_agent_title(),
  pay: () => messages.section4_pay_title(),
  air: () => messages.section4_air_title(),
  eagleeye: () => messages.section4_eagleeye_title(),
  ssss: () => messages.section4_ssss_title(),
  dwss: () => messages.section4_dwss_title(),
  cdcp: () => messages.section4_cdcp_title(),
  assets: () => messages.section4_assets_title(),
};

const platformDescs = {
  agent: () => messages.section4_agent_desc(),
  pay: () => messages.section4_pay_desc(),
  air: () => messages.section4_air_desc(),
  eagleeye: () => messages.section4_eagleeye_desc(),
  ssss: () => messages.section4_ssss_desc(),
  dwss: () => messages.section4_dwss_desc(),
  cdcp: () => messages.section4_cdcp_desc(),
  assets: () => messages.section4_assets_desc(),
};

const platforms: PlatformItem[] = [
  {
    id: "01",
    titleKey: "agent",
    descKey: "agent",
    version: "/0.1",
    videoUrl: JARVIS_VIDEOS.agent,
  },
  {
    id: "02",
    titleKey: "pay",
    descKey: "pay",
    version: "/0.2",
    videoUrl: JARVIS_VIDEOS.pay,
  },
  {
    id: "03",
    titleKey: "air",
    descKey: "air",
    version: "/0.3",
    videoUrl: JARVIS_VIDEOS.air,
  },
  {
    id: "04",
    titleKey: "eagleeye",
    descKey: "eagleeye",
    version: "/0.4",
    videoUrl: JARVIS_VIDEOS.eagleEye,
  },
  {
    id: "05",
    titleKey: "ssss",
    descKey: "ssss",
    version: "/0.5",
    videoUrl: JARVIS_VIDEOS.ssss,
  },
  {
    id: "06",
    titleKey: "dwss",
    descKey: "dwss",
    version: "/0.6",
    videoUrl: JARVIS_VIDEOS.dwss,
  },
  {
    id: "07",
    titleKey: "cdcp",
    descKey: "cdcp",
    version: "/0.7",
    videoUrl: JARVIS_VIDEOS.cdcp,
  },
  {
    id: "08",
    titleKey: "assets",
    descKey: "assets",
    version: "/0.8",
    videoUrl: JARVIS_VIDEOS.assets,
  },
];

// Hook: Detect network quality for adaptive preloading
function useConnectionQuality() {
  const [quality, setQuality] = useState<"slow" | "fast">("fast");

  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { effectiveType?: string } };
    const conn = nav.connection;
    if (conn?.effectiveType) {
      const slowTypes = ["slow-2g", "2g", "3g"];
      setQuality(slowTypes.includes(conn.effectiveType) ? "slow" : "fast");
    }
  }, []);

  return quality;
}

// Hook: Smart video preloader with progressive loading
function useSmartVideoPreloader(
  videoRefs: React.RefObject<(HTMLVideoElement | null)[]>,
  isInViewport: boolean
) {
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(new Set());
  const connectionQuality = useConnectionQuality();

  const preloadVideo = useCallback((index: number) => {
    if (loadedIndices.has(index)) return;

    const video = videoRefs.current[index];
    if (!video) return;

    video.preload = 'auto';
    video.load();
    setLoadedIndices(prev => new Set(prev).add(index));
  }, [loadedIndices, videoRefs]);

  const preloadRange = useCallback((startIndex: number, count: number) => {
    for (let i = 0; i < count; i++) {
      const index = startIndex + i;
      if (index < platforms.length) {
        preloadVideo(index);
      }
    }
  }, [preloadVideo]);

  // Phase 1: Preload first 2 videos when section enters viewport
  useEffect(() => {
    if (!isInViewport || connectionQuality === 'slow') return;

    const timer = setTimeout(() => {
      preloadRange(0, 2);
    }, 100);

    return () => clearTimeout(timer);
  }, [isInViewport, connectionQuality, preloadRange]);

  // Phase 3: Idle preloading - load remaining videos after 3s
  useEffect(() => {
    if (!isInViewport || connectionQuality === 'slow') return;

    const idleTimer = setTimeout(() => {
      for (let i = 2; i < platforms.length; i++) {
        if (!loadedIndices.has(i)) {
          preloadVideo(i);
        }
      }
    }, 3000);

    return () => clearTimeout(idleTimer);
  }, [isInViewport, connectionQuality, loadedIndices, preloadVideo]);

  return { preloadVideo, preloadRange, loadedIndices };
}

export function Section4PlatformList() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isInViewport, setIsInViewport] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const { preloadRange } = useSmartVideoPreloader(videoRefs, isInViewport);

  // IntersectionObserver: Track viewport visibility
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Phase 2: Smart hover handler with progressive preload
  const handleHover = useCallback((index: number) => {
    setHoveredIndex(index);

    if (!isInViewport) return;

    // Play current video
    const video = videoRefs.current[index];
    if (video) {
      video.play().catch(() => {});
    }

    // Preload next 2 videos
    preloadRange(index + 1, 2);
  }, [isInViewport, preloadRange]);

  const handleLeave = useCallback(() => {
    if (hoveredIndex !== null) {
      const video = videoRefs.current[hoveredIndex];
      if (video) {
        video.pause();
      }
    }
    setHoveredIndex(null);
  }, [hoveredIndex]);

  // Mobile tap: toggle the active row
  const handleTap = useCallback(
    (index: number) => {
      if (hoveredIndex === index) {
        handleLeave();
      } else {
        handleHover(index);
      }
    },
    [hoveredIndex, handleHover, handleLeave]
  );

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white text-slate-900 section-padding flex flex-col gap-8"
    >
      <div className="container-content-wide">
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-medium mb-12 sm:mb-16 tracking-tight">
          {messages.section4_title()}
        </h2>

        <div className="flex flex-col">
          {platforms.map((item, index) => (
            <PlatformRow
              key={item.id}
              item={item}
              index={index}
              isHovered={hoveredIndex === index}
              isInViewport={isInViewport}
              videoRef={(el) => (videoRefs.current[index] = el)}
              onHover={() => handleHover(index)}
              onLeave={handleLeave}
              onTap={() => handleTap(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PlatformRow({
  item,
  isHovered,
  isInViewport,
  videoRef,
  onHover,
  onLeave,
  onTap
}: {
  item: PlatformItem;
  index: number;
  isHovered: boolean;
  isInViewport: boolean;
  videoRef: (el: HTMLVideoElement | null) => void;
  onHover: () => void;
  onLeave: () => void;
  onTap: () => void;
}) {
  const handleMouseEnter = () => {
    if (isInViewport) {
      onHover();
    }
  };

  return (
    <div
      className="relative border-t border-gray-200 py-6 sm:py-10 group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeave}
      onClick={onTap}
    >
      {/* Grid Layout: Left (Text) - Middle (Video) - Right (Title) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

        {/* 1. Left Section: Description Text */}
        <div className="lg:col-span-3 flex flex-col justify-between relative min-h-[200px] gap-4">
          <div className="z-10 pointer-events-none">
            <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed font-light text-gray-600">
              {platformDescs[item.descKey]()}
            </p>
          </div>
          <span className="text-sm sm:text-base text-gray-400 font-mono block mt-auto">
            {item.version}
          </span>
        </div>

        {/* 2. Middle Section: Video Container */}
        <div className="lg:col-span-4 relative flex items-center justify-center">
          {/* Single video element with opacity transition */}
          <m.div
            animate={{
              opacity: isHovered && isInViewport ? 1 : 0,
              scale: isHovered && isInViewport ? 1 : 0.95
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full flex items-center justify-center z-20"
            style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
          >
            <div className="overflow-hidden rounded-lg shadow-2xl bg-black aspect-video w-full max-w-[420px] sm:max-w-[600px] lg:max-w-[420px]">
              <video
                ref={videoRef}
                src={item.videoUrl}
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover opacity-90"
              />
            </div>
          </m.div>
        </div>

        {/* 3. Right Section: Large Title (with shift animation) */}
        <div className="lg:col-span-5 flex items-center justify-start relative min-h-[220px] lg:min-h-[240px]">
          <div className="w-full lg:pl-8 overflow-visible">
            <m.h3
              animate={{ x: isHovered ? 20 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="text-3xl sm:text-5xl lg:text-6xl xl:text-[88px] leading-[1.2] font-medium tracking-tighter text-slate-900 whitespace-nowrap will-change-transform"
            >
              {platformTitles[item.titleKey]()}
            </m.h3>
          </div>

          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? -10 : -20 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 will-change-transform"
          >
             <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
          </m.div>
        </div>

      </div>
    </div>
  );
}
