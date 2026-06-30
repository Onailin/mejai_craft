import { prisma } from "@/lib/prisma";
import {
  isCloudImageUrl,
  isLocalPublicImageUrl,
  uploadPublicPathToSupabase,
} from "@/lib/supabase-storage";

type MigrateStats = {
  scanned: number;
  uploaded: number;
  updated: number;
  skipped: number;
  missing: number;
};

export async function migrateImagesToStorage() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "ต้องตั้งค่า SUPABASE_URL และ SUPABASE_SERVICE_ROLE_KEY ก่อนรัน sync — รูปจะถูกอัปโหลดขึ้น Supabase Storage"
    );
  }

  const cache = new Map<string, string>();
  const stats: MigrateStats = { scanned: 0, uploaded: 0, updated: 0, skipped: 0, missing: 0 };

  async function resolveUrl(localUrl: string | null | undefined, folder: string) {
    if (!localUrl) return null;
    stats.scanned += 1;

    if (isCloudImageUrl(localUrl)) {
      stats.skipped += 1;
      return localUrl;
    }

    if (!isLocalPublicImageUrl(localUrl)) {
      stats.skipped += 1;
      return localUrl;
    }

    const cached = cache.get(localUrl);
    if (cached) return cached;

    try {
      const cloudUrl = await uploadPublicPathToSupabase(localUrl, folder);
      cache.set(localUrl, cloudUrl);
      stats.uploaded += 1;
      return cloudUrl;
    } catch (error) {
      stats.missing += 1;
      console.warn(`[migrate-images] ข้าม ${localUrl}:`, error instanceof Error ? error.message : error);
      return localUrl;
    }
  }

  async function updateIfChanged<T extends { id: string }>(
    record: T,
    field: keyof T,
    folder: string,
    update: (id: string, value: string) => Promise<unknown>
  ) {
    const current = record[field];
    if (typeof current !== "string") return;

    const next = await resolveUrl(current, folder);
    if (!next || next === current) return;

    await update(record.id, next);
    stats.updated += 1;
  }

  const gems = await prisma.gem.findMany({ select: { id: true, imageUrl: true } });
  for (const gem of gems) {
    await updateIfChanged(gem, "imageUrl", "gems", (id, imageUrl) =>
      prisma.gem.update({ where: { id }, data: { imageUrl } })
    );
  }

  const luckyStones = await prisma.luckyStone.findMany({ select: { id: true, imageUrl: true } });
  for (const stone of luckyStones) {
    await updateIfChanged(stone, "imageUrl", "lucky-stones", (id, imageUrl) =>
      prisma.luckyStone.update({ where: { id }, data: { imageUrl } })
    );
  }

  const birthstones = await prisma.birthstone.findMany({ select: { id: true, imageUrl: true } });
  for (const stone of birthstones) {
    if (!stone.imageUrl) continue;
    await updateIfChanged(stone, "imageUrl", "birthstones", (id, imageUrl) =>
      prisma.birthstone.update({ where: { id }, data: { imageUrl } })
    );
  }

  const jewelryImages = await prisma.jewelryProductImage.findMany({ select: { id: true, imageUrl: true } });
  for (const image of jewelryImages) {
    await updateIfChanged(image, "imageUrl", "jewelry", (id, imageUrl) =>
      prisma.jewelryProductImage.update({ where: { id }, data: { imageUrl } })
    );
  }

  const bannerImages = await prisma.workshopBannerImage.findMany({ select: { id: true, imageUrl: true } });
  for (const image of bannerImages) {
    await updateIfChanged(image, "imageUrl", "workshops/banners", (id, imageUrl) =>
      prisma.workshopBannerImage.update({ where: { id }, data: { imageUrl } })
    );
  }

  const featuredImages = await prisma.workshopFeaturedImage.findMany({ select: { id: true, imageUrl: true } });
  for (const image of featuredImages) {
    await updateIfChanged(image, "imageUrl", "workshops/featured", (id, imageUrl) =>
      prisma.workshopFeaturedImage.update({ where: { id }, data: { imageUrl } })
    );
  }

  const addons = await prisma.workshopAddon.findMany({ select: { id: true, imageUrl: true } });
  for (const addon of addons) {
    if (!addon.imageUrl) continue;
    await updateIfChanged(addon, "imageUrl", "workshops/addons", (id, imageUrl) =>
      prisma.workshopAddon.update({ where: { id }, data: { imageUrl } })
    );
  }

  const sampleImages = await prisma.workshopRingSampleImage.findMany({ select: { id: true, imageUrl: true } });
  for (const image of sampleImages) {
    await updateIfChanged(image, "imageUrl", "workshops/samples", (id, imageUrl) =>
      prisma.workshopRingSampleImage.update({ where: { id }, data: { imageUrl } })
    );
  }

  const workshopOptions = await prisma.workshopOption.findMany({ select: { id: true, imageUrl: true } });
  for (const option of workshopOptions) {
    if (!option.imageUrl) continue;
    await updateIfChanged(option, "imageUrl", "workshops/options", (id, imageUrl) =>
      prisma.workshopOption.update({ where: { id }, data: { imageUrl } })
    );
  }

  for (const key of ["qrcode_url", "studio_image_url"] as const) {
    const setting = await prisma.siteSetting.findUnique({ where: { key } });
    if (!setting?.value || !isLocalPublicImageUrl(setting.value) || isCloudImageUrl(setting.value)) continue;

    const next = await resolveUrl(setting.value, "site");
    if (next && next !== setting.value) {
      await prisma.siteSetting.update({ where: { key }, data: { value: next } });
      stats.updated += 1;
    }
  }

  const { repairAllJewelryProductImages } = await import("@/lib/repair-content-images");
  await repairAllJewelryProductImages();

  return stats;
}
