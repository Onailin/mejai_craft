export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteLuckyStone } from "@/actions/admin";
import { GemDeleteButton } from "@/components/admin/GemDeleteButton";
import { LuckyStoneEditForm } from "@/components/admin/LuckyStoneEditForm";
import { prisma } from "@/lib/prisma";

export default async function AdminLuckyStoneEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const stone = await prisma.luckyStone.findUnique({ where: { id } });
  if (!stone) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/lucky-stones"
            className="text-sm text-stone-500 no-underline hover:text-stone-800"
          >
            ← กลับรายการหินมงคล
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-stone-900">แก้ไขหินมงคล</h1>
          <p className="text-sm text-stone-500">{stone.name}</p>
        </div>
        <GemDeleteButton deleteAction={deleteLuckyStone.bind(null, stone.id)} />
      </div>

      <LuckyStoneEditForm
        stoneId={stone.id}
        initialName={stone.name}
        initialMeaning={stone.meaning ?? ""}
        initialDescription={stone.description ?? ""}
        initialImageUrl={stone.imageUrl}
        initialIsActive={stone.isActive}
      />
    </div>
  );
}
