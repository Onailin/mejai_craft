import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { auth } from "./auth";
import { prisma } from "./prisma";

const ALLOWED_ROLES: Role[] = ["ADMIN", "EDITOR"];

async function validateSessionUser() {
  const session = await auth();
  if (!session?.user?.id || !session.user.email || !session.user.role) {
    return null;
  }

  if (!ALLOWED_ROLES.includes(session.user.role)) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, role: true, isActive: true },
  });

  if (!user || !user.isActive || user.email !== session.user.email) {
    return null;
  }

  if (!ALLOWED_ROLES.includes(user.role)) {
    return null;
  }

  return {
    ...session,
    user: {
      ...session.user,
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}

export async function getSession() {
  return validateSessionUser();
}

export async function requireAuth() {
  const session = await validateSessionUser();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

export async function requireEditorOrAdmin() {
  const session = await requireAuth();
  if (!ALLOWED_ROLES.includes(session.user.role)) {
    redirect("/admin/unauthorized");
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (session.user.role !== "ADMIN") {
    redirect("/admin/unauthorized");
  }
  return session;
}

export function hasRole(role: Role, allowed: Role[]) {
  return allowed.includes(role);
}
