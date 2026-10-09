import type { NextConfig } from "next";
import path from "node:path";

const opsHost = (() => {
  try {
    return new URL(process.env.OPS_API_URL || "https://ops.nuvenebeauty.com")
      .hostname;
  } catch {
    return "ops.nuvenebeauty.com";
  }
})();

const opsHosts = [...new Set([opsHost, "ops.nuvenebeauty.com"])];

const nextConfig: NextConfig = {
  // Pin the workspace root so Next doesn't infer a parent lockfile.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      ...opsHosts.map((hostname) => ({ protocol: "https" as const, hostname })),
    ],
  },
  poweredByHeader: false,
};

export default nextConfig;
