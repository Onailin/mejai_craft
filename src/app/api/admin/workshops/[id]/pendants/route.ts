import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-helpers";
import {
  createWorkshopPendantRecord,
  formatWorkshopPendantError,
} from "@/lib/workshop-pendant-admin-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบใหม่" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const formData = await request.formData();
    const option = await createWorkshopPendantRecord(id, formData);
    return NextResponse.json({
      ok: true,
      id: option.id,
      imageUrl: option.imageUrl ?? null,
    });
  } catch (error) {
    console.error("Create workshop pendant failed:", error);
    return NextResponse.json({ error: formatWorkshopPendantError(error) }, { status: 500 });
  }
}
