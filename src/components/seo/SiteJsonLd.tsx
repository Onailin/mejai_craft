import { SITE_BRAND_NAME, SITE_DESCRIPTION, SITE_ICON_PATH, SITE_URL } from "@/lib/brand";

export function SiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_BRAND_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}${SITE_ICON_PATH}`,
    description: SITE_DESCRIPTION,
    sameAs: ["https://www.facebook.com/mejaicrafts"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
