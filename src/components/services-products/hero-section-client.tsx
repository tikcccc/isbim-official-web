"use client";

/**
 * Hero Section Client Component
 *
 * Large title with shimmer effect on "AI Products"
 * Subtitle with left border accent
 * Framer Motion enter animation
 * i18n support
 */

import { m } from "@/components/motion/lazy-motion";
import * as messages from "@/paraglide/messages";

export function HeroSectionClient() {
  return (
    <section className="container mx-auto px-6 pt-32 pb-16 relative z-10">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl"
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-white mb-8 leading-[0.9]">
          {messages.services_products_title_1 ? messages.services_products_title_1() : "Services &"} <br />
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-emerald-400 bg-[length:200%_auto] animate-text-shimmer">
            {messages.services_products_title_2 ? messages.services_products_title_2() : "AI Products"}
          </span>
        </h1>
        <p className="text-xl md:text-2xl leading-relaxed text-gray-400 font-light max-w-2xl border-l-2 border-white/10 pl-6">
          {messages.services_products_subtitle_1 ? messages.services_products_subtitle_1() : "Intelligent infrastructure for the next century."} <br />
          <span className="text-white font-normal">
            {messages.services_products_subtitle_2 ? messages.services_products_subtitle_2() : "Seamless fusion of expertise and AI."}
          </span>
        </p>
      </m.div>
    </section>
  );
}
