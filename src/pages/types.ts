export type PageKey =
  | "home"
  | "about"
  | "contact"
  | "gemstones"
  | "jewelry"
  | "workshop";

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
