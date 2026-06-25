import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION } from "@/lib/seo";
import { SITE_NAME } from "@/lib/utils";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#010109",
    theme_color: "#071d35",
    lang: "en-US",
    categories: ["utilities", "productivity", "developer"],
    icons: [
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
