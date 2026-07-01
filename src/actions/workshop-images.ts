"use server";

import { WorkshopAddonType, WorkshopRingSampleType } from "@prisma/client";
import { requireEditorOrAdmin } from "@/lib/auth-helpers";
import { formatActionError } from "@/lib/format-action-error";
import { prisma } from "@/lib/prisma";
import { revalidateWorkshopPaths } from "@/lib/revalidate-workshop";
import { processWorkshopImageUpload } from "@/lib/workshop-image-admin";
import type { WorkshopImageUploadResult } from "@/types/workshop-admin";

export async function uploadWorkshopImageAction(
  formData: FormData,
): Promise<WorkshopImageUploadResult> {
  try {
    await requireEditorOrAdmin();
    const result = await processWorkshopImageUpload(formData);
    return { ok: true, imageUrl: result.imageUrl, id: result.id };
  } catch (error) {
    console.error("uploadWorkshopImageAction failed:", error);
    return { ok: false, error: formatActionError(error) };
  }
}

export async function deleteWorkshopRingSampleImage(workshopId: string, sampleType: string) {
  await requireEditorOrAdmin();
  await prisma.workshopRingSampleImage.deleteMany({
    where: {
      workshopId,
      sampleType: sampleType as WorkshopRingSampleType,
    },
  });
  revalidateWorkshopPaths(workshopId);
}

export async function deleteWorkshopAddonImage(workshopId: string, addonType: string) {
  await requireEditorOrAdmin();
  await prisma.workshopAddon.updateMany({
    where: {
      workshopId,
      addonType: addonType as WorkshopAddonType,
    },
    data: { imageUrl: null },
  });
  revalidateWorkshopPaths(workshopId);
}

export async function deleteWorkshopOptionImage(workshopId: string, optionId: string) {
  await requireEditorOrAdmin();
  await prisma.workshopOption.updateMany({
    where: {
      id: optionId,
      group: { workshopId },
    },
    data: { imageUrl: null },
  });
  revalidateWorkshopPaths(workshopId);
}

export async function deleteWorkshopFeaturedImage(imageId: string) {
  await requireEditorOrAdmin();
  const image = await prisma.workshopFeaturedImage.findUnique({
    where: { id: imageId },
    select: { workshopId: true },
  });
  if (!image) throw new Error("ไม่พบรูป");

  await prisma.workshopFeaturedImage.delete({ where: { id: imageId } });
  revalidateWorkshopPaths(image.workshopId);
}

export async function deleteWorkshopBannerImage(imageId: string) {
  await requireEditorOrAdmin();
  const image = await prisma.workshopBannerImage.findUnique({
    where: { id: imageId },
    select: { workshopId: true },
  });
  if (!image) throw new Error("ไม่พบรูป");

  await prisma.workshopBannerImage.delete({ where: { id: imageId } });
  revalidateWorkshopPaths(image.workshopId);
}
