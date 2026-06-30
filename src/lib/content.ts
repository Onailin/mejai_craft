import { prisma } from "./prisma";
import { applyTranslations } from "./translate";
import { ensureContentImagesRepaired, repairJewelryProductImages } from "./repair-content-images";
import { isDisplayableImageUrl } from "./image-urls";
import type { Prisma } from "@prisma/client";

export async function getActiveGems(locale = "th") {
  const gems = await prisma.gem.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return applyTranslations("gem", gems, ["name", "origin", "color", "detail", "hardnessDisplay"], locale);
}

export async function getActiveLuckyStones(locale = "th") {
  const stones = await prisma.luckyStone.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return applyTranslations("lucky_stone", stones, ["name", "meaning", "description"], locale);
}

export async function getActiveBirthstones(locale = "th") {
  const birthstones = await prisma.birthstone.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const translated = await applyTranslations(
    "birthstone",
    birthstones,
    ["month", "gemName", "color", "origin", "hardness", "detail"],
    locale
  );

  return translated.filter((stone) => isDisplayableImageUrl(stone.imageUrl));
}

export async function getJewelryCategories(locale = "th") {
  await ensureContentImagesRepaired();

  const categories = await prisma.jewelryCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      products: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });

  const translatedCategories = await applyTranslations(
    "jewelry_category",
    categories,
    ["name"],
    locale
  );

  return Promise.all(
    translatedCategories.map(async (category) => {
      const products = await applyTranslations(
        "jewelry_product",
        category.products,
        ["title", "subtitle", "description", "accent"],
        locale
      );
      return { ...category, products };
    })
  );
}

export async function getJewelryProductById(id: string, locale = "th") {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    await repairJewelryProductImages(id).catch(() => undefined);
  }

  const product = await prisma.jewelryProduct.findFirst({
    where: { id, isActive: true },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product) return null;

  const [translatedProduct] = await applyTranslations(
    "jewelry_product",
    [product],
    ["title", "subtitle", "description", "accent"],
    locale
  );

  const [translatedCategory] = await applyTranslations(
    "jewelry_category",
    [product.category],
    ["name"],
    locale
  );

  return {
    ...translatedProduct,
    category: translatedCategory,
  };
}

const workshopInclude = {
  category: true,
  bannerImages: { orderBy: { sortOrder: "asc" as const } },
  featuredImages: { orderBy: { sortOrder: "asc" as const } },
  infoCards: { orderBy: { sortOrder: "asc" as const } },
  steps: { orderBy: { sortOrder: "asc" as const } },
  listItems: { orderBy: { sortOrder: "asc" as const } },
  optionGroups: {
    orderBy: { sortOrder: "asc" as const },
    include: {
      options: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" as const },
      },
    },
  },
  ringPrices: true,
  ringSampleImages: true,
  addons: true,
};

type WorkshopWithRelations = Prisma.WorkshopGetPayload<{ include: typeof workshopInclude }>;

export async function getActiveWorkshops(locale = "th") {
  const workshops = await prisma.workshop.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: workshopInclude,
  });

  return translateWorkshops(workshops, locale);
}

async function translateWorkshops(workshops: WorkshopWithRelations[], locale: string) {
  const translated = await applyTranslations(
    "workshop",
    workshops,
    ["title", "summary", "featuredTitle", "featuredSubtitle"],
    locale
  );

  return Promise.all(
    translated.map(async (workshop) => {
      const [infoCards, steps, listItems, optionGroups] = await Promise.all([
        applyTranslations("workshop_info_card", workshop.infoCards, ["label", "value"], locale),
        applyTranslations("workshop_step", workshop.steps, ["title", "description"], locale),
        applyTranslations("workshop_list_item", workshop.listItems, ["text"], locale),
        Promise.all(
          workshop.optionGroups.map(async (group) => {
            const [translatedGroup] = await applyTranslations(
              "workshop_option_group",
              [group],
              ["title", "description"],
              locale
            );
            const options = await applyTranslations(
              "workshop_option",
              group.options,
              ["label", "description", "priceNote"],
              locale
            );
            return { ...translatedGroup, options };
          })
        ),
      ]);

      const category = workshop.category
        ? (
            await applyTranslations(
              "workshop_category",
              [workshop.category],
              ["name", "description"],
              locale
            )
          )[0]
        : null;

      return { ...workshop, category, infoCards, steps, listItems, optionGroups };
    })
  );
}

export async function getWorkshopCatalog(locale = "th") {
  const categories = await prisma.workshopCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      workshops: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        include: workshopInclude,
      },
    },
  });

  const translatedCategories = await applyTranslations(
    "workshop_category",
    categories,
    ["name", "description"],
    locale
  );

  return Promise.all(
    translatedCategories.map(async (category) => {
      const workshops = await translateWorkshops(category.workshops, locale);
      return { ...category, workshops };
    })
  );
}

export async function getSiteSettings() {
  const settings = await prisma.siteSetting.findMany();
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
}

export async function getSiteSetting(key: string, fallback = "") {
  const setting = await prisma.siteSetting.findUnique({ where: { key } });
  return setting?.value ?? fallback;
}
