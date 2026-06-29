import type { NextAuthConfig } from "next-auth";

const ADMIN_ROLES = new Set(["ADMIN", "EDITOR"]);

export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLogin = pathname === "/admin/login";
      const isUnauthorized = pathname === "/admin/unauthorized";
      const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

      if (!isAdminRoute || isLogin || isUnauthorized) {
        return true;
      }

      const user = auth?.user;
      if (!user?.email || !user.role || !ADMIN_ROLES.has(user.role)) {
        return false;
      }

      if (pathname.startsWith("/admin/settings") || pathname.startsWith("/admin/users")) {
        return user.role === "ADMIN";
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id && token.role && token.email) {
        session.user.id = token.id as string;
        session.user.role = token.role as import("@prisma/client").Role;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
