import type { NextConfig } from "next";
import { paraglide } from "@inlang/paraglide-next/plugin";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

type RemotePattern = {
  protocol: "http" | "https";
  hostname: string;
  port: string;
  pathname: string;
};

function toRemotePattern(value?: string): RemotePattern | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    const basePath = url.pathname.replace(/\/$/, "");

    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port,
      pathname: `${basePath || ""}/**`,
    };
  } catch {
    return null;
  }
}

const mediaRemotePatterns = [
  process.env.NEXT_PUBLIC_MEDIA_URL,
  process.env.NEXT_PUBLIC_VIDEO_CDN_URL,
  process.env.NEXT_PUBLIC_FEATURE_VIDEO_CDN_URL,
].flatMap((value) => {
  const pattern = toRemotePattern(value);
  return pattern ? [pattern] : [];
});

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    qualities: [75, 85, 90, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/**",
      },
      ...mediaRemotePatterns,
    ],
  },
};

export default withBundleAnalyzer(paraglide({
  paraglide: {
    project: "./project.inlang",
    outdir: "./src/paraglide",
  },
  ...nextConfig,
}));
