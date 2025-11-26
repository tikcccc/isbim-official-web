"use client";

/**
 * CTA Section Component
 *
 * Final call-to-action section with:
 * - Local grid background with gradient overlay
 * - Large question heading
 * - White capsule button with hover states
 */

import { m } from "@/components/motion/lazy-motion";
import * as messages from "@/paraglide/messages";

export function CtaSection() {
  return (
    <section className="py-32 relative z-10 mt-20">
      {/* Local Grid Pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "linear-gradient(to bottom, transparent, black 20%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%)",
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-0 pointer-events-none" />

      {/* Content */}
      <div className="container mx-auto px-6 text-center relative z-10">
        <m.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-10 text-white">
            {messages.services_products_cta_title ? messages.services_products_cta_title() : "Ready to build the future?"}
          </h2>
          <button className="bg-white text-black px-12 py-5 text-sm uppercase tracking-widest font-bold hover:bg-transparent hover:text-white hover:ring-1 hover:ring-white transition-all duration-300 rounded-full">
            {messages.services_products_cta_button ? messages.services_products_cta_button() : "Transform Your Project"}
          </button>
        </m.div>
      </div>
    </section>
  );
}
