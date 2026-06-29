import { getPage } from "@/lib/pages";
import { loadBirthstones, loadGems, loadLuckyStones } from "@/lib/load-content";
import { HomeView } from "@/components/views/HomeView";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const page = getPage("home");
  const [gems, luckyStones, birthstones] = await Promise.all([
    loadGems("th"),
    loadLuckyStones("th"),
    loadBirthstones("th"),
  ]);

  return (
    <HomeView
      page={page}
      initialGems={gems}
      initialLuckyStones={luckyStones}
      initialBirthstones={birthstones}
    />
  );
}
