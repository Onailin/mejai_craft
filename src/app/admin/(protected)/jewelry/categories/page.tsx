export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createJewelryCategory, deleteJewelryCategory } from "@/actions/admin";
import { GemDeleteButton } from "@/components/admin/GemDeleteButton";
import { DisplayMode } from "@prisma/client";

const displayModeLabels: Record<DisplayMode, string> = {
  GRID: "กริดสินค้า",
  SHOWCASE: "โชว์เคส (สไลด์)",
  IMAGE_ONLY: "รูปอย่างเดียว",
};

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
          <p className="mt-1 text-sm text-stone-500">
            จัดการหมวดหมู่แยกจากสินค้า — สินค้าแต่ละชิ้นเลือกหมวดตอนเพิ่มสินค้า
          </p>
        </div>
        <Link
          href="/admin/jewelry/products"
          className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 no-underline transition hover:bg-stone-50"
        >
          ไปจัดการสินค้า →
        </Link>
      </div>

      <form
        action={createJewelryCategory}
        className="grid gap-4 rounded-2xl border border-stone-200 bg-white p-6 md:grid-cols-2"
      >
        <h2 className="md:col-span-2 text-lg font-medium text-stone-800">เพิ่มหมวดหมู่ใหม่</h2>
        <input
          name="name"
          placeholder="ชื่อหมวด (เช่น แหวน, กำไล)"
          required
          className="rounded-lg border border-stone-300 px-3 py-2"
        />
        <select name="displayMode" className="rounded-lg border border-stone-300 px-3 py-2">
          {Object.values(DisplayMode).map((mode) => (
            <option key={mode} value={mode}>
              {displayModeLabels[mode]}
            </option>
          ))}
        </select>
        <input
          name="sortOrder"
          type="number"
          defaultValue={0}
          className="rounded-lg border border-stone-300 px-3 py-2"
        />
        <label className="flex items-center gap-2 text-sm">
          <input name="isActive" type="checkbox" defaultChecked value="true" />
          เปิดใช้งาน
        </label>
        <div className="md:col-span-2">
          <button type="submit" className="rounded-lg bg-stone-900 px-5 py-2 text-sm text-white">
            เพิ่มหมวด
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
              <tr>
                <th className="px-4 py-3 font-medium">ชื่อหมวด</th>
                <th className="px-4 py-3 font-medium">slug</th>
                <th className="px-4 py-3 font-medium">รูปแบบแสดงผล</th>
                <th className="px-4 py-3 font-medium">สินค้า</th>
                <th className="px-4 py-3 font-medium">ลำดับ</th>
                <th className="px-4 py-3 font-medium">สถานะ</th>
                <th className="px-4 py-3 font-medium text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center text-stone-500">
                    ยังไม่มีหมวดหมู่
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-stone-50/80">
                    <td className="px-4 py-3 font-medium text-stone-900">{category.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-stone-500">{category.slug}</td>
                    <td className="px-4 py-3 text-stone-600">
                      {displayModeLabels[category.displayMode]}
                    </td>
                    <td className="px-4 py-3 text-stone-600">{category._count.products} รายการ</td>
                    <td className="px-4 py-3 text-stone-600">{category.sortOrder}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          category.isActive ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        {category.isActive ? "เปิด" : "ปิด"}
                      </span>
                    </td>
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
