import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#E1DAC6",
    theme_color: "#4F6A54",
    icons: [
      { src: "/brand/nuvene-icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/nuvene-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
