import { AboutOverviewSection } from "@/components/AboutOverviewSection";
import { ABOUT_GALLERY_IMAGES } from "@/lib/about-gallery";
import { getPage } from "@/lib/pages";

export const revalidate = 60;

export default function AboutPage() {
  const page = getPage("about");
  const slides = ABOUT_GALLERY_IMAGES.map((src, index) => ({
    id: String(index + 1).padStart(2, "0"),
    src,
    label: `Mejai Crafts ${index + 1}`,
  }));

  return <AboutOverviewSection page={page} slides={slides} />;
}
