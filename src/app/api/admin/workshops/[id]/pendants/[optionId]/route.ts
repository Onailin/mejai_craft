import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-helpers";
import {
  formatWorkshopPendantError,
  updateWorkshopPendantRecord,
} from "@/lib/workshop-pendant-admin-service";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; optionId: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบใหม่" }, { status: 401 });
  }

  try {
    const { id: workshopId, optionId } = await params;
    const option = await prisma.workshopOption.findFirst({
      where: { id: optionId, group: { workshopId, groupType: "ADDON" } },
    });
    if (!option) {
      return NextResponse.json({ error: "ไม่พบรายการจี้" }, { status: 404 });
    }

    const formData = await request.formData();
    const updated = await updateWorkshopPendantRecord(optionId, formData);
    return NextResponse.json({
      ok: true,
      id: updated.id,
      imageUrl: updated.imageUrl ?? null,
    });
  } catch (error) {
    console.error("Update workshop pendant failed:", error);
    return NextResponse.json({ error: formatWorkshopPendantError(error) }, { status: 500 });
  }
}
