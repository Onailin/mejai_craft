"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardCharts } from "@/types/dashboard";

type DashboardChartsProps = {
  charts: DashboardCharts;
};

type TooltipPayload = {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number }>;
  label?: string;
};

function ChartTooltip({ active, payload }: TooltipPayload) {
  if (!active || !payload?.length) return null;

  const entry = payload[0];
  return (
    <div className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm shadow-sm">
      <p className="font-medium text-stone-800">{entry.name ?? payload[0].name}</p>
      <p className="text-stone-500">{Number(entry.value).toLocaleString("th-TH")} รายการ</p>
    </div>
  );
}

function EmptyChartMessage() {
  return (
    <div className="flex h-[220px] items-center justify-center text-sm text-stone-500">
      ยังไม่มีข้อมูล
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="border-b border-stone-100 px-5 py-4">
        <h2 className="text-base font-semibold text-stone-800">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export function DashboardCharts({ charts }: DashboardChartsProps) {
  const categoryChartHeight = Math.max(220, charts.productsByCategory.length * 36);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard title="เนื้อหาตามประเภท">
        {charts.contentBySection.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={charts.contentBySection}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={88}
                paddingAngle={2}
              >
                {charts.contentBySection.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChartMessage />
        )}
      </ChartCard>

      <ChartCard title="เปิดใช้งาน vs ปิดใช้งาน">
        {charts.activeVsInactive.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={charts.activeVsInactive}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={88}
                paddingAngle={2}
              >
                {charts.activeVsInactive.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChartMessage />
        )}
      </ChartCard>

      <ChartCard title="สินค้าต่อหมวดจิวเวลรี่">
        {charts.productsByCategory.length > 0 ? (
          <ResponsiveContainer width="100%" height={categoryChartHeight}>
            <BarChart
              data={charts.productsByCategory}
              layout="vertical"
              margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {charts.productsByCategory.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChartMessage />
        )}
      </ChartCard>

      <ChartCard title="เนื้อหาที่เพิ่มใหม่ (6 เดือนล่าสุด)">
        {charts.contentByMonth.some((point) => point.count > 0) ? (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={charts.contentByMonth} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} width={32} />
              <Tooltip
                content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <div className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm shadow-sm">
                      <p className="font-medium text-stone-800">{label}</p>
                      <p className="text-stone-500">
                        {Number(payload[0].value).toLocaleString("th-TH")} รายการ
                      </p>
                    </div>
                  ) : null
                }
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#d97706"
                strokeWidth={2}
                dot={{ r: 4, fill: "#d97706" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChartMessage />
        )}
      </ChartCard>
    </div>
  );
}
