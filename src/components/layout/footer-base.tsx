"use client";

import { Link } from "@/lib/i18n";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import { m } from "@/components/motion/lazy-motion";
import { Button } from "@/components/ui/button";
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

const socialIcons = [
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: Twitter, label: "Twitter/X", href: "https://twitter.com" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
  { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
];

export type FooterVariant = "default" | "charcoal";

export function FooterBase({ variant = "default" }: { variant?: FooterVariant }) {
  const isCharcoal = variant === "charcoal";

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

            {/* Social Icons */}
            <div className="footer-social-row">
              {socialIcons.map(({ icon: Icon, label, href }) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="icon"
                  className="footer-social-btn"
                  asChild
                >
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </Button>
              ))}
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
            <ul className="space-y-2.5 footer-body">
              {productLinks.map((link) => (
                <m.li
                  key={link.name}
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Link
                    href={link.href}
                    prefetch
                    className="footer-link block py-0.5 leading-tight"
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
            <ul className="space-y-2.5 footer-body">
              {companyLinks.map((link) => (
                <m.li
                  key={link.name}
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Link
                    href={link.href}
                    prefetch
                    className="footer-link block py-0.5 leading-tight"
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
