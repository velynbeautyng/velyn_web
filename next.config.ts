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

// Both ops addresses stay allowed through the domain move, so pages cached with
// the old image links keep rendering until they revalidate.
const opsHosts = [
  ...new Set([opsHost, "ops.nuvenebeauty.com", "ops.velynbeauty.com"]),
];

const nextConfig: NextConfig = {
  // Pin the workspace root so Next doesn't infer a parent lockfile.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      ...opsHosts.map((hostname) => ({ protocol: "https" as const, hostname })),
      { protocol: "https", hostname: "velynbeauty.com" },
      { protocol: "https", hostname: "www.velynbeauty.com" },
    ],
  },
  poweredByHeader: false,
};

export default nextConfig;
