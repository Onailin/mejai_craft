import { getAuthConfigIssue } from "./auth-env";

export type LoginSetupStatus =
  | { ok: true; adminEmail: string }
  | {
      ok: false;
      reason:
        | "placeholder_password"
        | "db_unreachable"
        | "no_users"
        | "missing_auth_secret"
        | "localhost_auth_url";
    };

export async function getLoginSetupStatus(): Promise<LoginSetupStatus> {
  const authIssue = getAuthConfigIssue();
  if (authIssue) {
    return { ok: false, reason: authIssue };
  }

  const databaseUrl = process.env.DATABASE_URL ?? "";
  const directUrl = process.env.DIRECT_URL ?? "";

  if (databaseUrl.includes("[YOUR-PASSWORD]") || directUrl.includes("[YOUR-PASSWORD]")) {
    return { ok: false, reason: "placeholder_password" };
  }

  try {
    const { prisma } = await import("./prisma");
    await prisma.$queryRaw`SELECT 1`;
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      return { ok: false, reason: "no_users" };
    }

    const adminEmail = process.env.ADMIN_EMAIL ?? "admin@mejaicrafts.com";
    return { ok: true, adminEmail };
  } catch {
    return { ok: false, reason: "db_unreachable" };
  }
}
