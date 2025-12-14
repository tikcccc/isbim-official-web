"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import styles from "./product-matrix.module.css";

type Product = {
  id: string;
  name: string;
  shortName: string;
  desc: string;
  category: string;
  video: string;
};

const VIDEO_SOURCES = {
  automation: "https://videos.pexels.com/video-files/8378772/8378772-hd_1280_720_25fps.mp4",
  finance: "https://videos.pexels.com/video-files/3130182/3130182-hd_1280_720_30fps.mp4",
  generative: "https://videos.pexels.com/video-files/3129671/3129671-hd_1280_720_30fps.mp4",
  monitoring: "https://videos.pexels.com/video-files/3191572/3191572-hd_1280_720_25fps.mp4",
  safety: "https://videos.pexels.com/video-files/1187979/1187979-hd_1280_720_24fps.mp4",
  management: "https://videos.pexels.com/video-files/3129957/3129957-hd_1280_720_25fps.mp4",
  data: "https://videos.pexels.com/video-files/3252451/3252451-hd_1280_720_25fps.mp4",
  lifecycle: "https://videos.pexels.com/video-files/1739010/1739010-hd_1280_720_30fps.mp4",
};

const PRODUCTS: Product[] = [
  {
    id: "01",
    name: "JARVIS Agent",
    shortName: "AGENT",
    desc: "Domain-specific generative AI agent for construction stakeholders. Invoice scanning & tender parsing.",
    category: "AUTOMATION",
    video: VIDEO_SOURCES.automation,
  },
  {
    id: "02",
    name: "JARVIS Pay",
    shortName: "PAY",
    desc: "Digital twin for 60-day SOPL-compliant certification. Better working-capital via investor visibility.",
    category: "FINANCE",
    video: VIDEO_SOURCES.finance,
  },
  {
    id: "03",
    name: "JARVIS Air",
    shortName: "AIR",
    desc: "Stable-diffusion generative design. Instant visuals, video walkthroughs, and scenario prototyping.",
    category: "GENERATIVE",
    video: VIDEO_SOURCES.generative,
  },
  {
    id: "04",
    name: "JARVIS Eagle Eye",
    shortName: "EAGLE EYE",
    desc: "Real-time digital twin with IoT. Remote monitoring, anomaly detection, compliance assurance.",
    category: "MONITORING",
    video: VIDEO_SOURCES.monitoring,
  },
  {
    id: "05",
    name: "JARVIS SSSS",
    shortName: "SSSS",
    desc: "Smart Site Safety System. Reduces incidents through proactive risk orchestration.",
    category: "SAFETY",
    video: VIDEO_SOURCES.safety,
  },
  {
    id: "06",
    name: "JARVIS DWSS",
    shortName: "DWSS",
    desc: "Digital Works Supervision portal. Secure submission, automated checks, audit trails.",
    category: "MANAGEMENT",
    video: VIDEO_SOURCES.management,
  },
  {
    id: "07",
    name: "JARVIS CDCP",
    shortName: "CDCP",
    desc: "Common Data Collaboration Platform. Interoperable BIM hub for conflict resolution.",
    category: "DATA",
    video: VIDEO_SOURCES.data,
  },
  {
    id: "08",
    name: "JARVIS Assets",
    shortName: "ASSETS",
    desc: "Digital twin + AI FM for predictive maintenance and lifecycle optimization.",
    category: "LIFECYCLE",
    video: VIDEO_SOURCES.lifecycle,
  },
];

function ProductCard({ product, index }: { product: Product; index: number }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35, rootMargin: "80px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (hovered) {
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {
          /* ignore autoplay errors */
        });
      }
    } else {
      video.pause();
    }
  }, [hovered]);

  return (
    <div
      ref={cardRef}
      className={styles.card}
      style={{
        transition: "opacity 260ms ease, transform 260ms ease",
        transitionDelay: visible ? `${(index % 4) * 80}ms` : "0ms",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(12px)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.videoLayer}>
        <video
          ref={videoRef}
          src={product.video}
          loop
          muted
          playsInline
          preload="metadata"
        />
        <div className={styles.videoOverlay} />
        <div className={styles.scanOverlay} />
      </div>

      <div className={styles.content}>
        <div className={styles.metaRow}>
          <div className={styles.metaBlock}>
            <span className={styles.metaId}>
              <span className={styles.metaDot} />
              {product.id}
            </span>
            <span className={styles.metaCategory}>{product.category}</span>
          </div>
          <ArrowUpRight className={styles.arrow} />
        </div>

        <div>
          <h3 className={styles.name}>{product.shortName}</h3>
          <p className={styles.desc}>{product.desc}</p>
          <div className={styles.footer}>
            <span className={styles.footerLabel}>Access module</span>
            <span className={styles.statusBars} aria-hidden>
              <span className={styles.statusBar} />
              <span className={styles.statusBar} />
              <span className={styles.statusBar} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductMatrix() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>SYSTEM MODULES</h2>
        <span className={styles.eyebrow}>
          V2.4 <span className={styles.eyebrowLine} /> SECURE CONNECTION
        </span>
      </div>
      <div className={styles.grid}>
        {PRODUCTS.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}
