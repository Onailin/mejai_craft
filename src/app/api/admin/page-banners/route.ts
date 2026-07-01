import { NextRequest, NextResponse } from "next/server";
import { deletePageBanner, uploadPageBanner } from "@/lib/page-banner-admin-service";
import { getSession } from "@/lib/auth-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PageBannerKey = "home" | "workshop";

function parsePageKey(value: string | null): PageBannerKey | null {
  if (value === "home" || value === "workshop") return value;
  return null;
}

function formatError(error: unknown) {
  if (error instanceof Error) return error.message;
  return "ดำเนินการไม่สำเร็จ";
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบใหม่" }, { status: 401 });
  }

  const pageKey = parsePageKey(request.nextUrl.searchParams.get("pageKey"));
  if (!pageKey) {
    return NextResponse.json({ error: "ไม่รู้จักประเภทแบนเนอร์" }, { status: 400 });
  }

  const replaceUrl = request.nextUrl.searchParams.get("replaceUrl") ?? undefined;

  try {
    const formData = await request.formData();
    const result = await uploadPageBanner(pageKey, formData, { replaceUrl });
    return NextResponse.json({ ok: true, imageUrl: result.imageUrl });
  } catch (error) {
    return NextResponse.json({ error: formatError(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบใหม่" }, { status: 401 });
  }

  const pageKey = parsePageKey(request.nextUrl.searchParams.get("pageKey"));
  const imageUrl = request.nextUrl.searchParams.get("imageUrl");
  if (!pageKey || !imageUrl) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
  }

  try {
    await deletePageBanner(pageKey, imageUrl);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: formatError(error) }, { status: 500 });
  }
}
