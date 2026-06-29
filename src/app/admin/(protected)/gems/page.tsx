export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createGem, deleteGem } from "@/actions/admin";
import { GemDeleteButton } from "@/components/admin/GemDeleteButton";

export default async function AdminGemsPage() {
  const gems = await prisma.gem.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">พลอย</h1>
        <p className="mt-1 text-sm text-stone-500">จัดการพลอยที่แสดงบนหน้าเว็บ</p>
      </div>

      <form
        action={createGem}
        className="grid gap-4 rounded-2xl border border-stone-200 bg-white p-6 md:grid-cols-2"
      >
        <h2 className="md:col-span-2 text-lg font-medium text-stone-800">เพิ่มพลอยใหม่</h2>
        <input name="name" placeholder="ชื่อพลอย" required className="rounded-lg border border-stone-300 px-3 py-2" />
        <input name="origin" placeholder="แหล่งที่มา" className="rounded-lg border border-stone-300 px-3 py-2" />
        <input name="color" placeholder="สี" className="rounded-lg border border-stone-300 px-3 py-2" />
        <input
          name="hardnessDisplay"
          placeholder="ความแข็ง (เช่น 9 Mohs)"
          className="rounded-lg border border-stone-300 px-3 py-2"
        />
        <textarea
          name="detail"
          placeholder="รายละเอียด"
          className="md:col-span-2 rounded-lg border border-stone-300 px-3 py-2"
          rows={3}
        />
        <input name="image" type="file" accept="image/jpeg,image/png,image/webp" required className="md:col-span-2" />
        <input name="sortOrder" type="number" defaultValue={0} className="rounded-lg border border-stone-300 px-3 py-2" />
        <label className="flex items-center gap-2 text-sm">
          <input name="isActive" type="checkbox" defaultChecked value="true" />
          เปิดใช้งาน
        </label>
        <div className="md:col-span-2">
          <button type="submit" className="rounded-lg bg-stone-900 px-5 py-2 text-sm text-white">
            เพิ่มพลอย
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
              <tr>
                <th className="px-4 py-3 font-medium">รูป</th>
                <th className="px-4 py-3 font-medium">ชื่อ</th>
                <th className="px-4 py-3 font-medium">แหล่งที่มา</th>
                <th className="px-4 py-3 font-medium">สี</th>
                <th className="px-4 py-3 font-medium">ความแข็ง</th>
                <th className="px-4 py-3 font-medium">ลำดับ</th>
                <th className="px-4 py-3 font-medium">สถานะ</th>
                <th className="px-4 py-3 font-medium text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {gems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-stone-500">
                    ยังไม่มีพลอย — เพิ่มรายการด้านบน
                  </td>
                </tr>
              ) : (
                gems.map((gem) => (
                  <tr key={gem.id} className="hover:bg-stone-50/80">
                    <td className="px-4 py-3">
                      <img src={gem.imageUrl} alt={gem.name} className="h-12 w-12 rounded-lg object-cover" />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-stone-900">{gem.name}</p>
                      <p className="text-xs text-stone-400">{gem.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-stone-600">{gem.origin || "—"}</td>
                    <td className="px-4 py-3 text-stone-600">{gem.color || "—"}</td>
                    <td className="px-4 py-3 text-stone-600">{gem.hardnessDisplay || "—"}</td>
                    <td className="px-4 py-3 text-stone-600">{gem.sortOrder}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          gem.isActive ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        {gem.isActive ? "เปิด" : "ปิด"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/gems/${gem.id}`}
                          className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-stone-700 no-underline hover:bg-stone-100"
                        >
                          แก้ไข
                        </Link>
                        <GemDeleteButton deleteAction={deleteGem.bind(null, gem.id)} />
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
