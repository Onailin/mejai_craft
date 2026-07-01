import Link from "next/link";
import { deleteLuckyStone } from "@/actions/admin";
import { GemDeleteButton } from "@/components/admin/GemDeleteButton";
import { LuckyStoneCreateForm } from "@/components/admin/LuckyStoneCreateForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminLuckyStonesPage() {
  const stones = await prisma.luckyStone.findMany({ orderBy: { sortOrder: "asc" } });
  const hasLocalOnlyImages = stones.some((stone) => stone.imageUrl?.startsWith("/uploads/"));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">หินมงคล</h1>
        <p className="mt-1 text-sm text-stone-500">
          จัดการหินนำโชคที่แสดงบนหน้าแรก — ชื่อ ความหมาย คำอธิบาย และรูป
        </p>
      </div>

      {hasLocalOnlyImages ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-950">
          <p className="font-medium">รูปบางรายการเก็บบนเครื่อง dev เท่านั้น</p>
          <p className="mt-1 text-amber-900/90">
            ตั้งค่า Supabase ใน .env แล้วอัปโหลดรูปใหม่ผ่านหน้าแก้ไขเพื่อให้ขึ้นบน production
          </p>
        </div>
      ) : null}

      <LuckyStoneCreateForm />

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
              <tr>
                <th className="px-4 py-3 font-medium">รูป</th>
                <th className="px-4 py-3 font-medium">ชื่อ</th>
                <th className="px-4 py-3 font-medium">ความหมาย</th>
                <th className="px-4 py-3 font-medium">คำอธิบาย</th>
                <th className="px-4 py-3 font-medium">สถานะ</th>
                <th className="px-4 py-3 font-medium text-right">แก้ไข</th>
                <th className="px-4 py-3 font-medium text-right">ลบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {stones.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-stone-500">
                    ยังไม่มีรายการ — เพิ่มจากฟอร์มด้านบน
                  </td>
                </tr>
              ) : (
                stones.map((stone) => (
                  <tr key={stone.id} className="hover:bg-stone-50/80">
                    <td className="px-4 py-3">
                      {stone.imageUrl ? (
                        <img
                          src={stone.imageUrl}
                          alt={stone.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-stone-100 text-xs text-stone-400">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/lucky-stones/${stone.id}`}
                        className="font-medium text-stone-900 no-underline hover:text-stone-600 hover:underline"
                      >
                        {stone.name}
                      </Link>
                    </td>
                    <td className="max-w-[140px] truncate px-4 py-3 text-stone-600">
                      {stone.meaning || "—"}
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-stone-500">
                      {stone.description || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          stone.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        {stone.isActive ? "แสดงบนเว็บ" : "ซ่อน"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/lucky-stones/${stone.id}`}
                        className="inline-flex items-center justify-center rounded-lg border border-stone-200 px-3 py-1.5 text-sm font-medium text-stone-700 no-underline hover:bg-stone-100"
                      >
                        แก้ไข
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <GemDeleteButton deleteAction={deleteLuckyStone.bind(null, stone.id)} />
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
