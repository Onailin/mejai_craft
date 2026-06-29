import { Suspense } from "react";
import AdminLoginPage from "./AdminLoginClient";
import { getLoginSetupStatus } from "@/lib/db-setup-status";

export default async function Page() {
  const setup = await getLoginSetupStatus();

  return (
    <Suspense>
      <AdminLoginPage setup={setup} />
    </Suspense>
  );
}
