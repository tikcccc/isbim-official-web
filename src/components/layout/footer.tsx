"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Facebook, Linkedin, Twitter, Youtube, Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getLocale } from "@/paraglide/runtime";

/**
 * Footer Component
 *
 * 用途：
 * - 全站的底部Footer區域
 * - 包含快捷鏈接、公司信息、社交媒體、版權聲明
 * - 集成訂閱表單功能
 *
 * 使用場景：
 * - 在layout.tsx中全局引用
 * - 所有頁面共用同一Footer
 */

// --- 表單驗證 Schema (Zod) ---
const subscriptionSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

type FooterProps = {
  locale?: string;
};

export function Footer({ locale: initialLocale }: FooterProps) {
  // --- 狀態管理與表單初始化 (React Hook Form) ---
  const [isSubmitted, setIsSubmitted] = useState(false);
  const locale = initialLocale ?? getLocale();
  const withLocale = (href: string) => {
    if (!href) return "#";
    if (href.startsWith(`/${locale}`)) return href;
    return href.startsWith("/") ? `/${locale}${href}` : `/${locale}/${href}`;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
  });

  // --- 資料提交處理 ---
  const onSubmit = async (data: SubscriptionFormValues) => {
    // 模擬 API 請求延遲
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Subscription Data:", data);
    setIsSubmitted(true);
    reset();

    // 3秒後重置狀態，允許再次提交
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  // --- 導航連結數據 ---
  const productLinks = [
    { name: "JARVIS Agent", href: "/products/agent" },
    { name: "JARVIS Pay", href: "/products/pay" },
    { name: "JARVIS Air", href: "/products/air" },
    { name: "JARVIS Eagle Eye", href: "/products/eagle-eye" },
    { name: "JARVIS SSSS", href: "/products/ssss" },
    { name: "JARVIS DWSS", href: "/jarvis-dwss" },
    { name: "JARVIS CDCP", href: "/jarvis-cdcp" },
    { name: "JARVIS Assets", href: "/products/assets" },
  ];

  const companyLinks = [
    { name: "JARVIS Project Management (JPM)", href: "/jarvis-jpm" },
    { name: "BIM Consultancy", href: "/bim-consultancy" },
    { name: "Project Finance", href: "/project-finance" },
    { name: "Venture Investments", href: "/venture-investments" },
    { name: "About Us", href: "/about-us" },
    { name: "Newsroom", href: "/newsroom" },
    { name: "Careers", href: "/careers" },
    { name: "Contact Us", href: "/contact" },
  ];

  const socialIcons = [
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
    { icon: Twitter, label: "Twitter/X", href: "https://twitter.com" },
    { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
    { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
  ];

  return (
    <footer className="w-full bg-background text-foreground border-t border-border">
      <div className="container mx-auto px-6 py-12 lg:py-20">
        {/* 主要 Grid 佈局 */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Column 1: Brand & Vision */}
          <div className="flex flex-col space-y-7 lg:space-y-8">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              {/* Logo SVG */}
              <Image
                src="/icons/isbim_black.svg"
                alt="isBIM Logo"
                width={120}
                height={32}
                className="dark:hidden w-auto h-auto"
                priority
              />
              <Image
                src="/icons/isbim_white.svg"
                alt="isBIM Logo"
                width={120}
                height={32}
                className="hidden dark:block w-auto h-auto"
                priority
              />
            </Link>

            <p className="text-base text-muted-foreground leading-[1.8] footer-alliance-font">
              AI That Predicts. Systems That Deliver. Results That Scale.
              <br className="mt-1.5" />
              <span className="text-muted-foreground/80">
                Construction AI Powering the Backbone of Global Economies.
              </span>
            </p>

            {/* Social Icons */}
            <div className="flex space-x-1 pt-2">
              {socialIcons.map(({ icon: Icon, label, href }) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground transition-colors"
                  asChild
                >
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                    <Icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Column 2: Solutions (JARVIS Products) */}
          <div className="flex flex-col space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70 footer-alliance-font">
              AI Platforms
            </h3>
            <ul className="space-y-2.5 text-base text-muted-foreground footer-alliance-font">
              {productLinks.map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Link
                    href={withLocale(link.href)}
                    className="hover:text-foreground transition-colors block py-0.5"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70 footer-alliance-font">
              Company
            </h3>
            <ul className="space-y-2.5 text-base text-muted-foreground footer-alliance-font">
              {companyLinks.map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Link
                    href={withLocale(link.href)}
                    className="hover:text-foreground transition-colors block py-0.5"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div className="flex flex-col space-y-7 lg:space-y-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70 footer-alliance-font">
              Stay Connected
            </h3>
            <p className="text-base text-muted-foreground leading-[1.75] footer-alliance-font max-w-md">
              Join our network to get the latest insights on Digital Twins and AI Infrastructure.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2.5">
              <div className="flex space-x-2">
                <Input
                  {...register("email")}
                  placeholder="Enter your email"
                  type="email"
                  className="flex-1 h-9 text-sm"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  size="icon"
                  className="h-9 w-9 shadow-sm"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {errors.email && (
                <p className="text-xs text-destructive pl-0.5">{errors.email.message}</p>
              )}

              {isSubmitted && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-green-600 dark:text-green-400 pl-0.5"
                >
                  Thank you for subscribing!
                </motion.p>
              )}
            </form>
          </div>
        </div>

        <Separator className="my-10" />

        {/* Bottom Bar - Copyright & Legal Links */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground space-y-3 md:space-y-0 footer-alliance-font">
          <p>© 2025 isBIM Limited. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
