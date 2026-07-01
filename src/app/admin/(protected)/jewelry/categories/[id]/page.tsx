import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateJewelryCategory } from "@/actions/admin";

export default async function AdminJewelryCategoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await prisma.jewelryCategory.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <Link
          href="/admin/jewelry/categories"
          className="text-sm text-stone-500 no-underline hover:text-stone-800"
        >
          ← กลับหมวดหมู่
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-stone-900">แก้ไขหมวดหมู่</h1>
      </div>

      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <form action={updateJewelryCategory.bind(null, category.id)} className="space-y-4">
          <label className="block space-y-1">
            <span className="text-sm font-medium text-stone-700">ชื่อหมวด</span>
            <input
              name="name"
              defaultValue={category.name}
              required
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
            />
          </label>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="submit"
              className="rounded-lg bg-stone-900 px-5 py-2 text-sm font-medium text-white hover:bg-stone-800"
            >
              บันทึก
            </button>
            <Link
              href="/admin/jewelry/categories"
              className="rounded-lg border border-stone-200 px-5 py-2 text-sm font-medium text-stone-700 no-underline hover:bg-stone-50"
            >
              ยกเลิก
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
