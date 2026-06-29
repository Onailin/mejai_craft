import { AboutSection } from "@/components/AboutSection";
import { loadSiteSettings } from "@/lib/load-content";
import { getPage } from "@/lib/pages";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const page = getPage("contact");
  const settings = await loadSiteSettings();
  return <AboutSection page={page} settings={settings} />;
}
