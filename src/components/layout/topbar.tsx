"use client";

import * as m from "@/paraglide/messages";
import { Search, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { LocaleSwitcher } from "./locale-switcher";
import { MenuOverlay } from "./menu-overlay";
import { useMenuStore } from "@/stores/menu-store";
import { TypewriterText } from "@/components/ui/typewriter-text";

/**
 * Topbar Component
 *
 * A glassmorphism navigation bar with floating effect
 * - Fixed at the top with margin for floating effect
 * - Transparent background with backdrop blur
 * - Logo on the left
 * - Get Started button, LocaleSwitcher, Search, and Menu on the right
 * - When menu is open: becomes solid black and sits at top of menu overlay
 */

export function Topbar() {
  const { isOpen, openMenu, closeMenu } = useMenuStore();

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed z-50 flex items-center justify-between px-6 sm:px-10 py-4 transition-all duration-300
          ${
            isOpen
              ? "top-0 left-0 right-0 bg-[#050505] border-b border-white/10 rounded-none"
              : "top-6 left-6 right-6 bg-zinc-900/30 backdrop-blur-lg border border-white/10 rounded-xl"
          }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center hover:opacity-80 transition-opacity"
          onClick={isOpen ? closeMenu : undefined}
        >
          <Image
            src="/icons/isbim_white.svg"
            alt="isBIM Logo"
            width={100}
            height={26}
            className="h-6 w-auto"
            priority
          />
        </Link>

        {/* Right side buttons */}
        <div className="flex items-center space-x-4">
          {/* Get Started button - hidden on mobile */}
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`hidden sm:block px-4 py-2 text-sm font-medium rounded-lg transition-colors
              ${
                isOpen
                  ? "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                  : "bg-white text-black hover:bg-zinc-200"
              }`}
            onClick={isOpen ? closeMenu : undefined}
          >
            {m.topbar_get_started()}
          </motion.a>

          {/* Locale Switcher - hidden when menu is open */}
          {!isOpen && <LocaleSwitcher />}

          {/* Search button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 flex items-center justify-center border border-white/20 rounded-lg
                     hover:bg-white/10 transition-colors text-white"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </motion.button>

          {/* Menu / Close button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isOpen ? closeMenu : openMenu}
            className={`flex items-center justify-center transition-colors text-white group
              ${
                isOpen
                  ? "px-4 py-2 gap-3 border border-white/20 rounded-lg hover:bg-white/10"
                  : "w-10 h-10 border border-white/20 rounded-lg hover:bg-white/10"
              }`}
            aria-label={isOpen ? "Close Menu" : "Open Menu"}
          >
            {isOpen ? (
              <>
                <TypewriterText
                  text="CLOSE"
                  className="text-[10px] font-mono text-neutral-400 group-hover:text-white tracking-widest hidden sm:block"
                />
                <X className="w-5 h-5" />
              </>
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </motion.nav>

      {/* Menu Overlay */}
      <MenuOverlay />
    </>
  );
}
