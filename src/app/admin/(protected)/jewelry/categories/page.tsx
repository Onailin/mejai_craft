export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createJewelryCategory, deleteJewelryCategory } from "@/actions/admin";
import { GemDeleteButton } from "@/components/admin/GemDeleteButton";

export default async function AdminJewelryCategoriesPage() {
  const categories = await prisma.jewelryCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">หมวดหมู่จิวเวลรี่</h1>
          <p className="mt-1 text-sm text-stone-500">เพิ่มชื่อหมวด แล้วเลือกหมวดตอนเพิ่มสินค้า</p>
        </div>
        <Link
          href="/admin/jewelry/products"
          className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 no-underline transition hover:bg-stone-50"
        >
          จัดการสินค้า →
        </Link>
      </div>

      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-base font-semibold text-stone-900">เพิ่มหมวดหมู่</h2>
        <form action={createJewelryCategory} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="min-w-0 flex-1 space-y-1">
            <span className="text-sm font-medium text-stone-700">ชื่อหมวด</span>
            <input
              name="name"
              placeholder="เช่น แหวน, กำไล, สร้อย"
              required
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
            />
          </label>
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-stone-900 px-5 py-2 text-sm font-medium text-white hover:bg-stone-800"
          >
            เพิ่ม
          </button>
        </form>
      </section>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
              <tr>
                <th className="px-4 py-3 font-medium">ชื่อหมวด</th>
                <th className="px-4 py-3 font-medium">สินค้า</th>
                <th className="px-4 py-3 font-medium text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-stone-500">
                    ยังไม่มีหมวดหมู่ — เพิ่มจากฟอร์มด้านบน
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-stone-50/80">
                    <td className="px-4 py-3 font-medium text-stone-900">{category.name}</td>
                    <td className="px-4 py-3 text-stone-600">{category._count.products} รายการ</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/jewelry/categories/${category.id}`}
                          className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-stone-700 no-underline hover:bg-stone-100"
                        >
                          แก้ไข
                        </Link>
                        <Link
                          href={`/admin/jewelry/products?category=${category.id}`}
                          className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-stone-700 no-underline hover:bg-stone-100"
                        >
                          ดูสินค้า
                        </Link>
                        <GemDeleteButton deleteAction={deleteJewelryCategory.bind(null, category.id)} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
