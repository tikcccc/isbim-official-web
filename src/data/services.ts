/**
 * Services Data
 *
 * 用途：
 * - 存儲isBIM提供的額外服務的靜態數據
 * - Services & Products頁面展示所有服務和AI產品
 *
 * 包含的服務：
 * 1. JARVIS AI Suite - AI平台
 * 2. JARVIS Project Management (JPM) - 項目管理服務
 * 3. BIM Consultancy - BIM咨詢服務
 * 4. Project Finance - 項目融資服務
 * 5. Venture Investments - 風險投資服務
 */

import {
  Brain,
  Kanban,
  Box,
  Banknote,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";
import * as messages from "@/paraglide/messages";

type MessageKey = keyof typeof messages;

const translateMessage = (
  key: MessageKey | undefined,
  fallback: string
): string => {
  if (!key) return fallback;
  const messageFn = messages[key];
  return typeof messageFn === "function" ? (messageFn as () => string)() : fallback;
};

export interface ServiceData {
  id: string;
  href: string;
  title: string;
  headerDescription: string;
  tagline: string;
  description: string;
  ctaText: string;
  image: string;
  type: string;
  icon: LucideIcon;
  gridArea: string;
  height: string;
  titleKey?: MessageKey;
  headerDescriptionKey?: MessageKey;
  descriptionKey?: MessageKey;
  ctaTextKey?: MessageKey;
  typeKey?: MessageKey;
}

export const servicesData: ServiceData[] = [
  {
    id: "jarvis-suite",
    href: ROUTES.JARVIS.SUITE,
    title: "JARVIS AI Suite",
    headerDescription:
      "Domain-specific generative AI agent for every construction stakeholder.",
    tagline: "Generative AI for Builders",
    description:
      "Automates 99.8% of invoice scanning, parses tenders instantly, and generates 500,000+ design variants in seconds.",
    ctaText: "Explore Suite",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop",
    type: "AI Platform",
    icon: Brain,
    gridArea: "md:col-span-12 lg:col-span-8",
    height: "h-120 md:h-[32rem]",
    titleKey: "services_card_jarvis_suite_title",
    headerDescriptionKey: "services_card_jarvis_suite_header",
    descriptionKey: "services_card_jarvis_suite_description",
    ctaTextKey: "services_card_jarvis_suite_cta",
    typeKey: "services_card_jarvis_suite_type",
  },
  {
    id: "jarvis-pm",
    href: ROUTES.JARVIS.JPM,
    title: "JARVIS Project Management",
    headerDescription: "End-to-end acceleration for Belt and Road megaprojects.",
    tagline: "Nation-Scale Orchestration",
    description:
      "Delivers 30-45% faster timelines and 71% fewer defects by fusing Hong Kong precision with China's MiC scale.",
    ctaText: "Explore JPM",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop",
    type: "Management",
    icon: Kanban,
    gridArea: "md:col-span-6 lg:col-span-4",
    height: "h-120 md:h-[32rem]",
    titleKey: "services_card_jarvis_pm_title",
    headerDescriptionKey: "services_card_jarvis_pm_header",
    descriptionKey: "services_card_jarvis_pm_description",
    ctaTextKey: "services_card_jarvis_pm_cta",
    typeKey: "services_card_jarvis_pm_type",
  },
  {
    id: "bim-consultancy",
    href: ROUTES.BIM_CONSULTANCY,
    title: "BIM Consultancy",
    headerDescription:
      "Award-winning BIM implementation: modelling, 4D/5D simulation.",
    tagline: "Award-Winning Implementation",
    description:
      "Full-lifecycle modelling and ISO 19650 compliance ensuring seamless data flow across complex challenges.",
    ctaText: "Explore BIM",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop",
    type: "Consultancy",
    icon: Box,
    gridArea: "md:col-span-6 lg:col-span-4",
    height: "h-110",
    titleKey: "services_card_bim_title",
    headerDescriptionKey: "services_card_bim_header",
    descriptionKey: "services_card_bim_description",
    ctaTextKey: "services_card_bim_cta",
    typeKey: "services_card_bim_type",
  },
  {
    id: "project-finance",
    href: ROUTES.PROJECT_FINANCE,
    title: "Project Finance",
    headerDescription:
      "Bankable transparency for multilateral financial institutions.",
    tagline: "Bankable Transparency",
    description:
      "Unlocking capital with real-time credit ratings and 360° visibility for absolute digital certainty.",
    ctaText: "Explore Finance",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop",
    type: "Finance",
    icon: Banknote,
    gridArea: "md:col-span-6 lg:col-span-4",
    height: "h-110",
    titleKey: "services_card_finance_title",
    headerDescriptionKey: "services_card_finance_header",
    descriptionKey: "services_card_finance_description",
    ctaTextKey: "services_card_finance_cta",
    typeKey: "services_card_finance_type",
  },
  {
    id: "venture-investments",
    href: ROUTES.VENTURE_INVESTMENTS,
    title: "Venture Investments",
    headerDescription:
      "Equity + global distribution for frontier technology.",
    tagline: "Strategic Capital",
    description:
      "De-risking and accelerating AI factories and renewable grids via 2,600 live project testbeds.",
    ctaText: "Explore Ventures",
    image:
      "https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=1000&auto=format&fit=crop",
    type: "Investment",
    icon: Rocket,
    gridArea: "md:col-span-12 lg:col-span-4",
    height: "h-110",
    titleKey: "services_card_venture_title",
    headerDescriptionKey: "services_card_venture_header",
    descriptionKey: "services_card_venture_description",
    ctaTextKey: "services_card_venture_cta",
    typeKey: "services_card_venture_type",
  },
];

export type ServiceTab = "JPM" | "BIM" | "VENTURES" | "FINANCE";

export type ServiceSeoKey = "jpm" | "bim" | "venture" | "finance";

export interface ServiceContent {
  statsIntro: string;
  hero: {
    title: string;
    subTitle: string;
    desc: string;
    tag: string;
    img: string;
  };
  narrative: {
    label: string;
    lead: string;
    sub: string;
    p1: string;
    p2: string;
  };
  timeline?: {
    heading: string;
    items: { year: string; title: string; desc: string; isNow?: boolean }[];
  };
  engine: { id: string; title: string; desc: string }[];
  stats: {
    intro: string;
    label: string;
    main: { val: string; label: string };
    grid: { val: string; label: string }[];
    comparison?: { before: string; after: string; label: string }[];
  };
  gallery: {
    title: string;
    meta: string;
    items: { id: string; loc: string; title: string; desc: string; metric: string; img: string }[];
  };
}

interface ServiceContentI18nKeys {
  statsIntro: MessageKey;
  hero: {
    title: MessageKey;
    subTitle: MessageKey;
    desc: MessageKey;
    tag: MessageKey;
  };
  narrative: {
    label: MessageKey;
    lead: MessageKey;
    sub: MessageKey;
    p1: MessageKey;
    p2: MessageKey;
  };
  timeline?: {
    heading: MessageKey;
    items: { year: MessageKey; title: MessageKey; desc: MessageKey; isNow?: boolean }[];
  };
  engine: { title: MessageKey; desc: MessageKey }[];
  stats: {
    label: MessageKey;
    main: { label: MessageKey };
    grid: { label: MessageKey }[];
    comparison?: { label: MessageKey }[];
  };
  gallery: {
    title: MessageKey;
    meta: MessageKey;
    items: { title: MessageKey; desc: MessageKey; metric?: MessageKey }[];
  };
}

type ServiceMetaEntry = {
  seoKey: ServiceSeoKey;
  title: string;
  description: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
};

export const SERVICE_CONTENT: Record<ServiceTab, ServiceContent> = {
  JPM: {
    statsIntro: "service_jpm_stats_intro",
    hero: {
      title: "JPM",
      subTitle: "Project Management",
      desc: "Building the backbone of emerging economies.",
      tag: "Hong Kong Precision x China Scale",
      img: "/images/view1.png",
    },
    narrative: {
      label: "The Methodology",
      lead: "Traditional models fail.",
      sub: "Nation-scale infrastructure orchestration.",
      p1: "JPM fuses Hong Kong Professional Services with China's 8,000+ vetted MiC suppliers. We don't just find suppliers; we match them on technical, experience, financial, and cultural fit to ensure execution safety.",
      p2: "This is Hong Kong's strategic bridge to Belt & Road. Our real-time digital twins predict risks 30 days ahead, condensing complex site data into 3-minute executive dashboards for instant decision-making.",
    },
    engine: [
      { id: "01", title: "HK Professional Services", desc: "Bilingual PM teams translating global standards into China-executable specs. Dual compliance expertise." },
      { id: "02", title: "AI Intelligence", desc: "Real-time digital twin predicting risks 30 days ahead at 89% accuracy. 3-minute executive dashboards." },
      { id: "03", title: "8,000+ Suppliers", desc: "Vetted MiC supply chain with 4-step matching: technical, experience, financial, and cultural fit." },
      { id: "04", title: "Global Delivery", desc: "End-to-end management. 35-45% less waste and 25-35% lower emissions." },
    ],
    stats: {
      intro: "By the Numbers: Core Value Creation",
      label: "Performance Delta",
      main: { val: "70-80%", label: "TOTAL PROJECT COST (20-30% SAVINGS)" },
      grid: [
        { val: "-45%", label: "Delivery Time" },
        { val: "5%", label: "Defect Rate (vs 18%)" },
        { val: "19%", label: "Overruns (vs 68%)" },
        { val: "24m", label: "Cash Cycle (vs 36m)" },
      ],
      comparison: [
        { before: "68%", after: "19%", label: "Budget Overruns" },
        { before: "18%", after: "5%", label: "Defect Rate" },
        { before: "36m", after: "24m", label: "Cash Cycle" },
        { before: "100%", after: "55-70%", label: "Delivery Time" },
      ],
    },
    gallery: {
      title: "Africa 2025",
      meta: "HKD 13,000,000,000+ Signed",
      items: [
        { id: "01", loc: "CAMEROON", title: "National Engineering Initiative", desc: "28,000-unit City of Great Achievement + South Province Government HQ. Presidential approval secured.", metric: "HKD 760M", img: "/images/view2.png" },
        { id: "02", loc: "NIGERIA", title: "Abuja Smart City", desc: "143-hectare luxury complex. MoU with Ministry of Housing. Speaker + 13 Governors engaged.", metric: "HKD 500M", img: "/images/view3.png" },
      ],
    },
  },
  BIM: {
    statsIntro: "service_stats_intro",
    hero: {
      title: "BIM",
      subTitle: "Consultancy",
      desc: "Mandated digital transformation.",
      tag: "Model | Coordinate | Comply",
      img: "/images/view2.png",
    },
    narrative: {
      label: "The Mandate",
      lead: "Drawings are dead.",
      sub: "ContractBIM is binding.",
      p1: "Hong Kong's BIM journey is precise: From TC(W) No. 7/2017 to the new TC(W) No. 1/2025 making BIM models contractually binding. We have been there every step.",
      p2: "isBIM delivers more than models; we provide on-site secondment of CIC-certified professionals. Our automated quantity take-offs and BIM-embedded BOQs ensure 5D cost accuracy, eliminating 'which drawing is correct?' arguments.",
    },
    timeline: {
      heading: "Policy Evolution",
      items: [
        { year: "2017", title: "TC(W) No. 7/2017", desc: "Mandatory BIM for public works > HK$30M." },
        { year: "2020", title: "Asset Management", desc: "Scope expanded to investigation & feasibility." },
        { year: "2025", title: "TC(W) No. 1/2025", desc: "BIM models become contractually binding." },
        { year: "Now", title: "ISO 19650", desc: "Full compliance & CDE setup delivered.", isNow: true },
      ],
    },
    engine: [
      { id: "01", title: "Full BIM Modelling", desc: "LOD 300-500, Revit/IFC standards, and clash-free coordination for zero ambiguity." },
      { id: "02", title: "On-site Secondment", desc: "CIC/BSI-certified BIM Managers & Coordinators deployed directly to your project team." },
      { id: "03", title: "End-to-End Consultancy", desc: "From BEP creation and CDE setup to rigorous ISO 19650 compliance audits." },
      { id: "04", title: "Tendering Support", desc: "BIM-embedded BOQs, 5D cost models, and full ContractBIM compliance support." },
    ],
    stats: {
      intro: "Traditional construction is plagued by uncertainty. JARVIS delivers mathematical certainty.",
      label: "Impact Analysis",
      main: { val: "75%", label: "REWORK REDUCTION" },
      grid: [
        { val: "100%", label: "Mandate Ready" },
        { val: "72%", label: "Budget Accuracy" },
        { val: "-45%", label: "Timeline (4D Scheduling)" },
        { val: "2,600+", label: "Proven Projects" },
      ],
    },
    gallery: {
      title: "Proven Assets",
      meta: "1.2 Billion Sq.Ft Delivered",
      items: [
        { id: "01", loc: "HONG KONG", title: "M+ Museum", desc: "Delivering complex geometry coordination and asset management standards for a world-class cultural landmark.", metric: "ISO 19650", img: "/images/view3.png" },
        { id: "02", loc: "INFRASTRUCTURE", title: "HKIA Expansion", desc: "Full lifecycle BIM implementation from investigation to 4D construction simulation for aviation hubs.", metric: "CIC GOLD", img: "/images/view4.png" },
      ],
    },
  },
  VENTURES: {
    statsIntro: "service_stats_intro",
    hero: {
      title: "VENTURES",
      subTitle: "Construction Tech",
      desc: "Globalising construction tech.",
      tag: "Physics + Intelligence",
      img: "/images/view3.png",
    },
    narrative: {
      label: "The Playbook",
      lead: "VCs lack distribution.",
      sub: "We are the pipeline.",
      p1: "We provide first institutional capital to teams re-engineering construction: vertical AI, robotics, ESG tech, and digital twins. Geography-agnostic at the earliest inflection points.",
      p2: "From first pilot in Hong Kong to multi-country revenue in months. Backed by on-the-ground teams in Asia, Africa, and the Middle East, we eliminate market entry friction.",
    },
    engine: [
      { id: "01", title: "Battle-Tested Distribution", desc: "20 years of domain expertise and live JARVIS data become your unfair advantage." },
      { id: "02", title: "Conviction-Led Investment", desc: "First institutional capital for vertical AI, robotics, and digital twins." },
      { id: "03", title: "In-Kind Incubation", desc: "Accelerating product-market fit inside our own global pipeline of 2,600+ projects." },
      { id: "04", title: "Global Scale", desc: "Fastest route to AI-ready data centers in SE Asia and housing in Africa." },
    ],
    stats: {
      intro: "Traditional construction is plagued by uncertainty. JARVIS delivers mathematical certainty.",
      label: "Ecosystem Scale",
      main: { val: "2,600+", label: "LIVE PROJECTS ACCESS" },
      grid: [
        { val: "1.2B", label: "Sq.Ft Built Assets" },
        { val: "8,000+", label: "Supplier Network" },
        { val: "20 Yrs", label: "Domain Expertise" },
        { val: "Global", label: "Asia | Africa | Middle East" },
      ],
    },
    gallery: {
      title: "The Portfolio",
      meta: "Re-engineering Construction",
      items: [
        { id: "01", loc: "VERTICAL AI", title: "Autonomous Agents", desc: "Backing teams that automate complex construction workflows through generative design and scheduling.", metric: "SEED TO SERIES A", img: "/images/view1.png" },
        { id: "02", loc: "HARDWARE", title: "Modular Robotics", desc: "Industrializing on-site assembly with precision robotics and computer vision systems.", metric: "GLOBAL PILOTS", img: "/images/view2.png" },
        { id: "03", loc: "SMART CITIES", title: "Urban Operating Systems", desc: "Deploying city-scale digital twins and IoT networks to manage energy grid and traffic flows in emerging megacities.", metric: "SERIES B", img: "/images/view4.png" },
      ],
    },
  },
  FINANCE: {
    statsIntro: "service_stats_intro",
    hero: {
      title: "FINANCE",
      subTitle: "Infrastructure Capital",
      desc: "Infrastructure Finance.",
      tag: "Live Data = Financial Close",
      img: "/images/view4.png",
    },
    narrative: {
      label: "Risk & Transparency",
      lead: "Risk is opaque.",
      sub: "Data makes it visible.",
      p1: "Billions in viable projects (Data Centres, Renewables, Hospitals, Smart Cities) stay stranded due to non-commercial risk. We sit at the centre of a global network of PE funds, DFIs, Export-Credit Agencies (ECAs), and Sovereign Investors.",
      p2: "We deliver live digital twins and 30-day-ahead risk forecasts. Our in-kind investment in credit-enhancement design and bankable feasibility studies de-risks projects before a dollar is committed.",
    },
    engine: [
      { id: "01", title: "Global Capital Network", desc: "Access to leading PE funds, DFIs, export-credit agencies, and sovereign investors." },
      { id: "02", title: "Live Digital Twins", desc: "Real-time monitoring of every cost and schedule parameter." },
      { id: "03", title: "In-Kind Investment", desc: "We fund bankable feasibility studies and financial modelling to de-risk projects early." },
      { id: "04", title: "30-Day Forecasting", desc: "Audited cost curves and risk prediction giving lenders certainty." },
    ],
    stats: {
      intro: "Traditional construction is plagued by uncertainty. JARVIS delivers mathematical certainty.",
      label: "Risk Mitigation",
      main: { val: "T+1", label: "REAL-TIME REPORTING" },
      grid: [
        { val: "30 Days", label: "Risk Forecast Horizon" },
        { val: "0", label: "Blind Spots" },
        { val: "100%", label: "Bankable Studies" },
        { val: "AAA", label: "Standard Compliance" },
      ],
    },
    gallery: {
      title: "Asset Classes",
      meta: "Making Infrastructure Bankable",
      items: [
        { id: "01", loc: "GREEN ENERGY", title: "Renewable Power", desc: "Structuring finance for solar and wind transmission grids in emerging markets.", metric: "ESG COMPLIANT", img: "/images/view2.png" },
        { id: "02", loc: "DIGITAL INFRA", title: "Data Centres", desc: "Providing cost certainty for hyperscale data center construction across Southeast Asia.", metric: "TIER III+", img: "/images/view3.png" },
      ],
    },
  },
};

const SERVICE_CONTENT_I18N_KEYS: Record<ServiceTab, ServiceContentI18nKeys> = {
  JPM: {
    statsIntro: "service_stats_intro",
    hero: {
      title: "service_jpm_hero_title",
      subTitle: "service_jpm_hero_subtitle",
      desc: "service_jpm_hero_desc",
      tag: "service_jpm_hero_tag",
    },
    narrative: {
      label: "service_jpm_narrative_label",
      lead: "service_jpm_narrative_lead",
      sub: "service_jpm_narrative_sub",
      p1: "service_jpm_narrative_p1",
      p2: "service_jpm_narrative_p2",
    },
    engine: [
      { title: "service_jpm_engine_1_title", desc: "service_jpm_engine_1_desc" },
      { title: "service_jpm_engine_2_title", desc: "service_jpm_engine_2_desc" },
      { title: "service_jpm_engine_3_title", desc: "service_jpm_engine_3_desc" },
      { title: "service_jpm_engine_4_title", desc: "service_jpm_engine_4_desc" },
    ],
    stats: {
      label: "service_jpm_stats_label",
      main: { label: "service_jpm_stats_main_label" },
      grid: [
        { label: "service_jpm_stats_grid_1_label" },
        { label: "service_jpm_stats_grid_2_label" },
        { label: "service_jpm_stats_grid_3_label" },
        { label: "service_jpm_stats_grid_4_label" },
      ],
      comparison: [
        { label: "service_jpm_comparison_overruns" },
        { label: "service_jpm_comparison_defects" },
        { label: "service_jpm_comparison_cash" },
        { label: "service_jpm_comparison_delivery" },
      ],
    },
    gallery: {
      title: "service_jpm_gallery_title",
      meta: "service_jpm_gallery_meta",
      items: [
        {
          title: "service_jpm_gallery_item_1_title",
          desc: "service_jpm_gallery_item_1_desc",
          metric: "service_jpm_gallery_item_1_metric",
        },
        {
          title: "service_jpm_gallery_item_2_title",
          desc: "service_jpm_gallery_item_2_desc",
          metric: "service_jpm_gallery_item_2_metric",
        },
      ],
    },
  },
  BIM: {
    statsIntro: "service_stats_intro",
    hero: {
      title: "service_bim_hero_title",
      subTitle: "service_bim_hero_subtitle",
      desc: "service_bim_hero_desc",
      tag: "service_bim_hero_tag",
    },
    narrative: {
      label: "service_bim_narrative_label",
      lead: "service_bim_narrative_lead",
      sub: "service_bim_narrative_sub",
      p1: "service_bim_narrative_p1",
      p2: "service_bim_narrative_p2",
    },
    timeline: {
      heading: "service_bim_timeline_heading",
      items: [
        { year: "service_bim_timeline_item_1_year", title: "service_bim_timeline_item_1_title", desc: "service_bim_timeline_item_1_desc" },
        { year: "service_bim_timeline_item_2_year", title: "service_bim_timeline_item_2_title", desc: "service_bim_timeline_item_2_desc" },
        { year: "service_bim_timeline_item_3_year", title: "service_bim_timeline_item_3_title", desc: "service_bim_timeline_item_3_desc" },
        { year: "service_bim_timeline_item_4_year", title: "service_bim_timeline_item_4_title", desc: "service_bim_timeline_item_4_desc" },
      ],
    },
    engine: [
      { title: "service_bim_engine_1_title", desc: "service_bim_engine_1_desc" },
      { title: "service_bim_engine_2_title", desc: "service_bim_engine_2_desc" },
      { title: "service_bim_engine_3_title", desc: "service_bim_engine_3_desc" },
      { title: "service_bim_engine_4_title", desc: "service_bim_engine_4_desc" },
    ],
    stats: {
      label: "service_bim_stats_label",
      main: { label: "service_bim_stats_main_label" },
      grid: [
        { label: "service_bim_stats_grid_1_label" },
        { label: "service_bim_stats_grid_2_label" },
        { label: "service_bim_stats_grid_3_label" },
        { label: "service_bim_stats_grid_4_label" },
      ],
    },
    gallery: {
      title: "service_bim_gallery_title",
      meta: "service_bim_gallery_meta",
      items: [
        {
          title: "service_bim_gallery_item_1_title",
          desc: "service_bim_gallery_item_1_desc",
          metric: "service_bim_gallery_item_1_metric",
        },
        {
          title: "service_bim_gallery_item_2_title",
          desc: "service_bim_gallery_item_2_desc",
          metric: "service_bim_gallery_item_2_metric",
        },
      ],
    },
  },
  VENTURES: {
    statsIntro: "service_stats_intro",
    hero: {
      title: "service_venture_hero_title",
      subTitle: "service_venture_hero_subtitle",
      desc: "service_venture_hero_desc",
      tag: "service_venture_hero_tag",
    },
    narrative: {
      label: "service_venture_narrative_label",
      lead: "service_venture_narrative_lead",
      sub: "service_venture_narrative_sub",
      p1: "service_venture_narrative_p1",
      p2: "service_venture_narrative_p2",
    },
    engine: [
      { title: "service_venture_engine_1_title", desc: "service_venture_engine_1_desc" },
      { title: "service_venture_engine_2_title", desc: "service_venture_engine_2_desc" },
      { title: "service_venture_engine_3_title", desc: "service_venture_engine_3_desc" },
      { title: "service_venture_engine_4_title", desc: "service_venture_engine_4_desc" },
    ],
    stats: {
      label: "service_venture_stats_label",
      main: { label: "service_venture_stats_main_label" },
      grid: [
        { label: "service_venture_stats_grid_1_label" },
        { label: "service_venture_stats_grid_2_label" },
        { label: "service_venture_stats_grid_3_label" },
        { label: "service_venture_stats_grid_4_label" },
      ],
    },
    gallery: {
      title: "service_venture_gallery_title",
      meta: "service_venture_gallery_meta",
      items: [
        {
          title: "service_venture_gallery_item_1_title",
          desc: "service_venture_gallery_item_1_desc",
          metric: "service_venture_gallery_item_1_metric",
        },
        {
          title: "service_venture_gallery_item_2_title",
          desc: "service_venture_gallery_item_2_desc",
          metric: "service_venture_gallery_item_2_metric",
        },
        {
          title: "service_venture_gallery_item_3_title",
          desc: "service_venture_gallery_item_3_desc",
          metric: "service_venture_gallery_item_3_metric",
        },
      ],
    },
  },
  FINANCE: {
    statsIntro: "service_stats_intro",
    hero: {
      title: "service_finance_hero_title",
      subTitle: "service_finance_hero_subtitle",
      desc: "service_finance_hero_desc",
      tag: "service_finance_hero_tag",
    },
    narrative: {
      label: "service_finance_narrative_label",
      lead: "service_finance_narrative_lead",
      sub: "service_finance_narrative_sub",
      p1: "service_finance_narrative_p1",
      p2: "service_finance_narrative_p2",
    },
    engine: [
      { title: "service_finance_engine_1_title", desc: "service_finance_engine_1_desc" },
      { title: "service_finance_engine_2_title", desc: "service_finance_engine_2_desc" },
      { title: "service_finance_engine_3_title", desc: "service_finance_engine_3_desc" },
      { title: "service_finance_engine_4_title", desc: "service_finance_engine_4_desc" },
    ],
    stats: {
      label: "service_finance_stats_label",
      main: { label: "service_finance_stats_main_label" },
      grid: [
        { label: "service_finance_stats_grid_1_label" },
        { label: "service_finance_stats_grid_2_label" },
        { label: "service_finance_stats_grid_3_label" },
        { label: "service_finance_stats_grid_4_label" },
      ],
    },
    gallery: {
      title: "service_finance_gallery_title",
      meta: "service_finance_gallery_meta",
      items: [
        {
          title: "service_finance_gallery_item_1_title",
          desc: "service_finance_gallery_item_1_desc",
          metric: "service_finance_gallery_item_1_metric",
        },
        {
          title: "service_finance_gallery_item_2_title",
          desc: "service_finance_gallery_item_2_desc",
          metric: "service_finance_gallery_item_2_metric",
        },
      ],
    },
  },
};

export const SERVICE_META: Record<ServiceTab, ServiceMetaEntry> = {
  JPM: {
    seoKey: "jpm",
    title: "JPM Project Management",
    description: "Bankable project delivery that fuses Hong Kong rigor with China scale for Belt & Road infrastructure.",
    titleKey: "service_jpm_meta_title",
    descriptionKey: "service_jpm_meta_description",
  },
  BIM: {
    seoKey: "bim",
    title: "BIM Consultancy",
    description: "Certified BIM delivery for 2,600+ projects with ISO 19650 compliance and mandate-ready workflows.",
    titleKey: "service_bim_meta_title",
    descriptionKey: "service_bim_meta_description",
  },
  VENTURES: {
    seoKey: "venture",
    title: "Venture Investments",
    description: "Conviction-led construction tech investments with instant distribution and live JARVIS data advantages.",
    titleKey: "service_venture_meta_title",
    descriptionKey: "service_venture_meta_description",
  },
  FINANCE: {
    seoKey: "finance",
    title: "Project Finance",
    description: "Infrastructure finance with live digital twin transparency, de-risking capital for emerging markets.",
    titleKey: "service_finance_meta_title",
    descriptionKey: "service_finance_meta_description",
  },
};

export function getLocalizedServiceContent(tab: ServiceTab): ServiceContent {
  const base = SERVICE_CONTENT[tab];
  const keys = SERVICE_CONTENT_I18N_KEYS[tab];

  return {
    statsIntro: translateMessage(keys.statsIntro, base.stats.intro),
    hero: {
      title: translateMessage(keys.hero.title, base.hero.title),
      subTitle: translateMessage(keys.hero.subTitle, base.hero.subTitle),
      desc: translateMessage(keys.hero.desc, base.hero.desc),
      tag: translateMessage(keys.hero.tag, base.hero.tag),
      img: base.hero.img,
    },
    narrative: {
      label: translateMessage(keys.narrative.label, base.narrative.label),
      lead: translateMessage(keys.narrative.lead, base.narrative.lead),
      sub: translateMessage(keys.narrative.sub, base.narrative.sub),
      p1: translateMessage(keys.narrative.p1, base.narrative.p1),
      p2: translateMessage(keys.narrative.p2, base.narrative.p2),
    },
    timeline: base.timeline
      ? {
          heading: translateMessage(keys.timeline?.heading, base.timeline.heading),
          items: base.timeline.items.map((item, idx) => ({
            year: translateMessage(keys.timeline?.items[idx]?.year, item.year),
            title: translateMessage(keys.timeline?.items[idx]?.title, item.title),
            desc: translateMessage(keys.timeline?.items[idx]?.desc, item.desc),
            isNow: item.isNow,
          })),
        }
      : undefined,
    engine: base.engine.map((item, idx) => ({
      ...item,
      title: translateMessage(keys.engine[idx]?.title, item.title),
      desc: translateMessage(keys.engine[idx]?.desc, item.desc),
    })),
    stats: {
      intro: translateMessage(keys.statsIntro, base.stats.intro),
      label: translateMessage(keys.stats.label, base.stats.label),
      main: {
        val: base.stats.main.val,
        label: translateMessage(keys.stats.main.label, base.stats.main.label),
      },
      grid: base.stats.grid.map((item, idx) => ({
        val: item.val,
        label: translateMessage(keys.stats.grid[idx]?.label, item.label),
      })),
      comparison: base.stats.comparison?.map((item, idx) => ({
        ...item,
        label: translateMessage(keys.stats.comparison?.[idx]?.label, item.label),
      })),
    },
    gallery: {
      title: translateMessage(keys.gallery.title, base.gallery.title),
      meta: translateMessage(keys.gallery.meta, base.gallery.meta),
      items: base.gallery.items.map((item, idx) => ({
        ...item,
        title: translateMessage(keys.gallery.items[idx]?.title, item.title),
        desc: translateMessage(keys.gallery.items[idx]?.desc, item.desc),
        metric: translateMessage(keys.gallery.items[idx]?.metric, item.metric),
      })),
    },
  };
}

export function getLocalizedServiceMeta(tab: ServiceTab): ServiceMetaEntry {
  const meta = SERVICE_META[tab];

  return {
    ...meta,
    title: translateMessage(meta.titleKey, meta.title),
    description: translateMessage(meta.descriptionKey, meta.description),
  };
}
