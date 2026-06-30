import { getPage } from "@/lib/pages";
import { loadBraceletJewelryProducts, loadWorkshopCatalog } from "@/lib/load-content";
import { WorkshopView } from "@/components/views/WorkshopView";

export const dynamic = "force-dynamic";

export default async function WorkshopPage() {
  const page = getPage("workshop");
  const [catalog, braceletJewelry] = await Promise.all([
    loadWorkshopCatalog("th"),
    loadBraceletJewelryProducts("th"),
  ]);
  return (
    <WorkshopView
      page={page}
      initialCatalog={catalog}
      initialBraceletProducts={braceletJewelry.products}
    />
  );
}
