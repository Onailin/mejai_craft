import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getFormDataFile } from "@/lib/form-data-file";
import { uploadImage } from "@/lib/supabase-storage";
import {
  getDefaultHomeBannerImage,
  getDefaultWorkshopBannerImages,
  PAGE_BANNER_HOME_KEY,
  PAGE_BANNER_WORKSHOP_KEY,
} from "@/lib/page-banners";

type PageBannerKey = "home" | "workshop";

function parseStoredWorkshopBannerList(value: string) {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  } catch {
    return [];
  }
}

async function readSettingRaw(key: string) {
  const setting = await prisma.siteSetting.findUnique({ where: { key } });
  return setting?.value ?? null;
}

async function readSetting(key: string) {
  return (await readSettingRaw(key)) ?? "";
}

async function writeSetting(key: string, value: string) {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

function revalidateBannerPaths() {
  revalidatePath("/");
  revalidatePath("/workshop");
  revalidatePath("/admin/banners");
}

function getEffectiveHomeBanner(stored: string | null) {
  if (stored === null) return getDefaultHomeBannerImage();
  if (stored === "") return "";
  return stored;
}

function getEffectiveWorkshopBanners(stored: string | null) {
  if (stored === null) return getDefaultWorkshopBannerImages();
  return parseStoredWorkshopBannerList(stored);
}

export async function getAdminPageBanners() {
  const [homeStored, workshopStored] = await Promise.all([
    readSettingRaw(PAGE_BANNER_HOME_KEY),
    readSettingRaw(PAGE_BANNER_WORKSHOP_KEY),
  ]);

  return {
    homeImage: getEffectiveHomeBanner(homeStored),
    workshopImages: getEffectiveWorkshopBanners(workshopStored),
    homeIsManaged: homeStored !== null,
    workshopIsManaged: workshopStored !== null,
  };
}

export async function uploadPageBanner(
  pageKey: PageBannerKey,
  formData: FormData,
  options?: { replaceUrl?: string },
) {
  const image = getFormDataFile(formData, "image");
  if (!image) {
    throw new Error("กรุณาเลือกรูป");
  }

  const replaceUrl = options?.replaceUrl?.trim() || "";
  const folder = pageKey === "home" ? "banners/home" : "banners/workshop";
  const { publicUrl } = await uploadImage(image, folder);

  if (pageKey === "home") {
    await writeSetting(PAGE_BANNER_HOME_KEY, publicUrl);
  } else if (replaceUrl) {
    const stored = await readSettingRaw(PAGE_BANNER_WORKSHOP_KEY);
    const current = getEffectiveWorkshopBanners(stored);
    const index = current.indexOf(replaceUrl);
    if (index === -1) {
      throw new Error("ไม่พบรูปที่จะแทนที่");
    }
    const next = [...current];
    next[index] = publicUrl;
    await writeSetting(PAGE_BANNER_WORKSHOP_KEY, JSON.stringify(next));
  } else {
    const stored = await readSettingRaw(PAGE_BANNER_WORKSHOP_KEY);
    const current = getEffectiveWorkshopBanners(stored);
    await writeSetting(PAGE_BANNER_WORKSHOP_KEY, JSON.stringify([...current, publicUrl]));
  }

  revalidateBannerPaths();
  return { imageUrl: publicUrl };
}

export async function deletePageBanner(pageKey: PageBannerKey, imageUrl: string) {
  const trimmed = imageUrl.trim();
  if (!trimmed) {
    throw new Error("ไม่พบรูปที่ต้องการลบ");
  }

  if (pageKey === "home") {
    const stored = await readSettingRaw(PAGE_BANNER_HOME_KEY);
    const current = getEffectiveHomeBanner(stored);
    if (!current || current !== trimmed) {
      throw new Error("ไม่พบรูปแบนเนอร์หน้าแรก");
    }
    await writeSetting(PAGE_BANNER_HOME_KEY, "");
  } else {
    const stored = await readSettingRaw(PAGE_BANNER_WORKSHOP_KEY);
    const current = getEffectiveWorkshopBanners(stored);
    const next = current.filter((url) => url !== trimmed);
    if (next.length === current.length) {
      throw new Error("ไม่พบรูปในรายการแบนเนอร์เวิร์คชอป");
    }
    await writeSetting(PAGE_BANNER_WORKSHOP_KEY, JSON.stringify(next));
  }

  revalidateBannerPaths();
}
