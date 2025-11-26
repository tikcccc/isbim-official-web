import localFont from "next/font/local";

export const allianceNo1 = localFont({
  variable: "--font-alliance-1",
  display: "swap",
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
  src: [
    { path: "../../public/fonts/Alliance/AllianceNo2-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Alliance/AllianceNo2-RegularItalic.woff2", weight: "400", style: "italic" },
    { path: "../../public/fonts/Alliance/AllianceNo2-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/Alliance/AllianceNo2-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
});
