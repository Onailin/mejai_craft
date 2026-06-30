import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";
import { loadJewelryProductById } from "@/lib/load-content";

export const revalidate = 60;

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await loadJewelryProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
