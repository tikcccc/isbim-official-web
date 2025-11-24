"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as m from "@/paraglide/messages";

gsap.registerPlugin(ScrollTrigger);

export function Section3Placeholder() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
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
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
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
          {m.section3_narrative_prefix()}
          <span className="text-gray-300">{m.section3_narrative_faster()}</span>
          {m.section3_narrative_comma1()}
          <span className="text-gray-300">{m.section3_narrative_cheaper()}</span>
          {m.section3_narrative_comma2()}
          <span className="text-gray-300">{m.section3_narrative_safer()}</span>
          {m.section3_narrative_and()}
          <span className="text-gray-300">{m.section3_narrative_greener()}</span>
          {m.section3_narrative_suffix()}
        </h1>
      </div>
    </section>
  );
}
