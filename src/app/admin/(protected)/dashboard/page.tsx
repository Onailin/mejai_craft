export const dynamic = "force-dynamic";

import Link from "next/link";
import { Gem, Sparkles, Tags, ShoppingBag, Hammer, Languages } from "lucide-react";
import { getDashboardStats } from "@/actions/dashboard";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { StatCard } from "@/components/admin/StatCard";
import { adminNavItems } from "@/components/admin/admin-nav";
import { adminNavIconMap } from "@/components/admin/admin-nav-icons";
import { requireEditorOrAdmin } from "@/lib/auth-helpers";

export default async function AdminDashboardPage() {
  const session = await requireEditorOrAdmin();
  const stats = await getDashboardStats();

  const quickLinks = adminNavItems.filter(
    (item) =>
      item.href !== "/admin/dashboard" &&
      (!item.adminOnly || session.user.role === "ADMIN"),
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-stone-900">แดชบอร์ด</h1>
        <p className="mt-2 text-stone-600">ภาพรวมเนื้อหาเว็บไซต์ Mejai Crafts</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="พลอย"
          value={stats.totalGems}
          hint={`เปิดใช้งาน ${stats.activeGems} รายการ`}
          icon={Gem}
        />
        <StatCard
          title="หินนำโชค"
          value={stats.totalLuckyStones}
          hint={`เปิดใช้งาน ${stats.activeLuckyStones} รายการ`}
          icon={Sparkles}
        />
        <StatCard
          title="หมวดจิวเวลรี่"
          value={stats.totalCategories}
          icon={Tags}
        />
        <StatCard
          title="สินค้าจิวเวลรี่"
          value={stats.totalProducts}
          hint={`เปิดใช้งาน ${stats.activeProducts} รายการ`}
          icon={ShoppingBag}
        />
        <StatCard
          title="เวิร์คชอป"
          value={stats.totalWorkshops}
          hint={`เปิดใช้งาน ${stats.activeWorkshops} รายการ`}
          icon={Hammer}
        />
        <StatCard
          title="คำแปล"
          value={stats.totalTranslations}
          hint="DeepL auto-translate"
          icon={Languages}
        />
      </div>

      <DashboardCharts charts={stats.charts} />

      <div>
        <h2 className="mb-4 text-lg font-semibold text-stone-800">จัดการเนื้อหา</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((item) => {
            const Icon = adminNavIconMap[item.icon];
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-stone-200 bg-white p-5 no-underline shadow-sm transition hover:border-amber-200 hover:shadow-md"
              >
                <div className="mb-3 inline-flex rounded-xl bg-stone-100 p-3 text-stone-600 transition group-hover:bg-amber-50 group-hover:text-amber-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-stone-800">{item.labelTh}</h3>
                <p className="mt-1 text-sm text-stone-500">{item.label}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
