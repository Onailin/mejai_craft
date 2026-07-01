export type DashboardChartPoint = {
  name: string;
  value: number;
  fill: string;
};

export type DashboardMonthlyPoint = {
  month: string;
  count: number;
};

export type DashboardVisitPoint = {
  day: string;
  visitors: number;
  pageViews: number;
};

export type DashboardCharts = {
  contentBySection: DashboardChartPoint[];
  activeVsInactive: DashboardChartPoint[];
  productsByCategory: DashboardChartPoint[];
  contentByMonth: DashboardMonthlyPoint[];
  visitorsByDay: DashboardVisitPoint[];
};

export type DashboardStats = {
  totalGems: number;
  activeGems: number;
  totalLuckyStones: number;
  activeLuckyStones: number;
  totalBirthstones: number;
  activeBirthstones: number;
  totalCategories: number;
  totalProducts: number;
  activeProducts: number;
  totalWorkshops: number;
  activeWorkshops: number;
  totalTranslations: number;
  visitorsToday: number;
  pageViewsToday: number;
  charts: DashboardCharts;
};
