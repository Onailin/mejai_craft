import { getPage } from "@/lib/pages";
import { getHomeBannerImage } from "@/lib/page-banners";
import { loadGems, loadLuckyStones } from "@/lib/load-content";
import { HomeView } from "@/components/views/HomeView";

export const revalidate = 60;

export default async function HomePage() {
  const page = getPage("home");
  const [gems, luckyStones, bannerImage] = await Promise.all([
    loadGems("th"),
    loadLuckyStones("th"),
    getHomeBannerImage(),
  ]);

  return (
    <HomeView
      page={page}
      initialGems={gems}
      initialLuckyStones={luckyStones}
      bannerImage={bannerImage}
    />
  );
}
