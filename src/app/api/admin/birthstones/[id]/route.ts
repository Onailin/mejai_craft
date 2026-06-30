import { NextRequest, NextResponse } from "next/server";
import { updateBirthstoneRecord } from "@/lib/birthstone-admin-service";
import { getSession } from "@/lib/auth-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatError(error: unknown) {
  if (error instanceof Error) return error.message;
  return "บันทึกไม่สำเร็จ";
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบใหม่" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const formData = await request.formData();
    const stone = await updateBirthstoneRecord(id, formData);
    return NextResponse.json({ ok: true, id: stone.id, imageUrl: stone.imageUrl });
  } catch (error) {
    return NextResponse.json({ error: formatError(error) }, { status: 500 });
  }
}
