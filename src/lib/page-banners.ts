import { prisma } from "./prisma";
import { getPage, DEFAULT_WORKSHOP_PAGE_BANNERS } from "./pages";

export const PAGE_BANNER_HOME_KEY = "page_banner_home";
export const PAGE_BANNER_WORKSHOP_KEY = "page_banner_workshop";

export { DEFAULT_WORKSHOP_PAGE_BANNERS };

function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  } catch {
    return [];
  }
}

export function getDefaultHomeBannerImage() {
  return getPage("home").cards[0]?.image ?? "";
}

export function getDefaultWorkshopBannerImages() {
  const images = getPage("workshop")
    .cards.map((card) => card.image)
    .filter(Boolean);
  return images.length > 0 ? images : [...DEFAULT_WORKSHOP_PAGE_BANNERS];
}

export async function getHomeBannerImage() {
  const setting = await prisma.siteSetting.findUnique({ where: { key: PAGE_BANNER_HOME_KEY } });
  if (!setting) return getDefaultHomeBannerImage();
  if (setting.value === "") return "";
  return setting.value;
}

export async function getWorkshopPageBannerImages() {
  const setting = await prisma.siteSetting.findUnique({ where: { key: PAGE_BANNER_WORKSHOP_KEY } });
  if (!setting) return getDefaultWorkshopBannerImages();
  return parseJsonArray(setting.value);
}
