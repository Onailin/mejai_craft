import { WorkshopAddonType, WorkshopRingSampleType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/supabase-storage";
import {
  WORKSHOP_ADDON_OPTIONS,
  WORKSHOP_RING_SAMPLE_TYPES,
} from "@/lib/workshop-ring-pricing";

export async function saveWorkshopRingSampleImage(
  workshopId: string,
  sampleType: string,
  file: File
) {
  if (!WORKSHOP_RING_SAMPLE_TYPES.includes(sampleType as (typeof WORKSHOP_RING_SAMPLE_TYPES)[number])) {
    throw new Error("ประเภทรูปไม่ถูกต้อง");
  }

  const { publicUrl } = await uploadImage(file, "workshop/ring-samples");

  await prisma.workshopRingSampleImage.upsert({
    where: {
      workshopId_sampleType: {
        workshopId,
        sampleType: sampleType as WorkshopRingSampleType,
      },
    },
    create: {
      workshopId,
      sampleType: sampleType as WorkshopRingSampleType,
      imageUrl: publicUrl,
    },
    update: { imageUrl: publicUrl },
  });

  return publicUrl;
}

export async function saveWorkshopAddonImage(
  workshopId: string,
  addonType: string,
  file: File
) {
  const addonMeta = WORKSHOP_ADDON_OPTIONS.find((item) => item.value === addonType);
  if (!addonMeta) throw new Error("ประเภทบริการไม่ถูกต้อง");

  const { publicUrl } = await uploadImage(file, "workshop/ring-samples");

  await prisma.workshopAddon.upsert({
    where: {
      workshopId_addonType: {
        workshopId,
        addonType: addonType as WorkshopAddonType,
      },
    },
    create: {
      workshopId,
      addonType: addonType as WorkshopAddonType,
      label: addonMeta.defaultLabel,
      imageUrl: publicUrl,
    },
    update: { imageUrl: publicUrl },
  });

  return publicUrl;
}

export async function saveWorkshopFeaturedImage(workshopId: string, file: File) {
  const count = await prisma.workshopFeaturedImage.count({ where: { workshopId } });
  const { publicUrl } = await uploadImage(file, "workshop/featured");

  const image = await prisma.workshopFeaturedImage.create({
    data: { workshopId, imageUrl: publicUrl, sortOrder: count },
  });

  return { imageUrl: publicUrl, id: image.id };
}
