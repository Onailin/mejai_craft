export function getAuthSecret() {
  return process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
}

export function isProductionDeployment() {
  return process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
}

const PLACEHOLDER_SECRETS = new Set([
  "dev-secret-change-in-production",
  "generate-with-openssl-rand-base64-32",
  "change-me",
]);

export type AuthConfigIssue = "missing_auth_secret" | "localhost_auth_url";

export function getAuthConfigIssue(): AuthConfigIssue | null {
  if (!isProductionDeployment()) {
    return null;
  }

  const secret = getAuthSecret();
  if (!secret || PLACEHOLDER_SECRETS.has(secret)) {
    return "missing_auth_secret";
  }

  const authUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "";
  if (/localhost|127\.0\.0\.1/i.test(authUrl)) {
    return "localhost_auth_url";
  }

  return null;
}
