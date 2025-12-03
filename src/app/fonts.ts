import localFont from "next/font/local";
import { Noto_Sans_SC } from "next/font/google";

export const allianceNo1 = localFont({
  variable: "--font-alliance-1",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
  src: [
    { path: "../../public/fonts/Alliance/AllianceNo1-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Alliance/AllianceNo1-RegularItalic.woff2", weight: "400", style: "italic" },
    { path: "../../public/fonts/Alliance/AllianceNo1-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/Alliance/AllianceNo1-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
});

export const allianceNo2 = localFont({
  variable: "--font-alliance-2",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
  src: [
    { path: "../../public/fonts/Alliance/AllianceNo2-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Alliance/AllianceNo2-RegularItalic.woff2", weight: "400", style: "italic" },
    { path: "../../public/fonts/Alliance/AllianceNo2-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/Alliance/AllianceNo2-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
});

export const allianceZh = Noto_Sans_SC({
  variable: "--font-alliance-zh",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
