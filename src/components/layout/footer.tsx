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
import { useLocalizedHref } from "@/lib/i18n/index";
import { ROUTES } from "@/lib/constants";
import * as m from "@/paraglide/messages";

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

export function Footer() {
  // --- 狀態管理與表單初始化 (React Hook Form) ---
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { buildHref } = useLocalizedHref();

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

  return (
    <footer className="w-full bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-t border-slate-200 dark:border-slate-800 font-sans">
      <div className="container mx-auto px-6 py-14 lg:py-20">
        {/* 主要 Grid 佈局 */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-14">
          {/* Column 1: Brand & Vision */}
          <div className="flex flex-col space-y-5">
            <Link href={buildHref(ROUTES.HOME)} className="inline-flex items-center hover:opacity-80 transition-opacity w-fit">
              {/* Logo SVG - 優化尺寸 */}
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
            </Link>

            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-[1.7] max-w-[280px]">
              {m.footer_tagline()}
              <br className="block mt-1.5" />
              <span className="text-slate-500 dark:text-slate-500">
                {m.footer_tagline2()}
              </span>
            </p>

            {/* Social Icons - 優化尺寸和間距 */}
            <div className="flex space-x-1.5 pt-1">
              {socialIcons.map(({ icon: Icon, label, href }) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  asChild
                >
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                    <Icon className="h-5 w-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Column 2: Solutions (JARVIS Products) */}
          <div className="flex flex-col space-y-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
              {m.footer_platforms()}
            </h3>
            <ul className="space-y-2.5 text-[15px] text-slate-600 dark:text-slate-400">
              {productLinks.map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Link
                    href={buildHref(link.href)}
                    className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors block py-0.5 leading-tight"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col space-y-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
              {m.footer_company()}
            </h3>
            <ul className="space-y-2.5 text-[15px] text-slate-600 dark:text-slate-400">
              {companyLinks.map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Link
                    href={buildHref(link.href)}
                    className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors block py-0.5 leading-tight"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div className="flex flex-col space-y-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
              {m.footer_stay_connected()}
            </h3>
            <p className="text-[15px] text-slate-500 dark:text-slate-400 leading-[1.65]">
              {m.footer_newsletter_desc()}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2.5 pt-0.5">
              <div className="flex space-x-2">
                <Input
                  {...register("email")}
                  placeholder={m.footer_email_placeholder()}
                  type="email"
                  className="flex-1 h-10 text-[15px] border-slate-300 dark:border-slate-700 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500 transition-all duration-200 hover:border-slate-400 hover:shadow-sm dark:hover:border-slate-500"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className="px-4 h-10 shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md focus:shadow-md disabled:translate-y-0 disabled:shadow-sm"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-[18px] w-[18px] animate-spin" />
                  ) : (
                    <Send className="h-[18px] w-[18px]" />
                  )}
                </Button>
              </div>

              {errors.email && (
                <p className="text-xs text-red-500 pl-0.5">{errors.email.message}</p>
              )}

              {isSubmitted && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-green-600 dark:text-green-400 pl-0.5"
                >
                  {m.footer_subscribe_success()}
                </motion.p>
              )}
            </form>
          </div>
        </div>

        <Separator className="my-10" />

        {/* Bottom Bar - Copyright & Legal Links */}
        <div className="flex flex-col md:flex-row justify-between items-center text-[13px] text-slate-500 dark:text-slate-400 space-y-3 md:space-y-0">
          <p>{m.footer_copyright()}</p>
          <div className="flex space-x-7">
            <Link href={buildHref("/privacy")} className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              {m.footer_privacy()}
            </Link>
            <Link href={buildHref("/terms")} className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              {m.footer_terms()}
            </Link>
            <Link href={buildHref("/cookies")} className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              {m.footer_cookies()}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
