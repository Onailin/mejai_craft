export type PageKey = "home" | "about" | "contact" | "jewelry" | "workshop";

export type ProductCard = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  accent: string;
};

export type PageContent = {
  id: PageKey;
  navLabel: string;
  title: string;
  eyebrow: string;
  description: string;
  cards: ProductCard[];
};

export type GemView = {
  id: string;
  name: string;
  origin: string;
  color: string;
  detail: string;
  hardnessMin: number;
  hardnessMax: number;
  hardnessDisplay: string;
  image: string;
};

export type LuckyStoneView = {
  id: string;
  name: string;
  meaning: string;
  desc: string;
  image: string;
};

export type BirthstoneView = {
  id: string;
  day: string;
  gemName: string;
  gemNameEn: string;
  color: string;
  origin: string;
  hardness: string;
  detail: string;
  image: string;
};

export type JewelryCategoryView = {
  id: string;
  slug: string;
  name: string;
  displayMode: "GRID" | "SHOWCASE" | "IMAGE_ONLY";
  products: JewelryProductView[];
};

export type JewelryProductView = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  price: number | null;
  categoryName: string;
  categorySlug: string;
  images: Array<{ imageUrl: string; isPrimary: boolean }>;
};

export type WorkshopOptionGroupType = "STYLE" | "SIZE" | "PLATING" | "ADDON" | "CUSTOM";

export type WorkshopOptionView = {
  id: string;
  label: string;
  description: string;
  price: number | null;
  priceNote: string;
  imageUrl: string;
};

export type WorkshopOptionGroupView = {
  id: string;
  groupType: WorkshopOptionGroupType;
  title: string;
  description: string;
  options: WorkshopOptionView[];
};

export type WorkshopView = {
  id: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  title: string;
  summary: string;
  featuredTitle: string;
  featuredSubtitle: string;
  bannerImages: string[];
  featuredImages: string[];
  infoCards: Array<{ label: string; value: string }>;
  classSteps: Array<{ title: string; description: string }>;
  receivedItems: string[];
  bookingTerms: string[];
  optionGroups: WorkshopOptionGroupView[];
  ringPrices: WorkshopRingPriceView[];
  ringSampleImages: WorkshopRingSampleView[];
  addons: WorkshopAddonView[];
};

export type WorkshopRingPriceView = {
  style: "CLASSIC" | "TEXTURE";
  sizeMm: number;
  plating: "WHITE_GOLD" | "GOLD" | "ROSE_GOLD";
  price: number | null;
  priceNote: string;
};

export type WorkshopRingSampleView = {
  sampleType:
    | "STYLE_CLASSIC"
    | "STYLE_TEXTURE"
    | "PLATING_WHITE_GOLD"
    | "PLATING_GOLD"
    | "PLATING_ROSE_GOLD"
    | "SIZE_2MM"
    | "SIZE_3MM"
    | "SIZE_4MM"
    | "SIZE_5MM";
  imageUrl: string;
};

export type WorkshopAddonView = {
  addonType: "LASER" | "STONE_SETTING";
  label: string;
  price: number | null;
  priceNote: string;
  imageUrl: string;
};

export type WorkshopCatalogView = {
  id: string;
  slug: string;
  name: string;
  description: string;
  workshops: WorkshopView[];
};
