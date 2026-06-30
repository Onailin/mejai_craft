import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const ADMIN_ROLES = new Set(["ADMIN", "EDITOR"]);

export const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/admin/login";
  const isUnauthorized = pathname === "/admin/unauthorized";
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApiRoute = pathname.startsWith("/api/admin/");

  if (!isAdminRoute && !isAdminApiRoute) {
    return NextResponse.next();
  }

  if (isAdminApiRoute) {
    const user = req.auth?.user;
    if (!user?.email || !user.role || !ADMIN_ROLES.has(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (isLogin || isUnauthorized) {
    if (req.auth?.user?.role && ADMIN_ROLES.has(req.auth.user.role) && isLogin) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }

  const user = req.auth?.user;
  if (!user?.email || !user.role || !ADMIN_ROLES.has(user.role)) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (
    (pathname.startsWith("/admin/settings") || pathname.startsWith("/admin/users")) &&
    user.role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/admin/unauthorized", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
