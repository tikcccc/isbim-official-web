'use client';

import { TypewriterText } from '@/components/animations/typewriter';
import styles from './hero-section.module.css';

const TYPEWRITER_TEXT = 'Automate invoices, tenders, and forms.';

export function HeroSection() {
  return (
    <section className={styles.hero}>
      {/* Background layer */}
      <div className={styles.background} aria-hidden="true">
        {/* 背景圖片 - 帶緩慢縮放動畫 */}
        <div className={styles.backgroundImage} />
        {/* 層 1：基礎暗化漸變 */}
        <div className={styles.backgroundOverlay} />
        {/* 層 2：徑向暈影聚焦 */}
        <div className={styles.backgroundVignette} />
        {/* 層 3：光暈呼吸效果 */}
        <div className={styles.lightPulse} />
        {/* 層 4：掃描線效果 */}
        <div className={styles.scanLine} />
        {/* 層 5：微粒浮動效果 */}
        <div className={styles.particles} />
      </div>

      {/* Decoration Lines */}
      <div className={styles.decorLineRight} />
      <div className={styles.decorLineBottom} />

      {/* Main Content */}
      <div className={styles.container}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>
            JARVIS<br />
            <span className={styles.gradientText}>AI Suite</span>
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
                  cursorColor="#ffffff"
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
