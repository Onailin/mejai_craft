import Link from "next/link";
import { deleteBirthstone } from "@/actions/admin";
import { BirthstoneCreateForm } from "@/components/admin/BirthstoneCreateForm";
import { GemDeleteButton } from "@/components/admin/GemDeleteButton";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminBirthstonesPage() {
  const stones = await prisma.birthstone.findMany({ orderBy: { sortOrder: "asc" } });
  const hasLocalOnlyImages = stones.some((stone) => stone.imageUrl?.startsWith("/uploads/"));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">พลอยประจำวันเกิด</h1>
        <p className="mt-1 text-sm text-stone-500">
          เลือกวันแล้วอัปโหลดรูป รูปที่อัปโหลดแล้วเท่านั้นจะแสดงบนหน้า Home
        </p>
      </div>

      {hasLocalOnlyImages ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-950">
          <p className="font-medium">รูปบางรายการเก็บบนเครื่อง dev เท่านั้น</p>
          <p className="mt-1 text-amber-900/90">
            ถ้าใช้ database เดียวกับ production รูปที่อัปโหลดใน localhost จะไม่ขึ้นหลัง deploy —
            ตั้งค่า <code className="rounded bg-amber-100 px-1">SUPABASE_URL</code> และ{" "}
            <code className="rounded bg-amber-100 px-1">SUPABASE_SERVICE_ROLE_KEY</code> ใน .env
            แล้วอัปโหลดรูปใหม่ผ่านหน้าแก้ไข
          </p>
        </div>
      ) : null}

      <BirthstoneCreateForm />

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
              <tr>
                <th className="px-4 py-3 font-medium">รูป</th>
                <th className="px-4 py-3 font-medium">วัน</th>
                <th className="px-4 py-3 font-medium">สถานะ</th>
                <th className="px-4 py-3 font-medium text-right">แก้ไข</th>
                <th className="px-4 py-3 font-medium text-right">ลบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {stones.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-stone-500">
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
                          alt={stone.month}
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
                        href={`/admin/birthstones/${stone.id}`}
                        className="font-medium text-stone-900 no-underline hover:text-stone-600 hover:underline"
                      >
                        {stone.month}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          stone.imageUrl && stone.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        {stone.imageUrl && stone.isActive ? "แสดงบนเว็บ" : "ยังไม่แสดง"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/birthstones/${stone.id}`}
                        className="inline-flex items-center justify-center rounded-lg border border-stone-200 px-3 py-1.5 text-sm font-medium text-stone-700 no-underline hover:bg-stone-100"
                      >
                        แก้ไข
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <GemDeleteButton deleteAction={deleteBirthstone.bind(null, stone.id)} />
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
