import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { saveWorkshopRingPricing, updateWorkshopFormAction } from "@/actions/admin";
import { WorkshopBannerImagesForm } from "@/components/admin/WorkshopBannerImagesForm";
import { WorkshopBraceletPricingForm } from "@/components/admin/WorkshopBraceletPricingForm";
import { WorkshopFeaturedImagesForm } from "@/components/admin/WorkshopFeaturedImagesForm";
import { WorkshopGeneralForm } from "@/components/admin/WorkshopGeneralForm";
import { WorkshopRingPricingForm } from "@/components/admin/WorkshopRingPricingForm";
import { ensureBraceletWorkshopOptions } from "@/lib/ensure-bracelet-workshop-options";
import { isBraceletWorkshop } from "@/lib/workshop-bracelet-pricing";
import { mapOptionGroups } from "@/lib/workshop-mapper";
import { isRingWorkshop } from "@/lib/workshop-ring-pricing";

export const dynamic = "force-dynamic";

export default async function AdminWorkshopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let workshop = await prisma.workshop.findUnique({
    where: { id },
    include: {
      category: true,
      bannerImages: { orderBy: { sortOrder: "asc" } },
      featuredImages: { orderBy: { sortOrder: "asc" } },
      infoCards: { orderBy: { sortOrder: "asc" } },
      steps: { orderBy: { sortOrder: "asc" } },
      listItems: { orderBy: { sortOrder: "asc" } },
      ringPrices: true,
      ringSampleImages: true,
      addons: true,
      optionGroups: {
        orderBy: { sortOrder: "asc" },
        include: {
          options: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });

  if (!workshop) notFound();

  const showRingPricing = isRingWorkshop(workshop.slug, workshop.category?.slug);
  const showBraceletPricing = isBraceletWorkshop(workshop.slug, workshop.category?.slug);

  if (showBraceletPricing) {
    await ensureBraceletWorkshopOptions(workshop.id);
    workshop = await prisma.workshop.findUnique({
      where: { id },
      include: {
        category: true,
        bannerImages: { orderBy: { sortOrder: "asc" } },
        featuredImages: { orderBy: { sortOrder: "asc" } },
        infoCards: { orderBy: { sortOrder: "asc" } },
        steps: { orderBy: { sortOrder: "asc" } },
        listItems: { orderBy: { sortOrder: "asc" } },
        ringPrices: true,
        ringSampleImages: true,
        addons: true,
        optionGroups: {
          orderBy: { sortOrder: "asc" },
          include: {
            options: { orderBy: { sortOrder: "asc" } },
          },
        },
      },
    });
    if (!workshop) notFound();
  }

  const braceletOptionGroups = mapOptionGroups(workshop.optionGroups);

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

      <WorkshopBannerImagesForm
        workshopId={workshop.id}
        images={workshop.bannerImages.map((image) => ({
          id: image.id,
          imageUrl: image.imageUrl,
        }))}
      />

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
      ) : null}

      {showBraceletPricing ? (
        <WorkshopBraceletPricingForm workshopId={workshop.id} optionGroups={braceletOptionGroups} />
      ) : null}

      {!showRingPricing && !showBraceletPricing ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          อัปโหลดรูปตัวอย่างได้ที่ &quot;รูปตัวอย่างงาน&quot; ด้านบน
        </div>
      ) : null}
    </div>
  );
}
