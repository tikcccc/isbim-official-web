'use client';

import { TypewriterText } from '@/components/animations/typewriter';
import styles from './hero-section.module.css';

const TYPEWRITER_TEXT = 'Automate invoices, tenders, and forms.';

export function HeroSection() {
  return (
    <section className={styles.hero}>
      {/* Background layer */}
      <div className={styles.background} aria-hidden>
        <div className={styles.backgroundImage} />
        <div className={styles.backgroundOverlay} />
      </div>

      {/* Decoration Lines */}
      <div className={styles.decorLineRight} />
      <div className={styles.decorLineBottom} />

      {/* Main Content */}
      <div className={styles.container}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>
            JARVIS<br />
            <span className="gradient-text">AI Suite</span>
          </h1>
        </div>

        <div className={styles.grid}>
          {/* Left Column: Typewriter */}
          <div className={styles.typewriterPanel}>
            <div className={styles.inputLabel}>
              <span className={styles.pulsingDot} />
              <span className={styles.labelText}>Input Stream</span>
            </div>
            <div className={styles.typewriterOutput}>
              <p className={styles.typewriterText}>
                &gt;{' '}
                <TypewriterText
                  text={TYPEWRITER_TEXT}
                  speed={35}
                  cursorVisible
                  cursorChar="|"
                  cursorColor="var(--jarvis-accent-primary)"
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
