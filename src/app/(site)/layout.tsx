import { SiteShell } from "@/components/layout/SiteShell";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteJsonLd />
      <SiteShell>{children}</SiteShell>
    </>
  );
}
