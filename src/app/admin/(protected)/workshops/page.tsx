import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createWorkshop, deleteWorkshop } from "@/actions/admin";

export default async function AdminWorkshopsPage() {
  const workshops = await prisma.workshop.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: {
          featuredImages: true,
          infoCards: true,
          steps: true,
        },
      },
    },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold text-stone-800">Workshops</h1>

      <form action={createWorkshop} className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-6 md:grid-cols-2">
        <input name="title" placeholder="ชื่อเวิร์คชอป" required className="rounded-lg border px-3 py-2" />
        <input name="featuredTitle" placeholder="Featured title" className="rounded-lg border px-3 py-2" />
        <input name="featuredSubtitle" placeholder="Featured subtitle" className="rounded-lg border px-3 py-2" />
        <textarea name="summary" placeholder="สรุป" className="md:col-span-2 rounded-lg border px-3 py-2" rows={3} />
        <button type="submit" className="rounded-full bg-stone-900 px-5 py-2 text-sm text-white">เพิ่มเวิร์คชอป</button>
      </form>

      <div className="space-y-4">
        {workshops.map((workshop) => (
          <div key={workshop.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-6">
            <div>
              <h2 className="text-lg font-medium text-stone-800">{workshop.title}</h2>
              <p className="text-sm text-stone-500">{workshop.slug}</p>
              <p className="mt-1 text-xs text-stone-400">
                featured: {workshop._count.featuredImages} · steps: {workshop._count.steps}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/workshops/${workshop.id}`} className="rounded-full bg-stone-900 px-5 py-2 text-sm text-white no-underline">
                จัดการ
              </Link>
              <form action={deleteWorkshop.bind(null, workshop.id)}>
                <button type="submit" className="rounded-full border border-red-300 px-5 py-2 text-sm text-red-600">ลบ</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
