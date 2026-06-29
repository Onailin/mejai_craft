import type { Metadata } from "next";
import ProductListing from "@/components/ProductListing";
import { loadJewelryCategories } from "@/lib/load-content";
import { toListingCategories, toListingProducts } from "@/lib/jewelry-listing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "สินค้า | Mejai Crafts",
};

export default async function JewelryPage() {
  const categories = await loadJewelryCategories("th");
  const products = toListingProducts(categories);
  const filterCategories = toListingCategories(categories);

  return <ProductListing products={products} categories={filterCategories} />;
}
