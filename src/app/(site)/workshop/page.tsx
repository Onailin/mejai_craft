import { getPage } from "@/lib/pages";
import { getWorkshopPageBannerImages } from "@/lib/page-banners";
import { loadBraceletJewelryProducts, loadWorkshopCatalog } from "@/lib/load-content";
import { WorkshopView } from "@/components/views/WorkshopView";

export const revalidate = 0;

export default async function WorkshopPage() {
  const page = getPage("workshop");
  const [catalog, braceletJewelry, bannerImages] = await Promise.all([
    loadWorkshopCatalog("th"),
    loadBraceletJewelryProducts("th"),
    getWorkshopPageBannerImages(),
  ]);
  return (
    <WorkshopView
      page={page}
      initialCatalog={catalog}
      initialBraceletProducts={braceletJewelry.products}
      bannerImages={bannerImages}
    />
  );
}
