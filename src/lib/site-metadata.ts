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
    icon: [{ url: SITE_ICON_PATH, type: "image/png" }],
    apple: [{ url: SITE_ICON_PATH, type: "image/png" }],
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
        url: SITE_ICON_PATH,
        alt: SITE_BRAND_NAME,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: defaultTitle,
    description: SITE_DESCRIPTION,
    images: [SITE_ICON_PATH],
  },
  robots: {
    index: true,
    follow: true,
  },
};
