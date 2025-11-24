"use client";

import { useLocale } from "@/lib/i18n/index";
import { useRouter, usePathname } from "@/lib/i18n";
import { availableLanguageTags, type AvailableLanguageTag } from "@/paraglide/runtime";
import { motion } from "framer-motion";

/**
 * LocaleSwitcher Component
 *
 * Minimalist professional language switcher for EN/ZH
 * Uses localized navigation APIs from @inlang/paraglide-next
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

    // Use localized router.push with locale option
    // This automatically handles URL construction and locale prefix
    router.push(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center">
      {availableLanguageTags.map((locale, index) => (
        <div key={locale} className="flex items-center">
          <motion.button
            onClick={() => switchLocale(locale)}
            whileHover={{ opacity: 0.8 }}
            whileTap={{ scale: 0.95 }}
            className={`
              text-sm font-medium transition-all duration-200
              ${
                locale === currentLocale
                  ? "text-white"
                  : "text-white/50 hover:text-white/70"
              }
            `}
          >
            {localeLabels[locale]}
          </motion.button>

          {/* Separator */}
          {index < availableLanguageTags.length - 1 && (
            <span className="mx-2 text-white/30">|</span>
          )}
        </div>
      ))}
    </div>
  );
}
