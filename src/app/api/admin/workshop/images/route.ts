import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-helpers";
import { processWorkshopImageUpload } from "@/lib/workshop-image-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatError(error: unknown) {
  if (error instanceof Error) return error.message;
  return "อัปโหลดรูปไม่สำเร็จ";
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบใหม่" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const result = await processWorkshopImageUpload(formData);
    return NextResponse.json({ ok: true, imageUrl: result.imageUrl, id: result.id });
  } catch (error) {
    console.error("Workshop image upload failed:", error);
    return NextResponse.json({ error: formatError(error) }, { status: 500 });
  }
}
