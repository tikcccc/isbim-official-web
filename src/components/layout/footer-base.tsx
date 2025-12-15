"use client";

import { Link } from "@/lib/i18n";
import Image from "next/image";
import dynamic from "next/dynamic";
import { m } from "@/components/motion/lazy-motion";
import { ROUTES } from "@/lib/constants";
import * as messages from "@/paraglide/messages";
import { Separator } from "@/components/ui/separator";

const NewsletterForm = dynamic(
  () => import("./newsletter-form").then((mod) => mod.NewsletterForm),
  {
    ssr: false,
    loading: () => <NewsletterFallback />,
  }
);

function NewsletterFallback() {
  return (
    <div className="flex flex-col space-y-2.5 pt-0.5">
      <div className="flex space-x-2">
        <div className="h-10 flex-1 rounded-md footer-skeleton animate-pulse" />
        <div className="h-10 w-10 rounded-md footer-skeleton animate-pulse" />
      </div>
      <div className="h-3 w-24 rounded-md footer-skeleton animate-pulse" />
    </div>
  );
}

const productLinks = [
  { name: "JARVIS Agent", href: ROUTES.JARVIS.AGENT },
  { name: "JARVIS Pay", href: ROUTES.JARVIS.PAY },
  { name: "JARVIS Air", href: ROUTES.JARVIS.AIR },
  { name: "JARVIS Eagle Eye", href: ROUTES.JARVIS.EAGLE_EYE },
  { name: "JARVIS SSSS", href: ROUTES.JARVIS.SSSS },
  { name: "JARVIS DWSS", href: ROUTES.JARVIS.DWSS },
  { name: "JARVIS CDCP", href: ROUTES.JARVIS.CDCP },
  { name: "JARVIS Assets", href: ROUTES.JARVIS.ASSETS },
];

const companyLinks = [
  { name: "JARVIS Project Management (JPM)", href: ROUTES.JARVIS.JPM },
  { name: "BIM Consultancy", href: ROUTES.BIM_CONSULTANCY },
  { name: "Project Finance", href: ROUTES.PROJECT_FINANCE },
  { name: "Venture Investments", href: ROUTES.VENTURE_INVESTMENTS },
  { name: "About Us", href: ROUTES.ABOUT },
  { name: "Newsroom", href: ROUTES.NEWSROOM },
  { name: "Careers", href: ROUTES.CAREERS },
  { name: "Contact Us", href: ROUTES.CONTACT },
];

export type FooterVariant = "default" | "charcoal";

export function FooterBase({ variant = "default" }: { variant?: FooterVariant }) {
  const isCharcoal = variant === "charcoal";
  const linkedinHref = "https://hk.linkedin.com/company/isbim";
  const linkedinButtonClass = isCharcoal
    ? "inline-flex w-fit items-center justify-center gap-2.5 rounded-[10px] border border-white/50 bg-white/10 px-5 py-2.5 text-white text-sm font-medium transition-all duration-200 ease-out hover:-translate-y-px hover:border-[#0077b5] hover:bg-[#0077b5]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077b5]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0 active:shadow-none"
    : "inline-flex w-fit items-center justify-center gap-2.5 rounded-[10px] border border-gray-300 bg-white px-5 py-2.5 text-gray-700 text-sm font-medium transition-all duration-200 ease-out hover:-translate-y-px hover:border-[#0077b5] hover:bg-[#0077b5]/5 hover:text-[#0077b5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077b5]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0 active:shadow-none";
  const linkedinIconClass = isCharcoal
    ? "text-white flex-shrink-0"
    : "text-[#0077b5] flex-shrink-0";

  return (
    <footer
      className={`footer-base footer-variant-${variant} ${
        isCharcoal ? "footer-charcoal" : "footer-default"
      } w-full layout-footer-text`}
    >
      <div className="footer-shell container-content">
        {/* Grid layout */}
        <div className="footer-grid">
          {/* Column 1: Brand & Vision */}
          <div className="footer-column">
            <Link
              href={ROUTES.HOME}
              prefetch
              className="inline-flex items-center hover:opacity-80 transition-opacity w-fit"
            >
              {isCharcoal ? (
                <Image
                  src="/icons/isbim_white.svg"
                  alt="isBIM Logo"
                  width={100}
                  height={28}
                  className="h-auto max-h-8 w-auto max-w-[110px] sm:max-w-[130px]"
                  priority
                />
              ) : (
                <>
                  <Image
                    src="/icons/isbim_black.svg"
                    alt="isBIM Logo"
                    width={100}
                    height={28}
                    className="h-auto max-h-8 w-auto max-w-[110px] sm:max-w-[130px]"
                    priority
                  />
                  <Image
                    src="/icons/isbim_white.svg"
                    alt="isBIM Logo"
                    width={100}
                    height={28}
                    className="hidden dark:block w-auto h-auto"
                    priority
                  />
                </>
              )}
            </Link>

            <p className="footer-body footer-brand-copy">
              {messages.footer_tagline()}
              <br className="block mt-1.5" />
              <span className="footer-body-muted">{messages.footer_tagline2()}</span>
            </p>

            {/* Social: single LinkedIn CTA */}
            <div className="footer-social-row">
              <a
                href={linkedinHref}
                target="_blank"
                rel="noopener noreferrer"
                className={linkedinButtonClass}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={linkedinIconClass}
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="text-sm font-medium">Connect on LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Column 2: Solutions (JARVIS Products) */}
          <div className="footer-column">
            <Link
              href={ROUTES.JARVIS.SUITE}
              prefetch
              className="footer-heading transition-all duration-200 w-fit hover:tracking-[0.22em]"
            >
              {messages.footer_platforms()}
            </Link>
            <ul className="space-y-1.25 footer-body">
              {productLinks.map((link) => (
                <m.li
                  key={link.name}
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Link
                    href={link.href}
                    prefetch
                    className="footer-link block py-0.5"
                  >
                    {link.name}
                  </Link>
                </m.li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="footer-column">
            <Link
              href={ROUTES.SERVICES_PRODUCTS}
              prefetch
              className="footer-heading transition-all duration-200 w-fit hover:tracking-[0.22em]"
            >
              {messages.footer_company()}
            </Link>
            <ul className="space-y-1.25 footer-body">
              {companyLinks.map((link) => (
                <m.li
                  key={link.name}
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Link
                    href={link.href}
                    prefetch
                    className="footer-link block py-0.5"
                  >
                    {link.name}
                  </Link>
                </m.li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div className="footer-column">
            <h3 className="footer-heading">
              {messages.footer_stay_connected()}
            </h3>
            <p className="footer-body">
              {messages.footer_newsletter_desc()}
            </p>

            <div className="footer-newsletter-slot">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <Separator className="footer-divider" />

        {/* Bottom Bar - Copyright & Legal Links */}
        <div className="footer-bottom footer-muted">
          <p>{messages.footer_copyright()}</p>
          <div className="footer-legal-links">
            <m.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Link
                href="/privacy"
                prefetch
                className="footer-link inline-flex items-center gap-1"
              >
                {messages.footer_privacy()}
              </Link>
            </m.div>
            <m.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Link
                href="/terms"
                prefetch
                className="footer-link inline-flex items-center gap-1"
              >
                {messages.footer_terms()}
              </Link>
            </m.div>
            <m.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Link
                href="/cookies"
                prefetch
                className="footer-link inline-flex items-center gap-1"
              >
                {messages.footer_cookies()}
              </Link>
            </m.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
