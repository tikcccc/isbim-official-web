/** @type {import("@inlang/paraglide-js").ParaglideConfig} */
export default {
  project: "./project.inlang",
  outdir: "./src/paraglide",
  strategy: ["url", "cookie", "baseLocale"],
  urlPattern: ":protocol://:domain(.*)::port?/:locale/:path(.*)?",
};
