import { getJewelryCategories } from "@/lib/content";
import { isDisplayableImageUrl, pickProductCoverImage } from "@/lib/image-urls";

const BRACELET_CATEGORY_SLUGS = new Set(["item", "bracelet", "bracelet-stone", "lucky-bracelet"]);

export type BraceletJewelryCategoryInfo = {
  id: string;
  slug: string;
  name: string;
};

export type BraceletJewelryProductView = {
  id: string;
  title: string;
  price: number | null;
  imageUrl: string;
  categoryId: string;
  categoryName: string;
};

export function isBraceletJewelryCategory(category: { slug: string; name: string }) {
  if (BRACELET_CATEGORY_SLUGS.has(category.slug)) return true;
  return category.name.includes("กำไล");
}

export async function getBraceletJewelryProducts(locale = "th") {
  const categories = (await getJewelryCategories(locale)).filter(isBraceletJewelryCategory);

  const products: BraceletJewelryProductView[] = categories.flatMap((category) =>
    category.products.map((product) => {
      const imageUrl = pickProductCoverImage(
        product.images.map((image) => ({
          imageUrl: image.imageUrl,
          isPrimary: image.isPrimary,
        }))
      );

      return {
        id: product.id,
        title: product.title,
        price: product.price ?? null,
        imageUrl: imageUrl && isDisplayableImageUrl(imageUrl) ? imageUrl : "",
        categoryId: category.id,
        categoryName: category.name,
      };
    })
  );

  const primaryCategory = categories[0]
    ? { id: categories[0].id, slug: categories[0].slug, name: categories[0].name }
    : null;

  return { primaryCategory, products };
}
