import type {
  WorkshopCatalogView,
  WorkshopAddonView,
  WorkshopOptionGroupView,
  WorkshopOptionGroupType,
  WorkshopRingPriceView,
  WorkshopRingSampleView,
  WorkshopView,
} from "@/types";

type WorkshopRecord = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  featuredTitle: string | null;
  featuredSubtitle: string | null;
  category?: { slug: string; name: string } | null;
  bannerImages: Array<{ imageUrl: string }>;
  featuredImages: Array<{ imageUrl: string }>;
  infoCards: Array<{ label: string; value: string }>;
  steps: Array<{ title: string; description: string | null }>;
  listItems: Array<{ listType: string; text: string }>;
  optionGroups?: Array<{
    id: string;
    groupType: string;
    title: string;
    description: string | null;
    options: Array<{
      id: string;
      label: string;
      description: string | null;
      price: number | null;
      priceNote: string | null;
      imageUrl: string | null;
    }>;
  }>;
  ringPrices?: Array<{
    style: string;
    sizeMm: number;
    plating: string;
    price: number | null;
    priceNote: string | null;
  }>;
  ringSampleImages?: Array<{
    sampleType: string;
    imageUrl: string;
  }>;
  addons?: Array<{
    addonType: string;
    label: string;
    price: number | null;
    priceNote: string | null;
    imageUrl: string | null;
  }>;
};

function mapOptionGroups(
  groups: NonNullable<WorkshopRecord["optionGroups"]>
): WorkshopOptionGroupView[] {
  return groups.map((group) => ({
    id: group.id,
    groupType: group.groupType as WorkshopOptionGroupType,
    title: group.title,
    description: group.description ?? "",
    options: group.options.map((option) => ({
      id: option.id,
      label: option.label,
      description: option.description ?? "",
      price: option.price ?? null,
      priceNote: option.priceNote ?? "",
      imageUrl: option.imageUrl ?? "",
    })),
  }));
}

export function mapWorkshop(w: WorkshopRecord): WorkshopView {
  return {
    id: w.id,
    slug: w.slug,
    categorySlug: w.category?.slug ?? "",
    categoryName: w.category?.name ?? "",
    title: w.title,
    summary: w.summary ?? "",
    featuredTitle: w.featuredTitle ?? "",
    featuredSubtitle: w.featuredSubtitle ?? "",
    bannerImages: w.bannerImages.map((image) => image.imageUrl),
    featuredImages: w.featuredImages.map((image) => image.imageUrl),
    infoCards: w.infoCards,
    classSteps: w.steps.map((step) => ({
      title: step.title,
      description: step.description ?? "",
    })),
    receivedItems: w.listItems.filter((item) => item.listType === "RECEIVED").map((item) => item.text),
    bookingTerms: w.listItems.filter((item) => item.listType === "TERMS").map((item) => item.text),
    optionGroups: mapOptionGroups(w.optionGroups ?? []),
    ringPrices: (w.ringPrices ?? []).map((row) => ({
      style: row.style as WorkshopRingPriceView["style"],
      sizeMm: row.sizeMm,
      plating: row.plating as WorkshopRingPriceView["plating"],
      price: row.price ?? null,
      priceNote: row.priceNote ?? "",
    })),
    ringSampleImages: (w.ringSampleImages ?? []).map((sample) => ({
      sampleType: sample.sampleType as WorkshopRingSampleView["sampleType"],
      imageUrl: sample.imageUrl,
    })),
    addons: (w.addons ?? []).map((addon) => ({
      addonType: addon.addonType as WorkshopAddonView["addonType"],
      label: addon.label,
      price: addon.price ?? null,
      priceNote: addon.priceNote ?? "",
      imageUrl: addon.imageUrl ?? "",
    })),
  };
}

export function mapWorkshopCatalog(
  categories: Array<{
    id: string;
    slug: string;
    name: string;
    description: string | null;
    workshops: WorkshopRecord[];
  }>
): WorkshopCatalogView[] {
  return categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description ?? "",
    workshops: category.workshops.map(mapWorkshop),
  }));
}
