import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deleteJewelryProduct } from "@/actions/admin";
import { JewelryProductForm } from "@/components/admin/JewelryProductForm";

export const dynamic = "force-dynamic";

export default async function AdminJewelryProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [categories, product] = await Promise.all([
    prisma.jewelryCategory.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true },
    }),
    prisma.jewelryProduct.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    }),
  ]);

  if (!product) notFound();

  return (
    <JewelryProductForm
      categories={categories}
      product={{
        categoryId: product.categoryId,
        title: product.title,
        subtitle: product.subtitle ?? "",
        description: product.description ?? "",
        price: product.price,
        isActive: product.isActive,
        images: product.images.map((image) => ({
          id: image.id,
          imageUrl: image.imageUrl,
          isPrimary: image.isPrimary,
        })),
      }}
      productId={product.id}
      deleteAction={deleteJewelryProduct.bind(null, product.id)}
      pageTitle="แก้ไขสินค้า"
      pageDescription={product.title}
      submitLabel="บันทึกการเปลี่ยนแปลง"
    />
  );
}
