'use client';

import Image from 'next/image';
import { m } from '@/components/motion/lazy-motion';
import { useMotionValue, useTransform } from 'framer-motion';
import { Eye, Shield, Database, FileSignature, Leaf } from 'lucide-react';
import * as messages from '@/paraglide/messages';

/**
 * MonitorZone Component
 * Bento grid layout showcasing 5 monitoring products:
 * - Eagle Eye (2×2 large card with image)
 * - SSSS, CDCP, DWSS, Assets (1×1 cards with color accents)
 */
export function MonitorZone() {
  return (
    <section id="monitor" className="py-32 bg-[#0A0C10] relative overflow-hidden">
      {/* Floor Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="text-teal-500 font-mono text-sm mb-2 tracking-widest">
            {messages.jarvis_suite_zone2_label()}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {messages.jarvis_suite_zone2_title()}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
            {messages.jarvis_suite_zone2_subtitle()}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[600px]">
          <BentoCard
            colSpan="md:col-span-2"
            rowSpan="md:row-span-2"
            bgImage="https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=2071&auto=format&fit=crop"
            icon={<Eye className="w-6 h-6 text-teal-400" />}
            title={messages.jarvis_suite_eagle_title()}
            desc={messages.jarvis_suite_eagle_desc()}
            color="teal"
          />
          <BentoCard
            colSpan="md:col-span-1"
            rowSpan="md:row-span-1"
            icon={<Shield className="w-8 h-8 text-orange-500" />}
            title={messages.jarvis_suite_ssss_title()}
            sub={messages.jarvis_suite_ssss_sub()}
            color="orange"
          />
          <BentoCard
            colSpan="md:col-span-1"
            rowSpan="md:row-span-1"
            icon={<Database className="w-8 h-8 text-blue-500" />}
            title={messages.jarvis_suite_cdcp_title()}
            sub={messages.jarvis_suite_cdcp_sub()}
            color="blue"
          />
          <BentoCard
            colSpan="md:col-span-1"
            rowSpan="md:row-span-1"
            icon={<FileSignature className="w-8 h-8 text-purple-500" />}
            title={messages.jarvis_suite_dwss_title()}
            sub={messages.jarvis_suite_dwss_sub()}
            color="purple"
          />
          <BentoCard
            colSpan="md:col-span-1"
            rowSpan="md:row-span-1"
            icon={<Leaf className="w-8 h-8 text-green-500" />}
            title={messages.jarvis_suite_assets_title()}
            sub={messages.jarvis_suite_assets_sub()}
            color="green"
          />
        </div>
      </div>
    </section>
  );
}

/**
 * BentoCard Component
 * Individual card in the bento grid
 */
interface BentoCardProps {
  colSpan: string;
  rowSpan: string;
  bgImage?: string;
  icon: React.ReactNode;
  title: string;
  desc?: string;
  sub?: string;
  color: 'teal' | 'orange' | 'blue' | 'purple' | 'green';
}

// Static color mapping for Tailwind (avoid dynamic class generation)
const colorStyles: Record<
  string,
  { bg: string; gradient: string; hoverGradient: string }
> = {
  teal: {
    bg: 'bg-teal-500/10',
    gradient: 'from-teal-900/10',
    hoverGradient: 'group-hover:from-teal-900/30'
  },
  orange: {
    bg: 'bg-orange-500/10',
    gradient: 'from-orange-900/10',
    hoverGradient: 'group-hover:from-orange-900/30'
  },
  blue: {
    bg: 'bg-blue-500/10',
    gradient: 'from-blue-900/10',
    hoverGradient: 'group-hover:from-blue-900/30'
  },
  purple: {
    bg: 'bg-purple-500/10',
    gradient: 'from-purple-900/10',
    hoverGradient: 'group-hover:from-purple-900/30'
  },
  green: {
    bg: 'bg-green-500/10',
    gradient: 'from-green-900/10',
    hoverGradient: 'group-hover:from-green-900/30'
  }
};

function BentoCard({ colSpan, rowSpan, bgImage, icon, title, desc, sub, color }: BentoCardProps) {
  const styles = colorStyles[color] || colorStyles.teal;

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.div
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d'
      }}
      whileHover={{ scale: 0.98 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${colSpan} ${rowSpan} group relative overflow-hidden rounded-2xl border border-white/10 bg-[#121418] cursor-pointer shadow-lg`}
    >
      {bgImage && (
        <>
          <Image
            src={bgImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-50 grayscale group-hover:grayscale-0"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
        </>
      )}

      <div
        className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} to-transparent ${styles.hoverGradient} transition-all duration-500`}
      />

      {/* 3D inner shadow for depth */}
      <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.3)] rounded-2xl pointer-events-none" />

      <div className="p-8 h-full flex flex-col justify-between relative z-10">
        <div className="relative w-fit">
          <div className={`p-2 rounded-lg ${styles.bg} backdrop-blur-sm border border-white/5`}>
            {icon}
          </div>
        </div>
        <div>
          <h4 className="text-xl font-bold mb-1 text-white">{title}</h4>
          {sub && <p className="text-xs text-gray-500 font-mono tracking-widest">{sub}</p>}
          {desc && <p className="text-gray-300 text-sm mt-2 font-light">{desc}</p>}
        </div>
      </div>
    </m.div>
  );
}
