"use client";

import { useRouter, usePathname } from "next/navigation";
import { getLocale, locales, type Locale } from "@/paraglide/runtime";
import { motion } from "framer-motion";

/**
 * LocaleSwitcher Component
 *
 * Minimalist professional language switcher for EN/ZH
 */

const localeLabels: Record<Locale, string> = {
  en: "EN",
  zh: "中文",
};

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = getLocale();

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    // Remove current locale from pathname and add new locale
    const pathWithoutLocale = pathname.replace(/^\/(en|zh)/, "");
    const newPath = `/${newLocale}${pathWithoutLocale || ""}`;

    // Set locale cookie for persistence
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`; // 1 year

    // Navigate to new locale
    router.push(newPath);
  };

  return (
    <div className="flex items-center">
      {locales.map((locale, index) => (
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
          {index < locales.length - 1 && (
            <span className="mx-2 text-white/30">|</span>
          )}
        </div>
      ))}
    </div>
  );
}
