'use client';

import { ChevronRight } from 'lucide-react';
import styles from './evolution-summary.module.css';

const steps = [
  {
    id: '01',
    title: 'Interaction',
    desc: 'Records context from daily actions.',
    accent: 'indigo',
  },
  {
    id: '02',
    title: 'Feedback Loop',
    desc: 'Refines weights overnight.',
    accent: 'cyan',
  },
  {
    id: '03',
    title: 'Evolution',
    desc: 'Anticipates needs & scales logic.',
    accent: 'gradient',
  },
];

export function EvolutionSummary() {
  return (
    <section className={styles.section}>
      <div className={styles.shell}>
        <div className={styles.header}>
          <h2 className={styles.title}>Train, Interact, Evolve.</h2>
          <p className={styles.lead}>Feedback loops refine accuracy to your corporate DNA.</p>
        </div>

        <div className={styles.timeline}>
          <div className={styles.trackHorizontal} aria-hidden />
          <div className={styles.trackVertical} aria-hidden />

          <div className={styles.grid}>
            {steps.map((step) => (
              <div key={step.id} className={styles.step}>
                <div className={`${styles.node} ${styles[`node-${step.accent}`]}`}>{step.id}</div>
                <div className={styles.card}>
                  <div className={styles.cardInner}>
                    <h3 className={styles.cardTitle}>{step.title}</h3>
                    <p className={styles.cardDesc}>{step.desc}</p>
                  </div>
                  <div className={styles.arrow}>
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.result}>
          <div className={styles.resultText}>The Result?</div>
          <div className={styles.metrics}>
            <div className={styles.metric}>
              <div className={styles.metricValue}>
                <span className={styles.metricNumber}>80</span>
                <span className={styles.metricSuffix}>%</span>
              </div>
              <div className={styles.metricLabel}>Less Admin Overhead</div>
            </div>

            <div className={styles.divider} />

            <div className={styles.metric}>
              <div className={styles.metricValue}>
                <span className={styles.metricNumber}>3</span>
                <span className={styles.metricSuffix}>x</span>
              </div>
              <div className={styles.metricLabel}>Faster Decisions</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.sectionDivider} aria-hidden />
    </section>
  );
}
