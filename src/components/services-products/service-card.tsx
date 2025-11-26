"use client";

/**
 * ServiceCard Component
 *
 * Individual service card with:
 * - Background image (grayscale → color on hover)
 * - Corner brackets animation
 * - Icon, title, descriptions
 * - Expandable detail section with CTA
 */

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SpotlightCard } from "./spotlight-card";
import { CornerBrackets } from "./corner-brackets";
import type { ServiceData } from "@/data/services";

interface ServiceCardProps {
  item: ServiceData;
  index: number;
}

export function ServiceCard({ item, index }: ServiceCardProps) {
  const Icon = item.icon;
  const displayIndex = (index + 1).toString().padStart(2, "0");

  return (
    <SpotlightCard className={`${item.gridArea} ${item.height}`}>
      {/* Background Image */}
      <Image
        src={item.image}
        alt={item.title}
        fill
        className="absolute inset-0 object-cover transition-transform duration-1000 ease-out group-hover:scale-105 grayscale brightness-[0.4] group-hover:brightness-[0.6] group-hover:grayscale-0"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 transition-opacity duration-500" />

      {/* Corner Brackets */}
      <CornerBrackets />

      {/* Header Section */}
      <div className="absolute top-0 left-0 p-6 z-20 flex items-center gap-3 w-full justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-white/40 tracking-widest">
            {displayIndex} /
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/90 bg-emerald-950/30 px-2 py-1 backdrop-blur-md rounded border border-emerald-500/20">
            {item.type}
          </span>
        </div>
        <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      {/* Content Section */}
      <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex flex-col items-start">
        {/* Icon + Title */}
        <div className="flex items-center gap-4 mb-2 transform transition-transform duration-500 group-hover:-translate-y-2">
          <div className="p-2 border border-white/10 rounded-lg backdrop-blur-md bg-white/5 text-emerald-400">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-none group-hover:text-emerald-50 transition-colors">
            {item.title}
          </h3>
        </div>

        {/* Header Description */}
        <p className="text-sm md:text-base text-gray-400 font-light max-w-lg mb-2 group-hover:text-gray-200 transition-colors duration-300 line-clamp-2 group-hover:line-clamp-none">
          {item.headerDescription}
        </p>

        {/* Expandable Detail Section */}
        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
          <div className="overflow-hidden">
            <div className="pt-4 border-l border-emerald-500/30 pl-4 mt-2">
              <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-prose">
                {item.description}
              </p>
              <a
                href="#"
                className="group/btn inline-flex items-center text-xs font-bold text-white uppercase tracking-widest hover:text-emerald-400 transition-colors"
              >
                <span className="border-b border-transparent group-hover/btn:border-emerald-400 pb-0.5">
                  {item.ctaText}
                </span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
