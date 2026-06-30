import { NextRequest, NextResponse } from "next/server";
import {
  createJewelryProductRecord,
  formatJewelryProductError,
} from "@/lib/jewelry-product-admin-service";
import { getSession } from "@/lib/auth-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบใหม่" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const { product, message } = await createJewelryProductRecord(formData);
    return NextResponse.json({ ok: true, id: product.id, message });
  } catch (error) {
    return NextResponse.json({ error: formatJewelryProductError(error) }, { status: 500 });
  }
}
