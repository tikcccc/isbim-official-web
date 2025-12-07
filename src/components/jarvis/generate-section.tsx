'use client';

import { useState } from 'react';
import styles from './generate-section.module.css';

interface GenerateItem {
  id: number;
  title: string;
  description: string;
  accentColor: 'purple' | 'cyan';
}

const ITEMS: GenerateItem[] = [
  {
    id: 0,
    title: 'JARVIS Agent',
    description:
      'Automates repetitive tasks such as invoice scanning with 99.8% accuracy. Features tender parsing and auto-scoring.',
    accentColor: 'purple',
  },
  {
    id: 1,
    title: 'JARVIS Pay',
    description:
      'Digitizes Bills of Quantities and links payment milestones to 360° digital twins, enabling 60-day certification.',
    accentColor: 'cyan',
  },
  {
    id: 2,
    title: 'JARVIS Air',
    description:
      'Generates 3D models directly from 2D drawings, streamlining workflows for architects and engineers.',
    accentColor: 'purple',
  },
];

export function GenerateSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.label}>Generative & Strategic Intelligence</span>
          <h2 className={styles.heading}>
            Generate. <span className={styles.headingMuted}>Automate.</span>{' '}
            <span className="gradient-text">Capitalize.</span>
          </h2>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {/* Left: Interactive List */}
          <div className={styles.listColumn}>
            {ITEMS.map((item, idx) => (
              <div
                key={item.id}
                className={`${styles.listItem} ${activeIndex === idx ? styles.listItemActive : ''} ${
                  item.accentColor === 'purple' ? styles.listItemPurple : styles.listItemCyan
                }`}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <div className={styles.listItemHeader}>
                  <h3 className={styles.listItemTitle}>{item.title}</h3>
                  <svg
                    className={styles.arrow}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
                <div className={styles.listItemDesc}>{item.description}</div>
              </div>
            ))}
          </div>

          {/* Right: Visual Placeholder */}
          <div className={styles.visualColumn}>
            <div className={styles.screenContainer}>
              <div className={styles.visualPlaceholder}>
                <div className={styles.placeholderText}>
                  {ITEMS[activeIndex].title}
                  <br />
                  <span>Preview</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
