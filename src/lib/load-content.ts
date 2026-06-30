import {
  getActiveBirthstones,
  getActiveGems,
  getActiveLuckyStones,
  getJewelryCategories,
  getJewelryProductById,
  getActiveWorkshops,
  getWorkshopCatalog,
  getSiteSettings,
} from "./content";
import {
  fallbackBirthstones,
  fallbackGems,
  fallbackJewelryCategories,
  fallbackLuckyStones,
  fallbackWorkshop,
  fallbackWorkshopCatalog,
} from "./fallback-content";
import { getBraceletJewelryProducts } from "./bracelet-jewelry-products";
import { orderProductImagesForDisplay } from "./image-urls";
import type { BirthstoneView, GemView, JewelryCategoryView, JewelryProductView, LuckyStoneView, WorkshopCatalogView, WorkshopView } from "@/types";
import { mapWorkshop, mapWorkshopCatalog } from "@/lib/workshop-mapper";

function mapGems(gems: Awaited<ReturnType<typeof getActiveGems>>): GemView[] {
  return gems.map((gem) => ({
    id: gem.id,
    name: gem.name,
    origin: gem.origin ?? "",
    color: gem.color ?? "",
    detail: gem.detail ?? "",
    hardnessMin: Number(gem.hardnessMin ?? 0),
    hardnessMax: Number(gem.hardnessMax ?? 0),
    hardnessDisplay: gem.hardnessDisplay ?? "",
    image: gem.imageUrl,
  }));
}

function mapLuckyStones(stones: Awaited<ReturnType<typeof getActiveLuckyStones>>): LuckyStoneView[] {
  return stones.map((stone) => ({
    id: stone.id,
    name: stone.name,
    meaning: stone.meaning ?? "",
    desc: stone.description ?? "",
    image: stone.imageUrl,
  }));
}

function mapBirthstones(stones: Awaited<ReturnType<typeof getActiveBirthstones>>): BirthstoneView[] {
  return stones.map((stone) => ({
    id: stone.id,
    day: stone.month,
    gemName: stone.gemName,
    gemNameEn: stone.gemNameEn ?? "",
    color: stone.color ?? "",
    origin: stone.origin ?? "",
    hardness: stone.hardness ?? "",
    detail: stone.detail ?? "",
    image: stone.imageUrl ?? "",
  }));
}

function mapCategories(categories: Awaited<ReturnType<typeof getJewelryCategories>>): JewelryCategoryView[] {
  return categories.map((cat) => ({
    id: cat.id,
    slug: cat.slug,
    name: cat.name,
    displayMode: cat.displayMode,
    products: cat.products.map((p) => ({
      id: p.id,
      title: p.title,
      subtitle: p.subtitle ?? "",
      description: p.description ?? "",
      accent: p.accent ?? "",
      price: p.price ?? null,
      categoryName: cat.name,
      categorySlug: cat.slug,
      images: orderProductImagesForDisplay(
        p.images.map((img) => ({ imageUrl: img.imageUrl, isPrimary: img.isPrimary }))
      ),
    })),
  }));
}

export async function loadGems(locale = "th"): Promise<GemView[]> {
  try {
    const gems = mapGems(await getActiveGems(locale));
    return gems.length > 0 ? gems : fallbackGems;
  } catch (error) {
    console.error("Failed to load gems:", error);
    return fallbackGems;
  }
}

export async function loadLuckyStones(locale = "th"): Promise<LuckyStoneView[]> {
  try {
    const stones = mapLuckyStones(await getActiveLuckyStones(locale));
    return stones.length > 0 ? stones : fallbackLuckyStones;
  } catch (error) {
    console.error("Failed to load lucky stones:", error);
    return fallbackLuckyStones;
  }
}

export async function loadBirthstones(locale = "th"): Promise<BirthstoneView[]> {
  try {
    const stones = mapBirthstones(await getActiveBirthstones(locale));
    return stones.length > 0 ? stones : fallbackBirthstones;
  } catch (error) {
    console.error("Failed to load birthstones:", error);
    return fallbackBirthstones;
  }
}

export async function loadJewelryCategories(locale = "th"): Promise<JewelryCategoryView[]> {
  try {
    return mapCategories(await getJewelryCategories(locale));
  } catch (error) {
    console.error("Failed to load jewelry:", error);
    return fallbackJewelryCategories;
  }
}

export async function loadJewelryProductById(id: string, locale = "th"): Promise<JewelryProductView | null> {
  try {
    const product = await getJewelryProductById(id, locale);
    if (!product) return null;

    return {
      id: product.id,
      title: product.title,
      subtitle: product.subtitle ?? "",
      description: product.description ?? "",
      accent: product.accent ?? "",
      price: product.price ?? null,
      categoryName: product.category.name,
      categorySlug: product.category.slug,
      images: orderProductImagesForDisplay(
        product.images.map((img) => ({
          imageUrl: img.imageUrl,
          isPrimary: img.isPrimary,
        }))
      ),
    };
  } catch (error) {
    console.error("Failed to load jewelry product:", error);
    return null;
  }
}

export async function loadWorkshop(locale = "th"): Promise<WorkshopView> {
  try {
    const workshops = await getActiveWorkshops(locale);
    if (workshops[0]) return mapWorkshop(workshops[0]);
    return fallbackWorkshop;
  } catch (error) {
    console.error("Failed to load workshop:", error);
    return fallbackWorkshop;
  }
}

export async function loadWorkshopCatalog(locale = "th"): Promise<WorkshopCatalogView[]> {
  try {
    const categories = await getWorkshopCatalog(locale);
    const mapped = mapWorkshopCatalog(categories);
    return mapped.length > 0 ? mapped : fallbackWorkshopCatalog;
  } catch (error) {
    console.error("Failed to load workshop catalog:", error);
    return fallbackWorkshopCatalog;
  }
}

export async function loadBraceletJewelryProducts(locale = "th") {
  try {
    return await getBraceletJewelryProducts(locale);
  } catch (error) {
    console.error("Failed to load bracelet jewelry products:", error);
    return { primaryCategory: null, products: [] };
  }
}

export async function loadSiteSettings(): Promise<Record<string, string>> {
  try {
    return await getSiteSettings();
  } catch {
    return {
      phone: "0888491111",
      facebook_url: "https://www.facebook.com/mejaicrafts",
      maps_url: "https://maps.google.com",
      address: "85 87 ถนน สุขาภิบาล ตำบลวัดใหม่ อำเภอเมืองจันทบุรี จันทบุรี 22000",
    };
  }
}
