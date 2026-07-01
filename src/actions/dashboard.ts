"use server";

import { prisma } from "@/lib/prisma";
import { requireEditorOrAdmin } from "@/lib/auth-helpers";
import { CHART_PALETTE, STATUS_COLORS } from "@/lib/dashboard-chart-colors";
import { getVisitorsChartData } from "@/lib/site-analytics";
import type {
  DashboardChartPoint,
  DashboardCharts,
  DashboardMonthlyPoint,
  DashboardStats,
} from "@/types/dashboard";

const MONTHS_TO_SHOW = 6;

function buildMonthBuckets(): { key: string; label: string }[] {
  const buckets: { key: string; label: string }[] = [];
  const now = new Date();

  for (let offset = MONTHS_TO_SHOW - 1; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleDateString("th-TH", {
      month: "short",
      year: "2-digit",
    });
    buckets.push({ key, label });
  }

  return buckets;
}

function mapWithPalette(entries: { name: string; value: number }[]): DashboardChartPoint[] {
  return entries.map((entry, index) => ({
    ...entry,
    fill: CHART_PALETTE[index % CHART_PALETTE.length],
  }));
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await requireEditorOrAdmin();

  const monthBuckets = buildMonthBuckets();
  const monthStart = new Date();
  monthStart.setMonth(monthStart.getMonth() - (MONTHS_TO_SHOW - 1));
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [
    totalGems,
    activeGems,
    totalLuckyStones,
    activeLuckyStones,
    totalBirthstones,
    activeBirthstones,
    totalCategories,
    totalProducts,
    activeProducts,
    totalWorkshops,
    activeWorkshops,
    totalTranslations,
    productsByCategoryRaw,
    categories,
    recentGems,
    recentStones,
    recentBirthstones,
    recentProducts,
    recentWorkshops,
  ] = await Promise.all([
    prisma.gem.count(),
    prisma.gem.count({ where: { isActive: true } }),
    prisma.luckyStone.count(),
    prisma.luckyStone.count({ where: { isActive: true } }),
    prisma.birthstone.count(),
    prisma.birthstone.count({ where: { isActive: true } }),
    prisma.jewelryCategory.count(),
    prisma.jewelryProduct.count(),
    prisma.jewelryProduct.count({ where: { isActive: true } }),
    prisma.workshop.count(),
    prisma.workshop.count({ where: { isActive: true } }),
    prisma.contentTranslation.count(),
    prisma.jewelryProduct.groupBy({
      by: ["categoryId"],
      _count: { id: true },
    }),
    prisma.jewelryCategory.findMany({
      select: { id: true, name: true },
    }),
    prisma.gem.findMany({
      where: { createdAt: { gte: monthStart } },
      select: { createdAt: true },
    }),
    prisma.luckyStone.findMany({
      where: { createdAt: { gte: monthStart } },
      select: { createdAt: true },
    }),
    prisma.birthstone.findMany({
      where: { createdAt: { gte: monthStart } },
      select: { createdAt: true },
    }),
    prisma.jewelryProduct.findMany({
      where: { createdAt: { gte: monthStart } },
      select: { createdAt: true },
    }),
    prisma.workshop.findMany({
      where: { createdAt: { gte: monthStart } },
      select: { createdAt: true },
    }),
  ]);

  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));

  const contentBySection: DashboardChartPoint[] = mapWithPalette(
    [
      { name: "พลอย", value: totalGems },
      { name: "พลอยวันเกิด", value: totalBirthstones },
      { name: "หินนำโชค", value: totalLuckyStones },
      { name: "สินค้าจิวเวลรี่", value: totalProducts },
      { name: "เวิร์คชอป", value: totalWorkshops },
    ].filter((entry) => entry.value > 0),
  );

  const totalActive =
    activeGems + activeLuckyStones + activeBirthstones + activeProducts + activeWorkshops;
  const totalInactive =
    totalGems -
    activeGems +
    (totalLuckyStones - activeLuckyStones) +
    (totalBirthstones - activeBirthstones) +
    (totalProducts - activeProducts) +
    (totalWorkshops - activeWorkshops);

  const activeVsInactive: DashboardChartPoint[] = [
    { name: "เปิดใช้งาน", value: totalActive, fill: STATUS_COLORS.active },
    { name: "ปิดใช้งาน", value: totalInactive, fill: STATUS_COLORS.inactive },
  ].filter((entry) => entry.value > 0);

  const productsByCategory = mapWithPalette(
    productsByCategoryRaw
      .map((row) => ({
        name: categoryNameById.get(row.categoryId) ?? "ไม่ทราบหมวด",
        value: row._count.id,
      }))
      .sort((a, b) => b.value - a.value),
  );

  const monthCountMap = new Map<string, number>();
  for (const bucket of monthBuckets) {
    monthCountMap.set(bucket.key, 0);
  }

  for (const item of [...recentGems, ...recentStones, ...recentBirthstones, ...recentProducts, ...recentWorkshops]) {
    const key = `${item.createdAt.getFullYear()}-${String(item.createdAt.getMonth() + 1).padStart(2, "0")}`;
    if (monthCountMap.has(key)) {
      monthCountMap.set(key, (monthCountMap.get(key) ?? 0) + 1);
    }
  }

  const contentByMonth: DashboardMonthlyPoint[] = monthBuckets.map((bucket) => ({
    month: bucket.label,
    count: monthCountMap.get(bucket.key) ?? 0,
  }));

  const { visitorsByDay, visitorsToday, pageViewsToday } = await getVisitorsChartData(14);

  const charts: DashboardCharts = {
    contentBySection,
    activeVsInactive,
    productsByCategory,
    contentByMonth,
    visitorsByDay,
  };

  return {
    totalGems,
    activeGems,
    totalLuckyStones,
    activeLuckyStones,
    totalBirthstones,
    activeBirthstones,
    totalCategories,
    totalProducts,
    activeProducts,
    totalWorkshops,
    activeWorkshops,
    totalTranslations,
    visitorsToday,
    pageViewsToday,
    charts,
  };
}
