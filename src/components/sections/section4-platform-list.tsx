"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import * as m from "@/paraglide/messages";
import { useEffect } from "react";

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
  agent: () => m.section4_agent_title(),
  pay: () => m.section4_pay_title(),
  air: () => m.section4_air_title(),
  eagleeye: () => m.section4_eagleeye_title(),
  ssss: () => m.section4_ssss_title(),
  dwss: () => m.section4_dwss_title(),
  cdcp: () => m.section4_cdcp_title(),
  assets: () => m.section4_assets_title(),
};

const platformDescs = {
  agent: () => m.section4_agent_desc(),
  pay: () => m.section4_pay_desc(),
  air: () => m.section4_air_desc(),
  eagleeye: () => m.section4_eagleeye_desc(),
  ssss: () => m.section4_ssss_desc(),
  dwss: () => m.section4_dwss_desc(),
  cdcp: () => m.section4_cdcp_desc(),
  assets: () => m.section4_assets_desc(),
};

const platforms: PlatformItem[] = [
  {
    id: "01",
    titleKey: "agent",
    descKey: "agent",
    version: "/0.1",
    videoUrl: "/videos/Agent.mp4",
  },
  {
    id: "02",
    titleKey: "pay",
    descKey: "pay",
    version: "/0.2",
    videoUrl: "/videos/pay.mp4",
  },
  {
    id: "03",
    titleKey: "air",
    descKey: "air",
    version: "/0.3",
    videoUrl: "/videos/Air.mp4",
  },
  {
    id: "04",
    titleKey: "eagleeye",
    descKey: "eagleeye",
    version: "/0.4",
    videoUrl: "/videos/Eagle Eye.mp4",
  },
  {
    id: "05",
    titleKey: "ssss",
    descKey: "ssss",
    version: "/0.5",
    videoUrl: "/videos/4S.mp4",
  },
  {
    id: "06",
    titleKey: "dwss",
    descKey: "dwss",
    version: "/0.6",
    videoUrl: "/videos/dwss.mp4",
  },
  {
    id: "07",
    titleKey: "cdcp",
    descKey: "cdcp",
    version: "/0.7",
    videoUrl: "/videos/CDCP.mp4",
  },
  {
    id: "08",
    titleKey: "assets",
    descKey: "assets",
    version: "/0.8",
    videoUrl: "/videos/Assets.mp4",
  },
];

export function Section4PlatformList() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isInViewport, setIsInViewport] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>("");

  // --- 1. IntersectionObserver: 只在進入視窗時允許載入影片 ---
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // --- 2. 單一影片播放器控制 ---
  const handleHover = useCallback((id: string, videoUrl: string) => {
    setHoveredId(id);
    setCurrentVideoUrl(videoUrl);

    if (!isInViewport || !videoRef.current) return;

    // 切換影片來源並播放
    if (videoRef.current.src !== videoUrl) {
      videoRef.current.src = videoUrl;
    }
    videoRef.current.play().catch(() => {
      // 播放失敗靜默處理
    });
  }, [isInViewport]);

  const handleLeave = useCallback(() => {
    setHoveredId(null);
    setCurrentVideoUrl("");
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full min-h-screen bg-white text-slate-900 py-12 sm:py-20 flex flex-col justify-center"
    >
      <div className="container-content-wide">
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-medium mb-12 sm:mb-16 tracking-tight">
          {m.section4_title()}
        </h2>

        <div className="flex flex-col">
          {platforms.map((item) => (
            <PlatformRow
              key={item.id}
              item={item}
              isHovered={hoveredId === item.id}
              isInViewport={isInViewport}
              videoRef={videoRef}
              currentVideoUrl={currentVideoUrl}
              onHover={handleHover}
              onLeave={handleLeave}
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
  currentVideoUrl,
  onHover,
  onLeave
}: {
  item: PlatformItem;
  isHovered: boolean;
  isInViewport: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  currentVideoUrl: string;
  onHover: (id: string, videoUrl: string) => void;
  onLeave: () => void;
}) {
  const handleMouseEnter = () => {
    if (isInViewport) {
      onHover(item.id, item.videoUrl);
    }
  };

  // 當此列被 hover 時，自動播放影片
  useEffect(() => {
    if (isHovered && videoRef.current && isInViewport) {
      videoRef.current.play().catch(() => {
        // 播放失敗靜默處理
      });
    }
  }, [isHovered, videoRef, isInViewport]);

  return (
    <div
      className="relative border-t border-gray-200 py-8 sm:py-12 group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeave}
    >
      {/* Grid Layout: Left (Text) - Middle (Video) - Right (Title) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

        {/* 1. Left Section: Description Text */}
        <div className="lg:col-span-3 flex flex-col justify-between relative min-h-[200px]">
          <div className="z-10 pointer-events-none">
            <p className="text-xl sm:text-2xl lg:text-2xl leading-relaxed font-light text-gray-600">
              {platformDescs[item.descKey]()}
            </p>
          </div>
          <span className="text-base sm:text-lg text-gray-400 font-mono block mt-auto">
            {item.version}
          </span>
        </div>

        {/* 2. Middle Section: Video Container (只在此列被 hover 時顯示影片) */}
        <div className="lg:col-span-4 relative flex items-center justify-center">
          {isHovered && isInViewport && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 z-20 flex items-center justify-center"
            >
              <div
                className="overflow-hidden rounded-lg shadow-2xl bg-black"
                style={{ aspectRatio: "16/9", width: "75%" }}
              >
                <video
                  ref={isHovered ? videoRef : null}
                  src={item.videoUrl}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* 3. Right Section: Large Title (with shift animation) */}
        <div className="lg:col-span-5 flex items-center justify-start relative min-h-[220px] lg:min-h-[240px]">
          <div className="w-full lg:pl-8 overflow-visible">
            <motion.h3
              animate={{ x: isHovered ? 20 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-[88px] leading-[1.2] font-medium tracking-tighter text-slate-900 whitespace-nowrap will-change-transform"
            >
              {platformTitles[item.titleKey]()}
            </motion.h3>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? -10 : -20 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 will-change-transform"
          >
             <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
          </motion.div>
        </div>

      </div>
    </div>
  );
}
