"use client";

import { useLocale } from "@/lib/i18n/index";
import { useRouter, usePathname } from "@/lib/i18n";
import { type AvailableLanguageTag } from "@/paraglide/runtime";
import { m } from "@/components/motion/lazy-motion";

/**
 * LocaleSwitcher Component
 *
 * Toggle switch design for EN/ZH language switching
 * - Clear visual metaphor for binary state selection
 * - Larger touch targets for better mobile UX
 * - Enhanced hover effects for desktop interaction
 * Uses LocaleContext to get current locale (Level 3 implementation)
 */

const localeLabels: Record<AvailableLanguageTag, string> = {
  en: "EN",
  zh: "中文",
};

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale(); // Use Context instead of languageTag()

  const switchLocale = (newLocale: AvailableLanguageTag) => {
    if (newLocale === currentLocale) return;

    // Use router.replace to switch locale
    // - replace: Updates URL without adding to history (cleaner navigation)
    // - scroll: false - Maintains user's scroll position during language switch
    // Note: This will trigger the page transition animation as part of the branded experience
    router.replace(pathname, { locale: newLocale, scroll: false });
  };

  return (
    <div className="relative inline-flex items-center w-[100px] h-10 bg-white/5 border border-white/10 rounded-lg p-1 backdrop-blur-sm">
      {/* Sliding background indicator - occupies 50% of container width */}
      <m.div
        className="absolute left-1 top-1 bottom-1 bg-white/20 rounded-md shadow-sm"
        style={{ width: "calc(50% - 4px)" }}
        initial={false}
        animate={{
          x: currentLocale === "en" ? 0 : "100%",
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 35,
        }}
      />

      {/* EN Button */}
      <m.button
        onClick={() => switchLocale("en")}
        whileHover={{}}
        whileTap={{ scale: 0.95 }}
        className={`
          relative z-10 w-1/2 h-full flex items-center justify-center
          text-xs font-medium rounded-md
          transition-all duration-300
          ${
            currentLocale === "en"
              ? "text-white font-bold"
              : "text-white/50 hover:text-white"
          }
        `}
        aria-label="Switch to English"
        aria-pressed={currentLocale === "en"}
      >
        {localeLabels.en}
      </m.button>

      {/* ZH Button */}
      <m.button
        onClick={() => switchLocale("zh")}
        whileHover={{}}
        whileTap={{ scale: 0.95 }}
        className={`
          relative z-10 w-1/2 h-full flex items-center justify-center
          text-xs font-medium rounded-md
          transition-all duration-300
          ${
            currentLocale === "zh"
              ? "text-white font-bold"
              : "text-white/50 hover:text-white"
          }
        `}
        aria-label="切換至中文"
        aria-pressed={currentLocale === "zh"}
      >
        {localeLabels.zh}
      </m.button>
    </div>
  );
}
