import { getPage } from "@/lib/pages";
import { loadGems, loadLuckyStones } from "@/lib/load-content";
import { HomeView } from "@/components/views/HomeView";

export const revalidate = 60;

export default async function HomePage() {
  const page = getPage("home");
  const [gems, luckyStones] = await Promise.all([loadGems("th"), loadLuckyStones("th")]);

  return <HomeView page={page} initialGems={gems} initialLuckyStones={luckyStones} />;
}
