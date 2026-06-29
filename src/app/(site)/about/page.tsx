import { AboutOverviewSection } from "@/components/AboutOverviewSection";
import { getPage } from "@/lib/pages";
import { loadWorkshop } from "@/lib/load-content";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const page = getPage("about");
  const workshop = await loadWorkshop("th");
  const slides = workshop.bannerImages.map((src, index) => ({
    id: String(index + 1).padStart(2, "0"),
    src,
    label: `Gallery ${index + 1}`,
  }));

  return <AboutOverviewSection page={page} slides={slides} />;
}
