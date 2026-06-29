import type { JewelryCategoryView } from "@/types";

export function collectJewelryBannerUrls(categories: JewelryCategoryView[], limit = 5): string[] {
  const urls: string[] = [];

  for (const category of categories) {
    for (const product of category.products) {
      for (const image of product.images) {
        if (image.imageUrl) {
          urls.push(image.imageUrl);
        }
      }
    }
  }

  return [...new Set(urls)].slice(0, limit);
}
