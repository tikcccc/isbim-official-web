"use client";

import { useEffect, useState } from "react";
import { m } from "@/components/motion/lazy-motion";
import { useLocale } from "@/lib/i18n/index";
import { useRouter, usePathname } from "@/lib/i18n";
import { type AvailableLanguageTag } from "@/paraglide/runtime";
import { setLanguageTag } from "@/paraglide/runtime";

const localeLabels: Record<AvailableLanguageTag, string> = {
  en: "EN",
  zh: "中文",
};

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname(); // Returns canonical pathname WITHOUT locale prefix
  const currentLocale = useLocale();
  const [activeLocale, setActiveLocale] =
    useState<AvailableLanguageTag>(currentLocale);

  // Sync activeLocale with currentLocale from context
  useEffect(() => {
    setActiveLocale(currentLocale);
  }, [currentLocale]);

  const switchLocale = (newLocale: AvailableLanguageTag) => {
    if (newLocale === activeLocale) return;

    // Optimistically update UI
    setActiveLocale(newLocale);

    // Update Paraglide language tag
    setLanguageTag(newLocale);

    // Get current search params
    const search =
      typeof window !== "undefined" ? window.location.search : "";

    // Paraglide's router.replace automatically handles locale prefixing
    // pathname is already canonical (without locale), so we just pass it directly
    router.replace(`${pathname}${search}`, { scroll: false });
  };

  return (
    <div className="relative inline-flex items-center w-[100px] h-10 bg-white/5 border border-white/10 rounded-lg p-1 backdrop-blur-sm">
      <m.div
        className="absolute left-1 top-1 bottom-1 bg-white/20 rounded-md shadow-sm"
        style={{ width: "calc(50% - 4px)" }}
        initial={false}
        animate={{
          x: activeLocale === "en" ? 0 : "100%",
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 35,
        }}
      />

      <m.button
        onClick={() => switchLocale("en")}
        whileHover={{ scale: activeLocale === "en" ? 1 : 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          relative z-10 w-1/2 h-full flex items-center justify-center
          text-xs font-medium rounded-md
          transition-all duration-300
          ${
            activeLocale === "en"
              ? "text-white font-bold"
              : "text-white/50 hover:text-white/70"
          }
        `}
        aria-label="Switch to English"
        aria-pressed={activeLocale === "en"}
      >
        {localeLabels.en}
      </m.button>

      <m.button
        onClick={() => switchLocale("zh")}
        whileHover={{ scale: activeLocale === "zh" ? 1 : 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          relative z-10 w-1/2 h-full flex items-center justify-center
          text-xs font-medium rounded-md
          transition-all duration-300
          ${
            activeLocale === "zh"
              ? "text-white font-bold"
              : "text-white/50 hover:text-white/70"
          }
        `}
        aria-label="切換至中文"
        aria-pressed={activeLocale === "zh"}
      >
        {localeLabels.zh}
      </m.button>
    </div>
  );
}
