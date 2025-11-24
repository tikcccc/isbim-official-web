"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CornerDownRight } from "lucide-react";
import Link from "next/link";
import { useMenuStore } from "@/stores/menu-store";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { useBodyScrollLock } from "@/hooks";
import { useLocalizedHref } from "@/lib/i18n/route-builder";
import * as m from "@/paraglide/messages";

// --- Helper function to get menu data with i18n ---
const getMenuData = () => ({
  structure: [
    { title: m.menu_nav_about(), href: "/about-us", type: "link" as const },
    {
      title: m.menu_nav_services(),
      type: "group" as const,
      children: [
        {
          title: m.menu_nav_jarvis_suite(),
          action: "jarvis_suite",
          isHighlight: true,
        },
        { title: m.menu_nav_jpm(), href: "/jarvis-jpm" },
        { title: m.menu_nav_bim(), href: "/bim-consultancy" },
        { title: m.menu_nav_finance(), href: "/project-finance" },
        { title: m.menu_nav_venture(), href: "/venture-investments" },
      ],
    },
    { title: m.menu_nav_newsroom(), href: "/newsroom", type: "link" as const },
    { title: m.menu_nav_careers(), href: "/careers", type: "link" as const },
    { title: m.menu_nav_contact(), href: "/contact", type: "link" as const },
  ],
  jarvisProducts: [
    { name: m.menu_product_agent_name(), desc: m.menu_product_agent_desc() },
    { name: m.menu_product_pay_name(), desc: m.menu_product_pay_desc() },
    { name: m.menu_product_air_name(), desc: m.menu_product_air_desc() },
    { name: m.menu_product_eagleeye_name(), desc: m.menu_product_eagleeye_desc() },
    { name: m.menu_product_ssss_name(), desc: m.menu_product_ssss_desc() },
    { name: m.menu_product_dwss_name(), desc: m.menu_product_dwss_desc() },
    { name: m.menu_product_cdcp_name(), desc: m.menu_product_cdcp_desc() },
    { name: m.menu_product_assets_name(), desc: m.menu_product_assets_desc() },
  ],
  // Stats data from copywriting
  stats: [
    { value: "2,600+", label: "LIVE_PROJECTS", desc: m.menu_stat_live_projects() },
    { value: "1.2B", label: "TOTAL_SQFT", desc: m.menu_stat_sqft() },
    { value: "71%", label: "DEFECT_REDUCTION", desc: m.menu_stat_defect() },
    { value: "45%", label: "FASTER_DELIVERY", desc: m.menu_stat_delivery() },
  ],
  // Impact metrics
  impact: [
    { value: "25-35%", label: m.menu_impact_emissions() },
    { value: "35-45%", label: m.menu_impact_waste() },
    { value: "60 Days", label: m.menu_impact_payment() },
    { value: "99.8%", label: m.menu_impact_accuracy() },
  ],
});

// --- Animation Variants ---
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: { opacity: 0, transition: { duration: 0.3 } },
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
  exit: { opacity: 0, x: 10, transition: { duration: 0.2 } },
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
  const { buildHref } = useLocalizedHref();
  const menuData = getMenuData();

  // Lock body scroll when menu is open
  useBodyScrollLock(isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-40 flex flex-col bg-[#050505] text-white overflow-hidden font-sans"
        >
          {/* Top Bar - Reserved space for Topbar integration */}
          <div className="h-[88px] shrink-0" />

          {/* Main Grid Layout */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 max-w-screen-2xl mx-auto w-full min-h-0">
            {/* LEFT COLUMN: Navigation Tree */}
            <div className="lg:col-span-5 p-10 lg:p-16 lg:pt-10 border-r border-white/10 flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="mb-8">
                <TypewriterText
                  text="NAVIGATION_INDEX"
                  className="text-[10px] font-mono text-blue-400 mb-8 tracking-[0.2em]"
                  delay={0.2}
                />

                <motion.nav
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-8"
                >
                  {menuData.structure.map((item, idx) => (
                    <motion.div
                      key={idx}
                      variants={fadeInUp}
                      className="flex flex-col"
                    >
                      {/* Top Level Item */}
                      {item.type === "link" ? (
                        <Link
                          href={buildHref(item.href || "#")}
                          onClick={closeMenu}
                          className="group flex items-center gap-4 cursor-pointer"
                        >
                          <span className="text-3xl lg:text-4xl font-medium text-neutral-400 group-hover:text-white transition-colors tracking-tight">
                            {item.title}
                          </span>
                        </Link>
                      ) : (
                        <div className="group flex items-center gap-4 cursor-pointer">
                          <span className="text-3xl lg:text-4xl font-medium text-neutral-400 group-hover:text-white transition-colors tracking-tight">
                            {item.title}
                          </span>
                        </div>
                      )}

                      {/* Children */}
                      {item.type === "group" && item.children && (
                        <motion.div
                          className="mt-6 ml-2 flex flex-col gap-4 border-l border-white/10 pl-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                        >
                          {item.children.map((child, cIdx) =>
                            child.href ? (
                              <Link
                                key={cIdx}
                                href={buildHref(child.href)}
                                onClick={closeMenu}
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
                                  className={`text-xl transition-colors ${
                                    child.isHighlight
                                      ? "text-white font-medium group-hover/child:text-blue-400"
                                      : "text-neutral-500 group-hover/child:text-neutral-300"
                                  }`}
                                >
                                  {child.title}
                                </span>

                                {/* Hover Indicator */}
                                {child.action === "jarvis_suite" && (
                                  <motion.div
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
                                  className={`text-xl transition-colors ${
                                    child.isHighlight
                                      ? "text-white font-medium group-hover/child:text-blue-400"
                                      : "text-neutral-500 group-hover/child:text-neutral-300"
                                  }`}
                                >
                                  {child.title}
                                </span>

                                {/* Hover Indicator */}
                                {child.action === "jarvis_suite" && (
                                  <motion.div
                                    layoutId="indicator"
                                    className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover/child:opacity-100"
                                  />
                                )}
                              </div>
                            )
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </motion.nav>
              </div>

              {/* Footer Links */}
              <motion.div
                className="mt-auto pt-16"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.8 }}
              >
                <div className="flex flex-col gap-3">
                  <a
                    href="#"
                    className="text-sm text-neutral-500 hover:text-neutral-200 transition-colors"
                  >
                    <TypewriterText
                      text={m.menu_nav_legal()}
                      className="text-sm"
                      delay={1.0}
                    />
                  </a>
                  <a
                    href="#"
                    className="text-sm text-neutral-500 hover:text-neutral-200 transition-colors"
                  >
                    <TypewriterText
                      text={m.footer_privacy()}
                      className="text-sm"
                      delay={1.1}
                    />
                  </a>
                </div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Dynamic Content Area */}
            <div className="lg:col-span-7 bg-[#080808] p-10 lg:p-16 lg:pt-10 hidden lg:flex flex-col relative overflow-hidden">
              {/* Grid Texture */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

              <AnimatePresence mode="wait">
                {activePreview === "jarvis_suite" ? (
                  <motion.div
                    key="products"
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="h-full z-10 flex flex-col"
                  >
                    <div className="mb-10 border-b border-white/10 pb-6 flex justify-between items-end">
                      <div>
                        <TypewriterText
                          text="PRODUCT_CATALOG"
                          className="text-[10px] font-mono text-blue-400 mb-3 tracking-widest"
                        />
                        <motion.h2
                          variants={fadeInUp}
                          className="text-4xl font-light text-white"
                        >
                          {m.menu_nav_jarvis_suite()}
                        </motion.h2>
                        <TypewriterText
                          text={m.menu_suite_subtitle()}
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

                    <div className="grid grid-cols-2 gap-x-12 gap-y-8 overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10">
                      {menuData.jarvisProducts.map((prod, idx) => (
                        <div
                          key={idx}
                          className="group cursor-pointer p-4 rounded-lg border border-white/5 hover:border-blue-500/30 hover:bg-white/5 transition-all"
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
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="default"
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="h-full z-10 flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <TypewriterText
                          text="LATEST_INTELLIGENCE"
                          className="text-[10px] font-mono text-blue-400 tracking-[0.2em] mb-4 block"
                        />
                        <motion.h2
                          variants={fadeInUp}
                          className="text-3xl font-light text-white max-w-lg leading-snug"
                        >
                          {m.menu_headline()}{" "}
                          <span className="text-blue-400">
                            {m.menu_headline_highlight()}
                          </span>
                        </motion.h2>
                      </div>
                      <motion.button
                        variants={fadeInUp}
                        className="text-[10px] font-mono border border-white/20 px-6 py-3 hover:bg-white hover:text-black transition-all text-neutral-300 uppercase tracking-widest flex items-center gap-2"
                      >
                        {m.menu_nav_newsroom()} <ArrowRight size={14} />
                      </motion.button>
                    </div>

                    {/* Stats Section */}
                    <motion.div
                      variants={fadeInUp}
                      className="grid grid-cols-4 gap-6 py-8 border-y border-white/10 mb-8"
                    >
                      {menuData.stats.map((stat, idx) => (
                        <div key={idx} className="text-center">
                          <TypewriterText
                            text={stat.label}
                            className="text-[10px] font-mono text-blue-400 tracking-[0.15em] mb-3 block"
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
                    </motion.div>

                    {/* Impact Metrics */}
                    <motion.div
                      variants={fadeInUp}
                      className="flex justify-between items-center mb-10 px-4"
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
                              className="text-[10px] text-neutral-300 uppercase tracking-wider"
                              delay={0.7 + idx * 0.08}
                            />
                          </div>
                        </div>
                      ))}
                    </motion.div>

                    {/* News Section Header */}
                    <div className="flex justify-between items-center mb-6 pt-6 border-t border-white/10">
                      <TypewriterText
                        text="NEWSROOM_FEED"
                        className="text-[10px] font-mono text-blue-400 tracking-[0.2em]"
                        delay={0.8}
                      />
                      <motion.button
                        variants={fadeInUp}
                        className="text-[9px] font-mono text-gray-300 hover:text-gray-100 transition-colors uppercase tracking-widest flex items-center gap-2"
                      >
                        {m.menu_view_all()} <ArrowRight size={12} />
                      </motion.button>
                    </div>

                    {/* News Cards */}
                    <div className="grid grid-cols-2 gap-6">
                      <motion.div
                        variants={fadeInUp}
                        className="group cursor-pointer"
                      >
                        <div className="aspect-video bg-neutral-900 mb-5 overflow-hidden relative border border-white/10">
                          <img
                            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
                            className="object-cover w-full h-full opacity-60 group-hover:scale-105 transition-transform duration-700 group-hover:opacity-80"
                            alt="Tech"
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
                      </motion.div>

                      <motion.div
                        variants={fadeInUp}
                        className="group cursor-pointer"
                      >
                        <div className="aspect-video bg-neutral-900 mb-5 overflow-hidden relative border border-white/10">
                          <img
                            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
                            className="object-cover w-full h-full opacity-60 group-hover:scale-105 transition-transform duration-700 group-hover:opacity-80"
                            alt="Chip"
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
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
