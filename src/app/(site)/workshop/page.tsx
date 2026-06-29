import { getPage } from "@/lib/pages";
import { loadWorkshopCatalog } from "@/lib/load-content";
import { WorkshopView } from "@/components/views/WorkshopView";

export const dynamic = "force-dynamic";

export default async function WorkshopPage() {
  const page = getPage("workshop");
  const catalog = await loadWorkshopCatalog("th");
  return <WorkshopView page={page} initialCatalog={catalog} />;
}
