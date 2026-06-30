export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteBirthstone } from "@/actions/admin";
import { BirthstoneEditForm } from "@/components/admin/BirthstoneEditForm";
import { GemDeleteButton } from "@/components/admin/GemDeleteButton";
import { prisma } from "@/lib/prisma";

export default async function AdminBirthstoneEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const stone = await prisma.birthstone.findUnique({ where: { id } });
  if (!stone) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/birthstones"
            className="text-sm text-stone-500 no-underline hover:text-stone-800"
          >
            ← กลับรายการพลอยวันเกิด
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-stone-900">แก้ไขพลอยวันเกิด</h1>
          <p className="text-sm text-stone-500">{stone.month}</p>
        </div>
        <GemDeleteButton deleteAction={deleteBirthstone.bind(null, stone.id)} />
      </div>

      <BirthstoneEditForm
        stoneId={stone.id}
        initialDay={stone.month}
        initialImageUrl={stone.imageUrl}
        initialIsActive={stone.isActive}
      />
    </div>
  );
}
