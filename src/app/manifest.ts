import type { MetadataRoute } from "next";
import { SITE_BRAND_NAME, SITE_DESCRIPTION, SITE_ICON_PATH } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_BRAND_NAME,
    short_name: SITE_BRAND_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1c1917",
    icons: [
      {
        src: SITE_ICON_PATH,
        sizes: "232x417",
        type: "image/png",
        purpose: "any",
      },
      {
        src: SITE_ICON_PATH,
        sizes: "232x417",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
