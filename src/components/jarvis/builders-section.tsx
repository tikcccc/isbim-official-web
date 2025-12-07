'use client';

import styles from './builders-section.module.css';

const MARQUEE_ITEMS = [
  { text: 'FINANCE', highlight: false },
  { text: 'DESIGN', highlight: true },
  { text: 'TENDERING', highlight: false },
  { text: 'MANAGEMENT', highlight: true },
  { text: 'INSPECTION', highlight: false },
  { text: 'PAYMENT', highlight: true },
  { text: 'FACILITY OPS', highlight: false },
];

export function BuildersSection() {
  return (
    <section className={styles.section}>
      {/* Decoration Lines */}
      <div className={styles.decorLineRight} />
      <div className={styles.decorLineCenter} />

      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Chips */}
            <div className={styles.chips}>
              <div className={styles.chip}>
                <span className={styles.chipDotPurple} />
                isBIM DATASET
              </div>
              <div className={styles.chip}>
                <span className={styles.chipDotCyan} />
                ALIBABA MODELS
              </div>
            </div>

            {/* Main Heading */}
            <h2 className={styles.heading}>
              Designed <br />
              for <span className={styles.headingItalic}>Builders.</span>
            </h2>

            {/* Gradient Bar */}
            <div className={styles.gradientBar} />

            {/* Description */}
            <p className={styles.description}>
              Decades of engineering expertise, distilled into an{' '}
              <span className={styles.highlight}>agentic assistant</span>.
            </p>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            <div className={styles.bodyText}>
              <p className={styles.bodyLead}>
                Powered by isBIM’s proprietary dataset and Alibaba’s frontier models.
              </p>
              <p className={styles.bodyParagraph}>
                Accelerating operations for owners, consultants, contractors, and quantity surveyors.
              </p>
            </div>

            {/* Marquee */}
            <div className={styles.marqueeContainer}>
              <div className={styles.marqueeContent}>
                {/* First Set */}
                {MARQUEE_ITEMS.map((item, idx) => (
                  <span
                    key={`set1-${idx}`}
                    className={item.highlight ? styles.marqueeItemHighlight : styles.marqueeItem}
                  >
                    {item.text}
                  </span>
                ))}
                {/* Second Set (duplicate for seamless loop) */}
                {MARQUEE_ITEMS.map((item, idx) => (
                  <span
                    key={`set2-${idx}`}
                    className={item.highlight ? styles.marqueeItemHighlight : styles.marqueeItem}
                  >
                    {item.text}
                  </span>
                ))}
              </div>

              {/* Fade Overlays */}
              <div className={styles.fadeLeft} />
              <div className={styles.fadeRight} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
