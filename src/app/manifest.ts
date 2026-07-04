import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#F7F4EF",
    theme_color: "#2C1A0E",
    icons: [
      {
        src: "/brand/PNG/ICON/COLORED.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
