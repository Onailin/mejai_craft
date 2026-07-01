import { prisma } from "@/lib/prisma";

export function toVisitDateKey(date: Date) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

export function formatVisitDayLabel(date: Date) {
  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Bangkok",
  });
}

type SiteVisitRow = {
  date: Date;
  pageViews: number;
  visitors: number;
};

export async function recordSiteVisit(isNewVisitor: boolean) {
  const today = toVisitDateKey(new Date());

  await prisma.$executeRaw`
    INSERT INTO "SiteVisitDay" (date, "pageViews", visitors, "updatedAt")
    VALUES (${today}::date, 1, ${isNewVisitor ? 1 : 0}, CURRENT_TIMESTAMP)
    ON CONFLICT (date) DO UPDATE SET
      "pageViews" = "SiteVisitDay"."pageViews" + 1,
      visitors = "SiteVisitDay".visitors + ${isNewVisitor ? 1 : 0},
      "updatedAt" = CURRENT_TIMESTAMP
  `;
}

export async function getSiteVisitRows(since: Date): Promise<SiteVisitRow[]> {
  return prisma.$queryRaw<SiteVisitRow[]>`
    SELECT date, "pageViews", visitors
    FROM "SiteVisitDay"
    WHERE date >= ${since}::date
    ORDER BY date ASC
  `;
}

export function buildVisitDayBuckets(days = 14) {
  const buckets: { key: string; date: Date; label: string }[] = [];
  const now = new Date();

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(now);
    date.setDate(date.getDate() - offset);
    const normalized = toVisitDateKey(date);
    const key = normalized.toISOString().slice(0, 10);
    buckets.push({
      key,
      date: normalized,
      label: formatVisitDayLabel(date),
    });
  }

  return buckets;
}

export async function getVisitorsChartData(days = 14) {
  const visitBuckets = buildVisitDayBuckets(days);
  const visitStart = visitBuckets[0]?.date ?? toVisitDateKey(new Date());

  try {
    const visitRows = await getSiteVisitRows(visitStart);
    const visitMap = new Map(
      visitRows.map((row) => [row.date.toISOString().slice(0, 10), row])
    );
    const visitorsByDay = visitBuckets.map((bucket) => ({
      day: bucket.label,
      visitors: visitMap.get(bucket.key)?.visitors ?? 0,
      pageViews: visitMap.get(bucket.key)?.pageViews ?? 0,
    }));

    const todayKey = toVisitDateKey(new Date()).toISOString().slice(0, 10);
    const todayVisit = visitMap.get(todayKey);

    return {
      visitorsByDay,
      visitorsToday: todayVisit?.visitors ?? 0,
      pageViewsToday: todayVisit?.pageViews ?? 0,
    };
  } catch (error) {
    console.error("Failed to load site visit stats:", error);
    return {
      visitorsByDay: visitBuckets.map((bucket) => ({
        day: bucket.label,
        visitors: 0,
        pageViews: 0,
      })),
      visitorsToday: 0,
      pageViewsToday: 0,
    };
  }
}
