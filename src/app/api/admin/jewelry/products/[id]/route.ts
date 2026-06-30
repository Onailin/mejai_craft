import { NextRequest, NextResponse } from "next/server";
import {
  formatJewelryProductError,
  updateJewelryProductRecord,
} from "@/lib/jewelry-product-admin-service";
import { getSession } from "@/lib/auth-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    const { product, message } = await updateJewelryProductRecord(id, formData);
    return NextResponse.json({ ok: true, id: product.id, message });
  } catch (error) {
    return NextResponse.json({ error: formatJewelryProductError(error) }, { status: 500 });
  }
}
