import { prisma } from "@/lib/prisma";
import {
  WORKSHOP_BRACELET_PENDANTS,
  braceletPendantDescription,
} from "@/lib/workshop-bracelet-pricing";

export async function ensureBraceletWorkshopOptions(workshopId: string) {
  const existing = await prisma.workshopOptionGroup.findMany({
    where: { workshopId },
    include: { options: true },
    orderBy: { sortOrder: "asc" },
  });

  let pendantGroup = existing.find((group) => group.groupType === "ADDON");

  if (!pendantGroup) {
    pendantGroup = await prisma.workshopOptionGroup.create({
      data: {
        workshopId,
        groupType: "ADDON",
        title: "จี้",
        description: "แบบจี้เสริม",
        sortOrder: 1,
      },
      include: { options: true },
    });
  }

  for (const [index, pendant] of WORKSHOP_BRACELET_PENDANTS.entries()) {
    const description = braceletPendantDescription(pendant.key);
    const exists = pendantGroup.options.some((option) => option.description === description);
    if (!exists) {
      await prisma.workshopOption.create({
        data: {
          groupId: pendantGroup.id,
          label: pendant.label,
          description,
          price: pendant.price,
          sortOrder: index,
        },
      });
    }
  }
}
