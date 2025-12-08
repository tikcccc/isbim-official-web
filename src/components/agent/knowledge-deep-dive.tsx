'use client';

import { useState } from 'react';
import { Brain, Network, Shield, Database } from 'lucide-react';
import styles from './knowledge-deep-dive.module.css';

const features = [
  {
    id: 'intelligence',
    icon: Database,
    title: 'Domain Intelligence',
    subtitle: 'isBIM Engineering Data',
    desc: "Ingests 10 years of project archives. It understands 'rebar' as a structural dependency, not just a keyword.",
  },
  {
    id: 'culture',
    icon: Network,
    title: 'Cultural Adaptation',
    subtitle: 'Context Tuning',
    desc: "Fine-tuned on internal comms. Learns that 'urgent' means 2 hours for team, 24 hours for vendors.",
  },
  {
    id: 'guardrails',
    icon: Shield,
    title: 'Governed Responses',
    subtitle: 'Compliance & Tone',
    desc: 'Grounded in your contracts, codes, and brand voice—cites sources and stays on-tone for audit-ready answers.',
  },
];

export function KnowledgeDeepDive() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section className={styles.section}>
      <div className={styles.shell} data-active={activeFeature}>
        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.label}>System Architecture</span>
            <h2 className={styles.title}>
              <span>The Knowledge Agent</span>
              <span className={styles.titleAccent}>Deep Dive</span>
            </h2>
          </div>

          <div className={styles.stack}>
            {features.map(({ id, icon: Icon, title, subtitle, desc }, idx) => (
              <button
                key={id}
                type="button"
                className={`${styles.card} ${activeFeature === idx ? styles.cardActive : styles.cardMuted}`}
                onMouseEnter={() => setActiveFeature(idx)}
                onFocus={() => setActiveFeature(idx)}
              >
                <div className={styles.iconWrap}>
                  <Icon className={styles.icon} />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>{subtitle}</div>
                  <h3 className={styles.cardTitle}>{title}</h3>
                  <p className={styles.cardDesc}>{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.visual}>
          <div className={`${styles.orbit} ${styles.orbitViolet}`}>
            <span className={styles.planet} />
          </div>
          <div className={`${styles.orbit} ${styles.orbitCyan}`}>
            <span className={styles.planet} />
          </div>
          <div className={`${styles.orbit} ${styles.orbitMint}`}>
            <span className={styles.planet} />
          </div>
          <div className={styles.brain}>
            <Brain className={styles.brainIcon} />
          </div>
        </div>
      </div>
    </section>
  );
}
