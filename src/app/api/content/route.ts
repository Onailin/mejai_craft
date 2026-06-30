import { NextRequest, NextResponse } from "next/server";
import { loadBirthstones, loadBraceletJewelryProducts, loadGems, loadJewelryCategories, loadLuckyStones, loadWorkshop, loadWorkshopCatalog } from "@/lib/load-content";

export const revalidate = 60;

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") ?? "th";
  const type = request.nextUrl.searchParams.get("type") ?? "all";

  try {
    if (type === "gems") {
      return NextResponse.json(await loadGems(locale));
    }
    if (type === "lucky-stones") {
      return NextResponse.json(await loadLuckyStones(locale));
    }
    if (type === "birthstones") {
      return NextResponse.json(await loadBirthstones(locale));
    }
    if (type === "jewelry") {
      return NextResponse.json(await loadJewelryCategories(locale));
    }
    if (type === "workshops") {
      const workshop = await loadWorkshop(locale);
      return NextResponse.json([workshop]);
    }
    if (type === "workshop-catalog") {
      return NextResponse.json(await loadWorkshopCatalog(locale));
    }
    if (type === "bracelet-products") {
      return NextResponse.json(await loadBraceletJewelryProducts(locale));
    }

    const [gems, luckyStones, birthstones, jewelry, workshop] = await Promise.all([
      loadGems(locale),
      loadLuckyStones(locale),
      loadBirthstones(locale),
      loadJewelryCategories(locale),
      loadWorkshop(locale),
    ]);

    return NextResponse.json({ gems, luckyStones, birthstones, jewelry, workshops: [workshop] });
  } catch (error) {
    console.error("Content API error:", error);
    return NextResponse.json({ error: "Failed to load content" }, { status: 500 });
  }
}
