import type { Metadata } from "next";
import {
  SITE_BRAND_NAME,
  SITE_DESCRIPTION,
  SITE_ICON_PATH,
  SITE_URL,
} from "@/lib/brand";

const defaultTitle = `${SITE_BRAND_NAME} | Jewelry & Workshop`;

export const rootSiteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: `%s | ${SITE_BRAND_NAME}`,
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: [
      { url: SITE_ICON_PATH, sizes: "232x417", type: "image/png" },
      { url: SITE_ICON_PATH, sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: SITE_ICON_PATH, sizes: "180x180", type: "image/png" }],
    shortcut: SITE_ICON_PATH,
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: SITE_URL,
    siteName: SITE_BRAND_NAME,
    title: defaultTitle,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: SITE_BRAND_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};
