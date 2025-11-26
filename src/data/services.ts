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
import type * as messages from "@/paraglide/messages";

type MessageKey = keyof typeof messages;

export interface ServiceData {
  id: string;
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
    title: "JARVIS Project Management",
    headerDescription: "End-to-end acceleration for Belt and Road megaprojects.",
    tagline: "Nation-Scale Orchestration",
    description:
      "Delivers 30–45% faster timelines and 71% fewer defects by fusing Hong Kong precision with China's MiC scale.",
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
