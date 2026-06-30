export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteJewelryProduct } from "@/actions/admin";
import { GemDeleteButton } from "@/components/admin/GemDeleteButton";
import { pickProductCoverImage } from "@/lib/image-urls";

function formatPrice(price: number | null) {
  if (price == null) return "สอบถามราคา";
  return `฿${price.toLocaleString("th-TH")}`;
}

export default async function AdminJewelryProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categoryFilter } = await searchParams;

  const products = await prisma.jewelryProduct.findMany({
    where: categoryFilter ? { categoryId: categoryFilter } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  const categories = await prisma.jewelryCategory.findMany({ orderBy: { sortOrder: "asc" } });
  const activeCategory = categoryFilter
    ? categories.find((category) => category.id === categoryFilter)
    : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">สินค้าจิวเวลรี่</h1>
          <p className="mt-1 text-sm text-stone-500">
            {activeCategory
              ? `แสดงสินค้าในหมวด "${activeCategory.name}"`
              : "จัดการสินค้าที่แสดงบนหน้า Jewelry และหน้ารายละเอียด"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/jewelry/categories"
            className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 no-underline transition hover:bg-stone-50"
          >
            จัดการหมวดหมู่
          </Link>
          <Link
            href="/admin/jewelry/products/new"
            className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white no-underline transition hover:bg-stone-800"
          >
            + เพิ่มสินค้า
          </Link>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/jewelry/products"
            className={`rounded-full px-3 py-1.5 text-sm no-underline ${
              !categoryFilter ? "bg-stone-900 text-white" : "border border-stone-200 text-stone-600"
            }`}
          >
            ทั้งหมด
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/admin/jewelry/products?category=${category.id}`}
              className={`rounded-full px-3 py-1.5 text-sm no-underline ${
                categoryFilter === category.id
                  ? "bg-stone-900 text-white"
                  : "border border-stone-200 text-stone-600"
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
              <tr>
                <th className="px-4 py-3 font-medium">รูป</th>
                <th className="px-4 py-3 font-medium">ชื่อสินค้า</th>
                <th className="px-4 py-3 font-medium">หมวดหมู่</th>
                <th className="px-4 py-3 font-medium">ราคา</th>
                <th className="px-4 py-3 font-medium">จำนวนรูป</th>
                <th className="px-4 py-3 font-medium">สถานะ</th>
                <th className="px-4 py-3 font-medium text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center">
                    <p className="text-stone-500">ยังไม่มีสินค้า</p>
                    <Link
                      href="/admin/jewelry/products/new"
                      className="mt-3 inline-block text-sm font-medium text-stone-900 no-underline hover:underline"
                    >
                      เพิ่มสินค้ารายการแรก →
                    </Link>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const cover = pickProductCoverImage(
                    product.images.map((image) => ({
                      imageUrl: image.imageUrl,
                      isPrimary: image.isPrimary,
                    }))
                  );

                  return (
                    <tr key={product.id} className="hover:bg-stone-50/80">
                      <td className="px-4 py-3">
                        {cover ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={cover} alt={product.title} className="h-14 w-14 rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-stone-100 text-xs text-stone-400">
                            ไม่มีรูป
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-stone-900">{product.title}</p>
                        {product.subtitle && (
                          <p className="text-xs text-stone-500">{product.subtitle}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-700">
                          {product.category.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-stone-800">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-4 py-3 text-stone-600">{product.images.length}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            product.isActive ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-500"
                          }`}
                        >
                          {product.isActive ? "เปิด" : "ปิด"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/jewelry/products/${product.id}`}
                            className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-stone-700 no-underline hover:bg-stone-100"
                          >
                            แก้ไข
                          </Link>
                          <GemDeleteButton deleteAction={deleteJewelryProduct.bind(null, product.id)} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
