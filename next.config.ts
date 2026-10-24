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
    // Vercel's image optimiser has a monthly quota on this plan; once spent it
    // answers 402 and product photos vanish. Serve the files directly instead:
    // ops photos are already resized to 1200px JPEGs of about 35-150 KB.
    unoptimized: true,
    remotePatterns: [
      ...opsHosts.map((hostname) => ({ protocol: "https" as const, hostname })),
    ],
  },
  poweredByHeader: false,
};

export default nextConfig;
