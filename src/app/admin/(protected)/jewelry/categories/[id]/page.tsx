import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateJewelryCategory } from "@/actions/admin";
import { DisplayMode } from "@prisma/client";

const displayModeLabels: Record<DisplayMode, string> = {
  GRID: "กริดสินค้า",
  SHOWCASE: "โชว์เคส (สไลด์)",
  IMAGE_ONLY: "รูปอย่างเดียว",
};

export default async function AdminJewelryCategoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await prisma.jewelryCategory.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link href="/admin/jewelry/categories" className="text-sm text-stone-500 no-underline hover:text-stone-800">
          ← กลับหมวดหมู่
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-stone-900">แก้ไขหมวดหมู่</h1>
        <p className="mt-1 text-sm text-stone-500">slug: {category.slug}</p>
      </div>

      <form action={updateJewelryCategory.bind(null, category.id)} className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6">
        <input
          name="name"
          defaultValue={category.name}
          required
          className="w-full rounded-lg border border-stone-300 px-3 py-2"
        />
        <select name="displayMode" defaultValue={category.displayMode} className="w-full rounded-lg border border-stone-300 px-3 py-2">
          {Object.values(DisplayMode).map((mode) => (
            <option key={mode} value={mode}>
              {displayModeLabels[mode]}
            </option>
          ))}
        </select>
        <input
          name="sortOrder"
          type="number"
          defaultValue={category.sortOrder}
          className="w-full rounded-lg border border-stone-300 px-3 py-2"
        />
        <label className="flex items-center gap-2 text-sm">
          <input name="isActive" type="checkbox" defaultChecked={category.isActive} value="true" />
          เปิดใช้งาน
        </label>
        <button type="submit" className="rounded-lg bg-stone-900 px-5 py-2 text-sm text-white">
          บันทึก
        </button>
      </form>
    </div>
  );
}
