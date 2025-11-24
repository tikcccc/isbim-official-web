"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Platform data structure
interface PlatformItem {
  id: string;
  title: string;
  description: string;
  version: string;
  videoUrl: string;
}

const platforms: PlatformItem[] = [
  {
    id: "01",
    title: "JARVIS Agent",
    description: "Domain-specific generative AI agent for every construction stakeholder. Automates invoice scanning, tender parsing & scoring, and form-filling via email agent.",
    version: "/0.1",
    videoUrl: "/videos/Agent.mp4",
  },
  {
    id: "02",
    title: "JARVIS Pay",
    description: "Digital twin for 60-day SOPL-compliant certification. Enables better working-capital rates via investor visibility.",
    version: "/0.2",
    videoUrl: "/videos/pay.mp4",
  },
  {
    id: "03",
    title: "JARVIS Air",
    description: "Stable-diffusion generative design with 500K+ templates. Instant visuals, video walkthroughs, and scenario prototyping.",
    version: "/0.3",
    videoUrl: "/videos/Air.mp4",
  },
  {
    id: "04",
    title: "JARVIS Eagle Eye",
    description: "Real-time digital twin with IoT & 360° capture. Remote monitoring, anomaly detection, compliance assurance.",
    version: "/0.4",
    videoUrl: "/videos/Eagle Eye.mp4",
  },
  {
    id: "05",
    title: "JARVIS SSSS",
    description: "Smart Site Safety System—wearables, AI cameras, instant alerts. Reduces incidents through proactive risk orchestration.",
    version: "/0.5",
    videoUrl: "/videos/4S.mp4",
  },
  {
    id: "06",
    title: "JARVIS DWSS",
    description: "Digital Works Supervision portal—secure submission, automated checks, audit trails for faster approvals.",
    version: "/0.6",
    videoUrl: "/videos/dwss.mp4",
  },
  {
    id: "07",
    title: "JARVIS CDCP",
    description: "Common Data Collaboration Platform—interoperable BIM hub for version control and conflict resolution.",
    version: "/0.7",
    videoUrl: "/videos/CDCP.mp4",
  },
  {
    id: "08",
    title: "JARVIS Assets",
    description: "Digital twin + AI FM for predictive maintenance, ESG tracking, and lifecycle optimization.",
    version: "/0.8",
    videoUrl: "/videos/Assets.mp4",
  },
];

export function Section4PlatformList() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="w-full min-h-screen bg-white text-slate-900 py-12 sm:py-20 flex flex-col justify-center">
      <div className="mx-auto w-full" style={{ width: "90vw", maxWidth: "1800px" }}>
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-medium mb-12 sm:mb-16 tracking-tight">
          Our AI Platforms
        </h2>

        <div className="flex flex-col">
          {platforms.map((item) => (
            <PlatformRow
              key={item.id}
              item={item}
              isHovered={hoveredId === item.id}
              onHover={(id) => setHoveredId(id)}
              onLeave={() => setHoveredId(null)}
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
  onHover,
  onLeave
}: {
  item: PlatformItem;
  isHovered: boolean;
  onHover: (id: string) => void;
  onLeave: () => void;
}) {
  return (
    <div
      className="relative border-t border-gray-200 py-8 sm:py-12 group cursor-pointer"
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={onLeave}
    >
      {/* Grid Layout: Left (Text) - Middle (Video) - Right (Title) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

        {/* 1. Left Section: Description Text */}
        <div className="lg:col-span-3 flex flex-col justify-between relative min-h-[200px]">
          <div className="z-10 pointer-events-none">
            <p className="text-xl sm:text-2xl lg:text-2xl leading-relaxed font-light text-gray-600">
              {item.description}
            </p>
          </div>
          <span className="text-base sm:text-lg text-gray-400 font-mono block mt-auto">
            {item.version}
          </span>
        </div>

        {/* 2. Middle Section: Video Container (only visible on hover) */}
        <div className="lg:col-span-4 relative flex items-center justify-center">
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute inset-0 z-20 flex items-center justify-center"
              >
                <div
                  className="overflow-hidden rounded-lg shadow-2xl bg-black"
                  style={{ aspectRatio: "16/9", width: "75%" }}
                >
                  <video
                    src={item.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. Right Section: Large Title (with shift animation) */}
        <div className="lg:col-span-5 flex items-center justify-start relative min-h-[200px]">
          <div className="w-full lg:pl-8 overflow-visible">
            <motion.h3
              animate={{ x: isHovered ? 20 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-[100px] leading-none font-medium tracking-tighter text-slate-900 whitespace-nowrap"
            >
              {item.title}
            </motion.h3>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? -10 : -20 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 top-1/2 -translate-y-1/2"
          >
             <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
          </motion.div>
        </div>

      </div>
    </div>
  );
}
