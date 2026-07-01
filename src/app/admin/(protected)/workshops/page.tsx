import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createWorkshop, deleteWorkshop } from "@/actions/admin";
import { isBraceletWorkshop } from "@/lib/workshop-bracelet-pricing";
import { isRingWorkshop } from "@/lib/workshop-ring-pricing";

function getWorkshopTypeLabel(slug: string, categorySlug?: string | null) {
  if (isRingWorkshop(slug, categorySlug)) return "แหวน";
  if (isBraceletWorkshop(slug, categorySlug)) return "กำไล";
  return "ทั่วไป";
}

function getWorkshopTypeHint(slug: string, categorySlug?: string | null) {
  if (isRingWorkshop(slug, categorySlug)) {
    return "กรอกราคาแหวน ขนาด สีชุบ รูปตัวอย่าง";
  }
  if (isBraceletWorkshop(slug, categorySlug)) {
    return "กรอกตัวเลือกหินและเชื่อมสินค้าจิวเวลรี่";
  }
  return "กรอกข้อความและรูปตัวอย่างงาน";
}

export default async function AdminWorkshopsPage() {
  const workshops = await prisma.workshop.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      category: { select: { slug: true, name: true } },
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
      <div>
        <h1 className="text-3xl font-semibold text-stone-800">เวิร์คชอป</h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-500">
          แต่ละคอร์สมีฟอร์มไม่เหมือนกัน — ระบบจะแสดงเฉพาะส่วนที่เกี่ยวข้อง (แหวน / กำไล / ทั่วไป)
          ส่วนแบนเนอร์หน้าเว็บจัดการที่เมนู{" "}
          <Link href="/admin/banners" className="font-medium text-stone-800 underline">
            แบนเนอร์
          </Link>
        </p>
      </div>

      <form action={createWorkshop} className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-6 md:grid-cols-2">
        <input name="title" placeholder="ชื่อเวิร์คชอป" required className="rounded-lg border px-3 py-2" />
        <input name="featuredTitle" placeholder="Featured title" className="rounded-lg border px-3 py-2" />
        <input name="featuredSubtitle" placeholder="Featured subtitle" className="rounded-lg border px-3 py-2" />
        <textarea name="summary" placeholder="สรุป" className="md:col-span-2 rounded-lg border px-3 py-2" rows={3} />
        <button type="submit" className="rounded-full bg-stone-900 px-5 py-2 text-sm text-white">เพิ่มเวิร์คชอป</button>
      </form>

      <div className="space-y-4">
        {workshops.map((workshop) => {
          const typeLabel = getWorkshopTypeLabel(workshop.slug, workshop.category?.slug);
          const typeHint = getWorkshopTypeHint(workshop.slug, workshop.category?.slug);

          return (
            <div
              key={workshop.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-6"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-medium text-stone-800">{workshop.title}</h2>
                  <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
                    {typeLabel}
                  </span>
                </div>
                <p className="text-sm text-stone-500">{workshop.slug}</p>
                <p className="mt-1 text-xs text-stone-400">{typeHint}</p>
                <p className="mt-1 text-xs text-stone-400">
                  รูปตัวอย่าง: {workshop._count.featuredImages} · ขั้นตอน: {workshop._count.steps}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/workshops/${workshop.id}`}
                  className="rounded-full bg-stone-900 px-5 py-2 text-sm text-white no-underline"
                >
                  จัดการ
                </Link>
                <form action={deleteWorkshop.bind(null, workshop.id)}>
                  <button type="submit" className="rounded-full border border-red-300 px-5 py-2 text-sm text-red-600">
                    ลบ
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
