"use client";

import { AnimatePresence } from "framer-motion";
import { ArrowRight, CornerDownRight } from "lucide-react";
import { Link } from "@/lib/i18n";
import Image from "next/image";
import { useMenuStore } from "@/stores/menu-store";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { useBodyScrollLock, useLenis } from "@/hooks";
import { ROUTES } from "@/lib/constants";
import * as messages from "@/paraglide/messages";
import { m } from "@/components/motion/lazy-motion";
import { useEffect, useMemo, useRef } from "react";

// --- Type definitions for menu data ---
interface MenuChild {
  title: string;
  href: string;
  action?: string;
  isHighlight?: boolean;
}

interface MenuLink {
  title: string;
  href: string;
  type: "link";
}

interface MenuGroup {
  title: string;
  type: "group";
  children: MenuChild[];
  href?: string;
}

type MenuItem = MenuLink | MenuGroup;

interface JarvisProduct {
  name: string;
  desc: string;
  href: string;
}

// --- Helper function to get menu data with i18n ---
const getMenuData = () => ({
  structure: [
    { title: messages.menu_nav_about(), href: ROUTES.ABOUT, type: "link" as const },
    {
      title: messages.menu_nav_services(),
      type: "group" as const,
      href: ROUTES.SERVICES_PRODUCTS,
      children: [
        {
          title: messages.menu_nav_jarvis_suite(),
          action: "jarvis_suite",
          isHighlight: true,
          href: ROUTES.JARVIS.SUITE,
        },
        { title: messages.menu_nav_jpm(), href: ROUTES.JARVIS.JPM },
        { title: messages.menu_nav_bim(), href: ROUTES.BIM_CONSULTANCY },
        { title: messages.menu_nav_finance(), href: ROUTES.PROJECT_FINANCE },
        { title: messages.menu_nav_venture(), href: ROUTES.VENTURE_INVESTMENTS },
      ],
    },
    { title: messages.menu_nav_newsroom(), href: ROUTES.NEWSROOM, type: "link" as const },
    { title: messages.menu_nav_careers(), href: ROUTES.CAREERS, type: "link" as const },
    { title: messages.menu_nav_contact(), href: ROUTES.CONTACT, type: "link" as const },
  ] as MenuItem[],
  jarvisProducts: [
    {
      name: messages.menu_product_agent_name(),
      desc: messages.menu_product_agent_desc(),
      href: ROUTES.JARVIS.AGENT,
    },
    {
      name: messages.menu_product_pay_name(),
      desc: messages.menu_product_pay_desc(),
      href: ROUTES.JARVIS.PAY,
    },
    {
      name: messages.menu_product_air_name(),
      desc: messages.menu_product_air_desc(),
      href: ROUTES.JARVIS.AIR,
    },
    {
      name: messages.menu_product_eagleeye_name(),
      desc: messages.menu_product_eagleeye_desc(),
      href: ROUTES.JARVIS.EAGLE_EYE,
    },
    {
      name: messages.menu_product_ssss_name(),
      desc: messages.menu_product_ssss_desc(),
      href: ROUTES.JARVIS.SSSS,
    },
    {
      name: messages.menu_product_dwss_name(),
      desc: messages.menu_product_dwss_desc(),
      href: ROUTES.JARVIS.DWSS,
    },
    {
      name: messages.menu_product_cdcp_name(),
      desc: messages.menu_product_cdcp_desc(),
      href: ROUTES.JARVIS.CDCP,
    },
    {
      name: messages.menu_product_assets_name(),
      desc: messages.menu_product_assets_desc(),
      href: ROUTES.JARVIS.ASSETS,
    },
  ] as JarvisProduct[],
  // Stats data from copywriting
  stats: [
    { value: "2,600+", label: "LIVE_PROJECTS", desc: messages.menu_stat_live_projects() },
    { value: "1.2B", label: "TOTAL_SQFT", desc: messages.menu_stat_sqft() },
    { value: "71%", label: "DEFECT_REDUCTION", desc: messages.menu_stat_defect() },
    { value: "45%", label: "FASTER_DELIVERY", desc: messages.menu_stat_delivery() },
  ],
  // Impact metrics
  impact: [
    { value: "25-35%", label: messages.menu_impact_emissions() },
    { value: "35-45%", label: messages.menu_impact_waste() },
    { value: "60 Days", label: messages.menu_impact_payment() },
    { value: "99.8%", label: messages.menu_impact_accuracy() },
  ],
});

// --- Animation Variants ---
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: { opacity: 0 },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const panelVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
      when: "beforeChildren" as const,
      staggerChildren: 0.1,
    },
  },
  exit: { opacity: 0, x: 10, transition: { duration: 0.1 } },
};

/**
 * MenuOverlay Component
 *
 * A full-screen immersive navigation overlay with Palantir-style design.
 * Features:
 * - Glassmorphism design with dark theme
 * - Typewriter text animations for tech-style labels
 * - Dynamic content preview on hover
 * - Nested navigation structure
 * - Grid texture background
 * - Type-safe routing with automatic locale handling
 */
export function MenuOverlay() {
  const { isOpen, closeMenu, activePreview, setActivePreview } = useMenuStore();
  const { lenis } = useLenis();
  const menuData = useMemo(() => getMenuData(), []);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const scrollStateRef = useRef({ target: 0, rafId: null as number | null });

  // Lock body scroll when menu is open
  useBodyScrollLock(isOpen);

  // Stop Lenis and implement smooth scrolling for menu overlay
  useEffect(() => {
    if (!lenis || !isOpen) {
      if (lenis && !isOpen) {
        lenis.start();
        scrollStateRef.current.target = 0; // Reset on close
      }
      return;
    }

    lenis.stop();
    // Capture the current scroll state object so cleanup uses the same reference
    const scrollState = scrollStateRef.current;

    const overlay = overlayRef.current || (document.querySelector("[data-menu-overlay]") as HTMLElement | null);
    if (!overlay) {
      return () => {
        lenis.start();
      };
    }

    // Initialize scroll target from current position
    scrollState.target = overlay.scrollTop;

    const smoothStep = () => {
      const delta = scrollState.target - overlay.scrollTop;
      const eased = delta * 0.2;
      if (Math.abs(delta) > 0.5) {
        overlay.scrollTop += eased;
        scrollState.rafId = requestAnimationFrame(smoothStep);
      } else {
        overlay.scrollTop = scrollState.target;
        scrollState.rafId = null;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const maxScroll = overlay.scrollHeight - overlay.clientHeight;
      scrollState.target = Math.max(0, Math.min(scrollState.target + e.deltaY, maxScroll));

      if (scrollState.rafId === null) {
        scrollState.rafId = requestAnimationFrame(smoothStep);
      }
    };

    overlay.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      overlay.removeEventListener("wheel", handleWheel);
      if (scrollState.rafId !== null) {
        cancelAnimationFrame(scrollState.rafId);
        scrollState.rafId = null;
      }
      lenis.start();
    };
  }, [isOpen, lenis]);



  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          data-menu-overlay
          ref={overlayRef}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-40 bg-[#050505] text-white layout-nav-link overflow-y-scroll [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarGutter: 'stable',
          }}
        >
          {/* Top Bar - Reserved space for Topbar integration */}
          <div className="h-[88px] shrink-0" />

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 max-w-screen-2xl mx-auto w-full min-h-[calc(100vh-88px)]">
            {/* LEFT COLUMN: Navigation Tree */}
            <div className="lg:col-span-5 p-10 lg:p-16 lg:pt-10 border-r border-white/10 flex flex-col pb-12">
              <div className="mb-8">
                <TypewriterText
                  text="NAVIGATION_INDEX"
                  className="text-[10px] layout-nav-label text-blue-400 mb-8 tracking-[0.2em]"
                  delay={0.2}
                />

                <m.nav
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-8"
                >
                  {menuData.structure.map((item, idx) => (
                    <m.div
                      key={idx}
                      variants={fadeInUp}
                      className="flex flex-col"
                    >
                      {/* Top Level Item */}
                      {item.type === "link" ? (
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          prefetch
                          className="group flex items-center gap-4 cursor-pointer"
                        >
                          <span className="text-3xl lg:text-4xl font-medium text-neutral-400 group-hover:text-white transition-colors tracking-tight layout-nav-heading">
                            {item.title}
                          </span>
                        </Link>
                      ) : item.href ? (
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          prefetch
                          className="group flex items-center gap-4 cursor-pointer"
                        >
                          <span className="text-3xl lg:text-4xl font-medium text-neutral-400 group-hover:text-white transition-colors tracking-tight layout-nav-heading">
                            {item.title}
                          </span>
                        </Link>
                      ) : (
                        <div className="group flex items-center gap-4 cursor-pointer">
                          <span className="text-3xl lg:text-4xl font-medium text-neutral-400 group-hover:text-white transition-colors tracking-tight layout-nav-heading">
                            {item.title}
                          </span>
                        </div>
                      )}

                      {/* Children */}
                      {item.type === "group" && item.children && (
                        <m.div
                          className="mt-6 ml-2 flex flex-col gap-4 border-l border-white/10 pl-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                        >
                          {item.children.map((child, cIdx) =>
                            child.href ? (
                              <Link
                                key={cIdx}
                                href={child.href}
                                onClick={closeMenu}
                                prefetch
                          className="group/child flex items-center gap-4 cursor-pointer py-1"
                          onMouseEnter={() =>
                            child.action === "jarvis_suite"
                              ? setActivePreview("jarvis_suite")
                              : setActivePreview("default")
                          }
                        >
                          <CornerDownRight
                            size={18}
                            className={`transition-colors ${
                              child.action === "jarvis_suite"
                                ? "text-blue-400 group-hover/child:text-blue-500"
                                : "text-neutral-600 group-hover/child:text-blue-500"
                            }`}
                          />
                          <span
                            className={`text-xl transition-colors layout-nav-link ${
                              child.isHighlight
                                ? "text-white font-medium group-hover/child:text-blue-400"
                                : "text-neutral-500 group-hover/child:text-neutral-300"
                            }`}
                          >
                            {child.title}
                          </span>

                                {/* Hover Indicator */}
                                {child.action === "jarvis_suite" && (
                                  <m.div
                                    layoutId="indicator"
                                    className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover/child:opacity-100"
                                  />
                                )}
                              </Link>
                            ) : (
                              <div
                                key={cIdx}
                                className="group/child flex items-center gap-4 cursor-pointer py-1"
                                onMouseEnter={() =>
                                  child.action === "jarvis_suite"
                                    ? setActivePreview("jarvis_suite")
                                    : setActivePreview("default")
                                }
                              >
                                <CornerDownRight
                                  size={18}
                                  className="text-neutral-600 group-hover/child:text-blue-500 transition-colors"
                                />
                                <span
                                  className={`text-xl transition-colors layout-nav-link ${
                                    child.isHighlight
                                      ? "text-white font-medium group-hover/child:text-blue-400"
                                      : "text-neutral-500 group-hover/child:text-neutral-300"
                                  }`}
                                >
                                  {child.title}
                                </span>

                                {/* Hover Indicator */}
                                {child.action === "jarvis_suite" && (
                                  <m.div
                                    layoutId="indicator"
                                    className="w-2 h-2 bg-blue-500 rounded-full opacity-100 animate-pulse"
                                  />
                                )}
                          </div>
                        )
                      )}
                        </m.div>
                      )}
                    </m.div>
                  ))}
                </m.nav>
              </div>

              {/* Footer Links */}
              <m.div
                className="mt-12 lg:mt-16 pt-6 pb-4 border-t border-white/10"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.8 }}
              >
                <div className="flex flex-col gap-3">
                  <Link
                    href="/terms"
                    onClick={closeMenu}
                    prefetch
                    className="text-sm text-neutral-500 hover:text-neutral-200 transition-colors"
                  >
                    <TypewriterText
                      text={messages.menu_nav_legal()}
                      className="text-sm"
                      delay={1.0}
                    />
                  </Link>
                  <Link
                    href="/privacy"
                    onClick={closeMenu}
                    prefetch
                    className="text-sm text-neutral-500 hover:text-neutral-200 transition-colors"
                  >
                    <TypewriterText
                      text={messages.footer_privacy()}
                      className="text-sm"
                      delay={1.1}
                    />
                  </Link>
                </div>
              </m.div>
            </div>

            {/* RIGHT COLUMN: Dynamic Content Area */}
            <div className="lg:col-span-7 bg-[#080808] p-10 lg:p-16 lg:pt-10 hidden lg:flex flex-col relative">
              {/* Grid Texture - soft-light with edge fade to reduce clutter */}
              <div
                className="absolute inset-0 pointer-events-none mix-blend-screen"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.24) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.24) 1px, transparent 1px)
                  `,
                  backgroundSize: "80px 80px",
                  opacity: 0.08,
                  maskImage:
                    "radial-gradient(circle at 50% 45%, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 68%, rgba(255,255,255,0.7) 82%, rgba(255,255,255,0.4) 94%, rgba(255,255,255,0) 100%)",
                  WebkitMaskImage:
                    "radial-gradient(circle at 50% 45%, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 68%, rgba(255,255,255,0.7) 82%, rgba(255,255,255,0.4) 94%, rgba(255,255,255,0) 100%)",
                }}
              />

              <AnimatePresence mode="wait">
                {activePreview === "jarvis_suite" ? (
                  <m.div
                    key="products"
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="z-10 flex flex-col min-h-[720px] lg:min-h-[840px]"
                  >
                    <div className="mb-10 border-b border-white/10 pb-6 flex justify-between items-end">
                      <div>
                        <TypewriterText
                          text="PRODUCT_CATALOG"
                          className="text-[10px] font-mono text-blue-400 mb-3 tracking-widest"
                        />
                        <m.h2
                          variants={fadeInUp}
                          className="text-4xl font-light text-white"
                        >
                          {messages.menu_nav_jarvis_suite()}
                        </m.h2>
                        <TypewriterText
                          text={messages.menu_suite_subtitle()}
                          className="text-sm text-neutral-400 mt-2 block"
                          delay={0.2}
                        />
                      </div>
                      <div className="text-right gap-4 flex ">
                        <TypewriterText
                          text="STATUS: ONLINE"
                          className="text-[10px] font-mono text-green-500 tracking-widest block"
                        />
                        <TypewriterText
                          text="2,600+ DEPLOYMENTS"
                          className="text-[10px] font-mono text-neutral-500 tracking-wider block"
                          delay={0.1}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-12 gap-y-8 pr-4">
                      {menuData.jarvisProducts.map((prod, idx) => (
                        <Link
                          key={prod.href}
                          href={prod.href}
                          onClick={closeMenu}
                          prefetch
                          className="group block cursor-pointer p-4 rounded-lg bg-white/[0.015] hover:bg-white/5 transition-all shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] hover:shadow-[inset_0_0_0_1px_rgba(59,130,246,0.25)]"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 opacity-50 group-hover:opacity-100 group-hover:shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all" />
                              <div className="flex-1">
                                <TypewriterText
                                  text={prod.name}
                                  className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors block"
                                  delay={0.3 + idx * 0.08}
                                />
                              </div>
                            </div>
                            <TypewriterText
                              text={`Module ${String(idx + 1).padStart(2, '0')}`}
                              className="text-[9px] font-mono text-neutral-600 uppercase tracking-wider whitespace-nowrap"
                              delay={0.35 + idx * 0.08}
                            />
                          </div>
                          <div className="text-sm text-neutral-400 pl-5 leading-relaxed">
                            <TypewriterText
                              text={prod.desc}
                              className="text-sm"
                              delay={0.5 + idx * 0.08}
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </m.div>
                ) : (
                  <m.div
                    key="default"
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="z-10 flex flex-col min-h-[720px] lg:min-h-[840px]"
                  >
                    <div className="flex justify-between items-start mb-[2.75rem]">
                      <div>
                        <TypewriterText
                          text="LATEST_INTELLIGENCE"
                          className="text-[10px] font-mono text-blue-400 tracking-[0.2em] mb-4 block"
                        />
                        <m.h2
                          variants={fadeInUp}
                          className="text-3xl font-light text-white max-w-lg leading-snug"
                        >
                          {messages.menu_headline()}{" "}
                          <span className="text-blue-400">
                            {messages.menu_headline_highlight()}
                          </span>
                        </m.h2>
                      </div>
                      <m.div variants={fadeInUp}>
                        <Link
                          href={ROUTES.SERVICES_PRODUCTS}
                          onClick={closeMenu}
                          prefetch
                          className="text-[10px] font-mono border border-white/20 px-6 py-3 hover:bg-white hover:text-black transition-all text-neutral-300 uppercase tracking-widest flex items-center gap-2"
                        >
                          Explore <ArrowRight size={14} />
                        </Link>
                      </m.div>
                    </div>

                    {/* Stats Section */}
                    <m.div
                      variants={fadeInUp}
                      className="grid grid-cols-4 gap-6 py-7 border-y border-white/10 mb-7"
                    >
                      {menuData.stats.map((stat, idx) => (
                        <div key={idx} className="text-center">
                        <TypewriterText
                          text={stat.label}
                          className="text-[10px] layout-nav-label text-blue-400 tracking-[0.15em] mb-3 block"
                          delay={0.3 + idx * 0.1}
                        />
                          <div className="text-3xl font-medium text-white mb-2">
                            <TypewriterText
                              text={stat.value}
                              className="text-3xl font-medium"
                              delay={0.4 + idx * 0.1}
                            />
                          </div>
                          <TypewriterText
                            text={stat.desc}
                            className="text-xs text-neutral-400 leading-tight"
                            delay={0.5 + idx * 0.1}
                          />
                        </div>
                      ))}
                    </m.div>

                    {/* Impact Metrics */}
                    <m.div
                      variants={fadeInUp}
                      className="flex justify-between items-center mb-[2.75rem] px-4"
                    >
                      {menuData.impact.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-1 h-10 bg-blue-500/50" />
                          <div>
                            <TypewriterText
                              text={item.value}
                              className="text-xl font-semibold text-white block"
                              delay={0.6 + idx * 0.08}
                            />
                            <TypewriterText
                              text={item.label}
                              className="text-[10px] text-neutral-300 uppercase tracking-wider inline-block ml-2"
                              delay={0.7 + idx * 0.08}
                            />
                          </div>
                        </div>
                      ))}
                    </m.div>

                    {/* News Section Header */}
                    <div className="flex justify-between items-center mb-7 pt-7 border-t border-white/10">
                      <TypewriterText
                        text="NEWSROOM_FEED"
                        className="text-[10px] font-mono text-blue-400 tracking-[0.2em]"
                        delay={0.8}
                      />
                      <m.div variants={fadeInUp}>
                        <Link
                          href={ROUTES.NEWSROOM}
                          onClick={closeMenu}
                          prefetch
                          className="text-[9px] font-mono text-gray-300 hover:text-gray-100 transition-colors uppercase tracking-widest flex items-center gap-2"
                        >
                          {messages.menu_view_all()} <ArrowRight size={12} />
                        </Link>
                      </m.div>
                    </div>

                    {/* News Cards */}
                    <div className="grid grid-cols-2 gap-6">
                      <m.div
                        variants={fadeInUp}
                        className="group cursor-pointer"
                      >
                        <div className="aspect-video bg-neutral-900 mb-5 overflow-hidden relative border border-white/10">
                          <Image
                            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
                            alt="Tech"
                            fill
                            sizes="(max-width: 1024px) 100vw, 33vw"
                            className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 group-hover:opacity-80"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                            <TypewriterText
                              text="FEATURED"
                              className="bg-blue-600 text-white text-[9px] font-bold px-2 py-1 uppercase inline-block"
                              delay={0.4}
                            />
                          </div>
                        </div>
                        <TypewriterText
                          text="PRESS RELEASE // MAR 12"
                          className="text-[9px] font-mono text-blue-400 mb-2 block"
                          delay={0.5}
                        />
                        <h3 className="text-xl text-neutral-200 group-hover:text-white leading-snug mb-2">
                          <TypewriterText
                            text="Coding unveils new JARVIS core architecture for mega-projects."
                            className="text-xl"
                            delay={0.6}
                          />
                        </h3>
                      </m.div>

                      <m.div
                        variants={fadeInUp}
                        className="group cursor-pointer"
                      >
                        <div className="aspect-video bg-neutral-900 mb-5 overflow-hidden relative border border-white/10">
                          <Image
                            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
                            alt="Chip"
                            fill
                            sizes="(max-width: 1024px) 100vw, 33vw"
                            className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 group-hover:opacity-80"
                          />
                        </div>
                        <TypewriterText
                          text="BLOG // FEB 28"
                          className="text-[9px] font-mono text-neutral-500 mb-2 block"
                          delay={0.6}
                        />
                        <h3 className="text-xl text-neutral-200 group-hover:text-white leading-snug mb-2">
                          <TypewriterText
                            text="How Digital Twins are reducing carbon footprints in Asia."
                            className="text-xl"
                            delay={0.7}
                          />
                        </h3>
                      </m.div>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </m.div>
      )}
    </AnimatePresence>
  );
}
