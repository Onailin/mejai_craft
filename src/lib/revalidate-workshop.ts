import { revalidatePath } from "next/cache";

export function revalidateWorkshopPaths(workshopId: string) {
  revalidatePath("/workshop");
  revalidatePath("/admin/workshops");
  revalidatePath(`/admin/workshops/${workshopId}`);
}
