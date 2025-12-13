import { headers } from "next/headers";
import { LanguageProvider } from "@inlang/paraglide-next";
import {
  sourceLanguageTag,
  setLanguageTag,
  isAvailableLanguageTag,
  type AvailableLanguageTag,
} from "@/paraglide/runtime";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import { AppProviders } from "@/providers/app-providers";
import { Topbar } from "@/components/layout/topbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { sanityFetch, MENU_LATEST_NEWS_QUERY } from "@/sanity/lib";
import type { MenuNewsPreview } from "@/components/layout/menu-overlay";

export default async function WebsiteLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const headerLocale = headersList.get("x-language-tag");
  const locale = (isAvailableLanguageTag(headerLocale) ? headerLocale : sourceLanguageTag) as AvailableLanguageTag;

  // Sync paraglide locale for downstream translations.
  setLanguageTag(() => locale);

  const menuNews = await sanityFetch<MenuNewsPreview[]>({
    query: MENU_LATEST_NEWS_QUERY,
    tags: ["news"],
    cache: "no-store",
  }).catch(() => [] as MenuNewsPreview[]);

  return (
    <LanguageProvider>
      <LocaleProvider locale={locale}>
        <AppProviders>
          <div className="min-h-screen bg-zinc-100 text-zinc-900 footer-alliance-font">
            <Topbar newsPreview={menuNews} />
            {children}
            <Footer />
          </div>
          <Toaster />
        </AppProviders>
      </LocaleProvider>
    </LanguageProvider>
  );
}
