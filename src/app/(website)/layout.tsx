import { headers } from "next/headers";
import { LanguageProvider } from "@inlang/paraglide-next";
import { sourceLanguageTag, setLanguageTag } from "@/paraglide/runtime";
import type { AvailableLanguageTag } from "@/paraglide/runtime";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import { AppProviders } from "@/providers/app-providers";
import { Topbar } from "@/components/layout/topbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";

export default async function WebsiteLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const locale = (headersList.get("x-language-tag") ?? sourceLanguageTag) as AvailableLanguageTag;

  // Sync paraglide locale for downstream translations.
  setLanguageTag(() => locale);

  return (
    <LanguageProvider>
      <LocaleProvider locale={locale}>
        <AppProviders>
          <div className="min-h-screen bg-zinc-100 text-zinc-900 footer-alliance-font">
            <Topbar />
            {children}
            <Footer />
          </div>
          <Toaster />
        </AppProviders>
      </LocaleProvider>
    </LanguageProvider>
  );
}
