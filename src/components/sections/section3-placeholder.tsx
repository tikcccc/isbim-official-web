"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as m from "@/paraglide/messages";

gsap.registerPlugin(ScrollTrigger);

export function Section3Placeholder() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (textRef.current) {
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
              start: "top 75%",
              end: "center center",
              scrub: 1,
              markers: false,
              invalidateOnRefresh: true,
            },
          }
        );
      }
    }, triggerRef);

    // Cleanup using context revert
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative z-10 home-surface-base section-padding">
      {/* Trigger zone with auto height */}
      <div
        ref={triggerRef}
        className="flex items-center justify-center relative min-h-[40vh]"
      >
        {/* Text content that animates */}
        <h1
          ref={textRef}
          className="container-content home-narrative-title text-center"
          style={{
            willChange: "line-height, opacity, transform",
            opacity: 0.5,
            lineHeight: "1.5",
          }}
        >
          {m.section3_narrative_prefix()}
          <span className="home-narrative-title home-text-soft">{m.section3_narrative_faster()}</span>
          <span className="home-narrative-title home-text-soft">{m.section3_narrative_comma1()}</span>
          <span className="home-narrative-title home-text-soft">{m.section3_narrative_cheaper()}</span>
          <span className="home-narrative-title home-text-soft">{m.section3_narrative_comma2()}</span>
          <span className="home-narrative-title home-text-soft">{m.section3_narrative_safer()}</span>
          <span className="home-narrative-title home-text-soft">{m.section3_narrative_and()}</span>
          <span className="home-narrative-title home-text-soft">{m.section3_narrative_greener()}</span>
          <span className="home-narrative-title home-text-soft">{m.section3_narrative_suffix()}</span>
        </h1>
      </div>
    </section>
  );
}
