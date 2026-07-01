import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteWorkshopPendantFormAction } from "@/actions/workshop-pendants";
import { GemDeleteButton } from "@/components/admin/GemDeleteButton";
import { WorkshopPendantEditForm } from "@/components/admin/WorkshopPendantEditForm";
import { displayPendantDescription } from "@/lib/workshop-pendant-utils";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminWorkshopPendantEditPage({
  params,
}: {
  params: Promise<{ id: string; optionId: string }>;
}) {
  const { id: workshopId, optionId } = await params;

  const workshop = await prisma.workshop.findUnique({
    where: { id: workshopId },
    select: { id: true, title: true },
  });
  if (!workshop) notFound();

  const option = await prisma.workshopOption.findFirst({
    where: { id: optionId, group: { workshopId, groupType: "ADDON" } },
  });
  if (!option) notFound();

  const backHref = `/admin/workshops/${workshopId}`;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href={backHref} className="text-sm text-stone-500 no-underline hover:text-stone-800">
            ← กลับเวิร์คชอป {workshop.title}
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-stone-900">แก้ไขจี้</h1>
          <p className="text-sm text-stone-500">{option.label}</p>
        </div>
        <GemDeleteButton deleteAction={deleteWorkshopPendantFormAction.bind(null, option.id)} />
      </div>

      <WorkshopPendantEditForm
        workshopId={workshopId}
        optionId={option.id}
        backHref={backHref}
        initialLabel={option.label}
        initialDescription={displayPendantDescription(option.description)}
        initialPrice={option.price}
        initialImageUrl={option.imageUrl}
      />
    </div>
  );
}
