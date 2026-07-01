import { getFormDataFile } from "@/lib/form-data-file";
import { revalidateWorkshopPaths } from "@/lib/revalidate-workshop";
import {
  saveWorkshopAddonImage,
  saveWorkshopBannerImage,
  saveWorkshopFeaturedImage,
  saveWorkshopOptionImage,
  saveWorkshopRingSampleImage,
} from "@/lib/workshop-image-upload";

export type WorkshopImageUploadKind = "sample" | "addon" | "option" | "featured" | "banner";

export async function processWorkshopImageUpload(formData: FormData) {
  const workshopId = String(formData.get("workshopId") ?? "").trim();
  const kind = String(formData.get("kind") ?? "").trim() as WorkshopImageUploadKind;
  const file = getFormDataFile(formData, "file");

  if (!workshopId) {
    throw new Error("ไม่พบเวิร์คชอป");
  }
  if (!file) {
    throw new Error("กรุณาเลือกรูป");
  }

  let imageUrl: string;
  let imageId: string | undefined;

  if (kind === "sample") {
    const sampleType = String(formData.get("sampleType") ?? "").trim();
    if (!sampleType) {
      throw new Error("ไม่พบประเภทรูป");
    }
    imageUrl = await saveWorkshopRingSampleImage(workshopId, sampleType, file);
  } else if (kind === "addon") {
    const addonType = String(formData.get("addonType") ?? "").trim();
    if (!addonType) {
      throw new Error("ไม่พบประเภทบริการ");
    }
    imageUrl = await saveWorkshopAddonImage(workshopId, addonType, file);
  } else if (kind === "option") {
    const optionId = String(formData.get("optionId") ?? "").trim();
    if (!optionId) {
      throw new Error("ไม่พบตัวเลือก");
    }
    imageUrl = await saveWorkshopOptionImage(workshopId, optionId, file);
  } else if (kind === "featured") {
    const saved = await saveWorkshopFeaturedImage(workshopId, file);
    imageUrl = saved.imageUrl;
    imageId = saved.id;
  } else if (kind === "banner") {
    const saved = await saveWorkshopBannerImage(workshopId, file);
    imageUrl = saved.imageUrl;
    imageId = saved.id;
  } else {
    throw new Error("ประเภทการอัปโหลดไม่ถูกต้อง");
  }

  revalidateWorkshopPaths(workshopId);
  return { imageUrl, id: imageId };
}
