export type DashboardChartPoint = {
  name: string;
  value: number;
  fill: string;
};

export type DashboardMonthlyPoint = {
  month: string;
  count: number;
};

export type DashboardCharts = {
  contentBySection: DashboardChartPoint[];
  activeVsInactive: DashboardChartPoint[];
  productsByCategory: DashboardChartPoint[];
  contentByMonth: DashboardMonthlyPoint[];
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
  charts: DashboardCharts;
};
