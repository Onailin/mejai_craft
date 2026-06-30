import { prisma } from "@/lib/prisma";
import {
  BRACELET_STONE_PRICE,
  WORKSHOP_BRACELET_PENDANTS,
  WORKSHOP_BRACELET_STONES,
  braceletPendantDescription,
  braceletStoneDescription,
} from "@/lib/workshop-bracelet-pricing";

export async function ensureBraceletWorkshopOptions(workshopId: string) {
  const existing = await prisma.workshopOptionGroup.findMany({
    where: { workshopId },
    include: { options: true },
    orderBy: { sortOrder: "asc" },
  });

  let stoneGroup = existing.find((group) => group.groupType === "CUSTOM");
  let pendantGroup = existing.find((group) => group.groupType === "ADDON");

  if (!stoneGroup) {
    stoneGroup = await prisma.workshopOptionGroup.create({
      data: {
        workshopId,
        groupType: "CUSTOM",
        title: "กำไลหิน",
        description: "เลือกหินแต่ละชนิด ราคาเดียวกัน",
        sortOrder: 0,
      },
      include: { options: true },
    });
  }

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

  for (const [index, stone] of WORKSHOP_BRACELET_STONES.entries()) {
    const description = braceletStoneDescription(stone.key);
    const exists = stoneGroup.options.some((option) => option.description === description);
    if (!exists) {
      await prisma.workshopOption.create({
        data: {
          groupId: stoneGroup.id,
          label: stone.label,
          description,
          price: BRACELET_STONE_PRICE,
          sortOrder: index,
        },
      });
    }
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
