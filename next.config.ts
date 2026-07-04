import type { NextConfig } from "next";
import path from "node:path";

const opsHost = (() => {
  try {
    return new URL(process.env.OPS_API_URL || "https://ops.velynbeauty.com")
      .hostname;
  } catch {
    return "ops.velynbeauty.com";
  }
})();

const nextConfig: NextConfig = {
  // Pin the workspace root so Next doesn't infer a parent lockfile.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: opsHost },
      { protocol: "https", hostname: "velynbeauty.com" },
    ],
  },
  poweredByHeader: false,
};

export default nextConfig;
