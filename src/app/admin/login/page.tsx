import AdminLoginPage from "./AdminLoginClient";
import { getLoginSetupStatus } from "@/lib/db-setup-status";

export const dynamic = "force-dynamic";

export default async function Page() {
  const setup = await getLoginSetupStatus();

  return <AdminLoginPage setup={setup} />;
}
