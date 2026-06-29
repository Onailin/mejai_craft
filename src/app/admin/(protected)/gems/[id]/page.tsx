export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deleteGem, updateGem } from "@/actions/admin";
import { GemDeleteButton } from "@/components/admin/GemDeleteButton";

export default async function AdminGemEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gem = await prisma.gem.findUnique({ where: { id } });
  if (!gem) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/gems" className="text-sm text-stone-500 no-underline hover:text-stone-800">
            ← กลับรายการพลอย
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-stone-900">แก้ไขพลอย</h1>
          <p className="text-sm text-stone-500">{gem.slug}</p>
        </div>
        <GemDeleteButton deleteAction={deleteGem.bind(null, gem.id)} />
      </div>

      <form
        action={updateGem.bind(null, gem.id)}
        className="grid gap-4 rounded-2xl border border-stone-200 bg-white p-6 md:grid-cols-2"
      >
        <div className="md:col-span-2 flex items-center gap-4">
          <img src={gem.imageUrl} alt={gem.name} className="h-24 w-24 rounded-lg object-cover" />
          <p className="text-sm text-stone-500">อัปโหลดรูปใหม่ด้านล่าง (ถ้าไม่เลือกจะใช้รูปเดิม)</p>
        </div>

        <label className="space-y-1">
          <span className="text-sm text-stone-600">ชื่อพลอย</span>
          <input name="name" defaultValue={gem.name} required className="w-full rounded-lg border border-stone-300 px-3 py-2" />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-stone-600">แหล่งที่มา</span>
          <input name="origin" defaultValue={gem.origin ?? ""} className="w-full rounded-lg border border-stone-300 px-3 py-2" />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-stone-600">สี</span>
          <input name="color" defaultValue={gem.color ?? ""} className="w-full rounded-lg border border-stone-300 px-3 py-2" />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-stone-600">ความแข็ง (แสดงผล)</span>
          <input
            name="hardnessDisplay"
            defaultValue={gem.hardnessDisplay ?? ""}
            className="w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-stone-600">Hardness min</span>
          <input
            name="hardnessMin"
            type="number"
            step="0.1"
            defaultValue={Number(gem.hardnessMin ?? 0)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-stone-600">Hardness max</span>
          <input
            name="hardnessMax"
            type="number"
            step="0.1"
            defaultValue={Number(gem.hardnessMax ?? 0)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </label>
        <label className="md:col-span-2 space-y-1">
          <span className="text-sm text-stone-600">รายละเอียด</span>
          <textarea
            name="detail"
            defaultValue={gem.detail ?? ""}
            className="w-full rounded-lg border border-stone-300 px-3 py-2"
            rows={4}
          />
        </label>
        <label className="md:col-span-2 space-y-1">
          <span className="text-sm text-stone-600">รูปภาพใหม่</span>
          <input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="w-full" />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-stone-600">ลำดับ</span>
          <input
            name="sortOrder"
            type="number"
            defaultValue={gem.sortOrder}
            className="w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </label>
        <label className="flex items-center gap-2 self-end text-sm">
          <input name="isActive" type="checkbox" defaultChecked={gem.isActive} value="true" />
          เปิดใช้งาน
        </label>

        <div className="md:col-span-2 flex gap-2">
          <button type="submit" className="rounded-lg bg-stone-900 px-5 py-2 text-sm text-white">
            บันทึก
          </button>
          <Link
            href="/admin/gems"
            className="rounded-lg border border-stone-200 px-5 py-2 text-sm text-stone-700 no-underline hover:bg-stone-50"
          >
            ยกเลิก
          </Link>
        </div>
      </form>
    </div>
  );
}
