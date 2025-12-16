"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { JARVIS_POSTERS, JARVIS_VIDEOS } from "@/lib/media-config";
import { ROUTES } from "@/lib/constants";
import { LocalizedLink } from "@/components/ui/localized-link";
import styles from "./product-matrix.module.css";

type Product = {
  id: string;
  name: string;
  shortName: string;
  desc: string;
  category: string;
  video: string;
  poster?: string;
  href: string;
};

const PRODUCTS: Product[] = [
  {
    id: "01",
    name: "JARVIS Agent",
    shortName: "AGENT",
    desc: "Domain-specific generative AI agent for construction stakeholders.",
    category: "AUTOMATION",
    video: JARVIS_VIDEOS.agent,
    poster: JARVIS_POSTERS.agent,
    href: ROUTES.JARVIS.AGENT,
  },
  {
    id: "02",
    name: "JARVIS Pay",
    shortName: "PAY",
    desc: "60-day SOPL certification via Digital Twin. Boost capital via visibility.",
    category: "FINANCE",
    video: JARVIS_VIDEOS.pay,
    poster: JARVIS_POSTERS.pay,
    href: ROUTES.JARVIS.PAY,
  },
  {
    id: "03",
    name: "JARVIS Air",
    shortName: "AIR",
    desc: "Stable Diffusion Design. Instant visuals, walkthroughs, and prototypes.",
    category: "GENERATIVE",
    video: JARVIS_VIDEOS.air,
    poster: JARVIS_POSTERS.air,
    href: ROUTES.JARVIS.AIR,
  },
  {
    id: "04",
    name: "JARVIS Eagle Eye",
    shortName: "EAGLE EYE",
    desc: "Real-time IoT. Monitor & ensure compliance.",
    category: "MONITORING",
    video: JARVIS_VIDEOS.eagleEye,
    poster: JARVIS_POSTERS.eagleEye,
    href: ROUTES.JARVIS.EAGLE_EYE,
  },
  {
    id: "05",
    name: "JARVIS SSSS",
    shortName: "SSSS",
    desc: "Smart Site Safety System. Reduces incidents through proactive risk orchestration.",
    category: "SAFETY",
    video: JARVIS_VIDEOS.ssss,
    poster: JARVIS_POSTERS.ssss,
    href: ROUTES.JARVIS.SSSS,
  },
  {
    id: "06",
    name: "JARVIS DWSS",
    shortName: "DWSS",
    desc: "Digital Works Supervision portal. Secure submission, automated checks, audit trails.",
    category: "MANAGEMENT",
    video: JARVIS_VIDEOS.dwss,
    poster: JARVIS_POSTERS.dwss,
    href: ROUTES.JARVIS.DWSS,
  },
  {
    id: "07",
    name: "JARVIS CDCP",
    shortName: "CDCP",
    desc: "Common Data Collaboration Platform. Interoperable BIM hub for conflict resolution.",
    category: "DATA",
    video: JARVIS_VIDEOS.cdcp,
    poster: JARVIS_POSTERS.cdcp,
    href: ROUTES.JARVIS.CDCP,
  },
  {
    id: "08",
    name: "JARVIS Assets",
    shortName: "ASSETS",
    desc: "Digital twin + AI FM for predictive maintenance and lifecycle optimization.",
    category: "LIFECYCLE",
    video: JARVIS_VIDEOS.assets,
    poster: JARVIS_POSTERS.assets,
    href: ROUTES.JARVIS.ASSETS,
  },
];

function ProductCard({ product, index }: { product: Product; index: number }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cardRef = useRef<HTMLAnchorElement | null>(null);
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
    <LocalizedLink
      ref={cardRef}
      href={product.href}
      prefetchMode="hover"
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
          poster={product.poster}
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
    </LocalizedLink>
  );
}

export function ProductMatrix() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>SYSTEM MODULES</h2>
        </div>
        <div className={styles.grid}>
          {PRODUCTS.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
