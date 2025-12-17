"use client";

import { LocalizedLink } from "@/components/ui/localized-link";
import { ROUTES } from "@/lib/constants";
import styles from "./cta-section.module.css";

export function CtaSection() {
  return (
    <section className={styles.section}>
      {/* Grid Background */}
      <div className={styles.gridBg} />

      {/* Top Gradient Line */}
      <div className={styles.topLine} />

      <div className={styles.container}>
        <span className={styles.status}>System Status: Ready</span>

        <h2 className={styles.heading}>
          See JARVIS <br />
          <span className={styles.headingItalic}>in action.</span>
        </h2>

        <div className={styles.buttonWrapper}>
          <LocalizedLink
            href={ROUTES.CONTACT}
            prefetchMode="hover"
            className={styles.ctaButton}
          >
            <div className={styles.buttonGradient} />
            <span className={styles.buttonText}>
              Request Live Demo
              <span className={styles.pulsingDot} />
            </span>
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
}
