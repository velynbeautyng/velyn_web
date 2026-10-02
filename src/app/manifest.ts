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
    theme_color: "#000000",
    icons: [
      {
        src: "/brand/PNG/ICON/COLORED.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
