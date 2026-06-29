import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { saveWorkshopRingPricing, updateWorkshopFormAction } from "@/actions/admin";
import { WorkshopFeaturedImagesForm } from "@/components/admin/WorkshopFeaturedImagesForm";
import { WorkshopGeneralForm } from "@/components/admin/WorkshopGeneralForm";
import { WorkshopRingPricingForm } from "@/components/admin/WorkshopRingPricingForm";
import { isRingWorkshop } from "@/lib/workshop-ring-pricing";

export const dynamic = "force-dynamic";

export default async function AdminWorkshopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workshop = await prisma.workshop.findUnique({
    where: { id },
    include: {
      category: true,
      featuredImages: { orderBy: { sortOrder: "asc" } },
      infoCards: { orderBy: { sortOrder: "asc" } },
      steps: { orderBy: { sortOrder: "asc" } },
      listItems: { orderBy: { sortOrder: "asc" } },
      ringPrices: true,
      ringSampleImages: true,
      addons: true,
    },
  });

  if (!workshop) notFound();

  const showRingPricing = isRingWorkshop(workshop.slug, workshop.category?.slug);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <Link href="/admin/workshops" className="text-sm text-stone-500 no-underline hover:text-stone-800">
          ← กลับรายการเวิร์คชอป
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-stone-900">{workshop.title}</h1>
        <p className="text-sm text-stone-500">
          {workshop.category?.name ?? "ไม่มีหมวด"} · {workshop.slug}
        </p>
      </div>

      <WorkshopFeaturedImagesForm workshopId={workshop.id} images={workshop.featuredImages} />

      <WorkshopGeneralForm
        workshopId={workshop.id}
        title={workshop.title}
        summary={workshop.summary ?? ""}
        featuredTitle={workshop.featuredTitle ?? ""}
        featuredSubtitle={workshop.featuredSubtitle ?? ""}
        action={updateWorkshopFormAction}
      />

      {showRingPricing ? (
        <WorkshopRingPricingForm
          workshopId={workshop.id}
          ringPrices={workshop.ringPrices}
          ringSampleImages={workshop.ringSampleImages}
          addons={workshop.addons}
          saveAction={saveWorkshopRingPricing}
        />
      ) : (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          เวิร์คชอปนี้ยังไม่ใช่แบบฟอร์มแหวน — ใช้ฟอร์มราคาแบบตารางได้เมื่อ slug เป็น `silver-ring`
        </div>
      )}

    </div>
  );
}
