export const dynamic = "force-dynamic";

import { getDashboardStats } from "@/actions/dashboard";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { requireEditorOrAdmin } from "@/lib/auth-helpers";

export default async function AdminDashboardPage() {
  await requireEditorOrAdmin();
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">แดชบอร์ด</h1>
        <p className="mt-1 text-sm text-slate-500">ภาพรวมสถิติและเนื้อหาเว็บไซต์</p>
      </div>

      <DashboardCharts charts={stats.charts} />
    </div>
  );
}
