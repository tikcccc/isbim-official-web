"use client";

import React, { useRef, useLayoutEffect } from "react";
import { m } from "@/components/motion/lazy-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as messages from "@/paraglide/messages";
import Image from "next/image";
import { ROUTES } from "@/lib/constants";
import { LocalizedLink } from "@/components/ui/localized-link";

interface Section5CTAProps {
  imageUrl?: string;
  imageAlt?: string;
}

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Section5CTA({ imageUrl, imageAlt }: Section5CTAProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      tl.from(imageRef.current, {
        x: -80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });

      tl.from(
        [titleRef.current, subtitleRef.current, buttonRef.current],
        {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        },
        "-=0.8"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full bg-zinc-50 text-slate-900 section-padding flex flex-col"
    >
      <div className="container-content">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-1 items-center">
          <div
            ref={imageRef}
            className="relative aspect-[4/3] w-full max-w-[520px] sm:max-w-[560px] lg:max-w-[600px] xl:max-w-[640px] overflow-hidden rounded-lg shadow-2xl bg-zinc-200 md:ml-auto lg:-translate-x-25"
          >
            <Image
              src={imageUrl ?? "/images/cta.png"}
              alt={imageAlt ?? "Modern business technology and collaboration"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent" />
          </div>

          <div
            ref={textWrapperRef}
            className="flex flex-col items-center text-center justify-center md:px-6 lg:px-8"
          >
            <h2
              ref={titleRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-wide text-slate-900 leading-[1.1] text-balance mb-6"
            >
              {messages.section5_cta_title()}
            </h2>

            <p
              ref={subtitleRef}
              className="text-lg sm:text-xl lg:text-xl leading-relaxed font-normal text-gray-600 max-w-lg text-pretty mx-auto"
            >
              {messages.section5_cta_subtitle()}
            </p>

            <div ref={buttonRef} className="pt-10">
              <m.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  asChild
                  variant="outline"
                  className="border-slate-300 text-slate-900 hover:bg-slate-900 hover:text-white h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg transition-all duration-300 rounded-lg uppercase tracking-wider"
                >
                  <LocalizedLink href={ROUTES.CONTACT} prefetchMode="hover">
                    {messages.section5_cta_button()}
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </LocalizedLink>
                </Button>
              </m.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

