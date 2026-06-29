import type { ListingCategory, ListingProduct } from "@/components/ProductListing";
import type { JewelryCategoryView } from "@/types";

export function toListingProducts(categories: JewelryCategoryView[]): ListingProduct[] {
  return categories.flatMap((category) =>
    category.products.map((product) => ({
      id: product.id,
      name: product.title,
      subLabel: product.subtitle,
      description: product.description || undefined,
      category: category.slug,
      imageUrl:
        product.images.find((image) => image.isPrimary)?.imageUrl ?? product.images[0]?.imageUrl,
      price: product.price ?? undefined,
    }))
  );
}

export function toListingCategories(categories: JewelryCategoryView[]): ListingCategory[] {
  return [
    { id: "all", label: "ทั้งหมด" },
    ...categories.map((category) => ({ id: category.slug, label: category.name })),
  ];
}
