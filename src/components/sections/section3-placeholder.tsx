"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export function Section3Placeholder() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Sync Lenis with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Set initial visibility
    if (textRef.current) {
      gsap.set(textRef.current, { autoAlpha: 1 });

      // Create the "sparse to dense" animation
      gsap.fromTo(
        textRef.current,
        {
          // FROM: Sparse state
          lineHeight: "1.5",
          opacity: 0.5,
          y: 60,
        },
        {
          // TO: Dense state
          lineHeight: "1.1",
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top 65%",
            end: "center center",
            scrub: 1,
            markers: false,
          },
        }
      );
    }

    // Cleanup
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  return (
    <section className="relative z-10 bg-white py-20 sm:py-15">
      {/* Trigger zone with auto height */}
      <div
        ref={triggerRef}
        className="flex items-center justify-center relative min-h-[40vh]"
      >
        {/* Text content that animates */}
        <h1
          ref={textRef}
          className="text-4xl md:text-7xl font-semibold text-center text-black leading-tight invisible"
          style={{
            width: "90vw",
            maxWidth: "1800px",
            willChange: "line-height, opacity, transform",
          }}
        >
          We catalyze digital transformation across the global construction
          industry—delivering infrastructure that is{" "}
          <span className="text-gray-300">faster,</span>{" "}
          <span className="text-gray-300">cheaper,</span>{" "}
          <span className="text-gray-300">safer, and </span> {" "}
          <span className="text-gray-300">greener.</span>
        </h1>
      </div>
    </section>
  );
}
