import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { recordSiteVisit } from "@/lib/site-analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function todayVisitorCookieName() {
  const now = new Date();
  const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return `mejai_visitor_${key}`;
}

export async function POST() {
  try {
    const cookieStore = await cookies();
    const cookieName = todayVisitorCookieName();
    const isNewVisitor = !cookieStore.get(cookieName)?.value;

    await recordSiteVisit(isNewVisitor);

    const response = NextResponse.json({ ok: true });
    if (isNewVisitor) {
      response.cookies.set(cookieName, "1", {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Site visit tracking failed:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
