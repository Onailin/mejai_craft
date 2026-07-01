import { SiteShell } from "@/components/layout/SiteShell";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteJsonLd />
      <PageViewTracker />
      <SiteShell>{children}</SiteShell>
    </>
  );
}
