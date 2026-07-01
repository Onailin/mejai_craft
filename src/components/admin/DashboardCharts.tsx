"use client";

import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
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
import {
  CHART_AXIS_STROKE,
  CHART_GRID_STROKE,
  CHART_LINE_COLORS,
} from "@/lib/dashboard-chart-colors";

type DashboardChartsProps = {
  charts: DashboardCharts;
};

type TooltipPayload = {
  active?: boolean;
  payload?: ReadonlyArray<{ name?: string; value?: number; dataKey?: string }>;
  label?: string | number;
};

function ChartTooltip({
  active,
  payload,
  label,
  unit = "รายการ",
}: TooltipPayload & { unit?: string }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-200/80 bg-white/95 px-3 py-2 text-sm shadow-sm backdrop-blur-sm">
      {label ? <p className="mb-1 font-medium text-slate-700">{label}</p> : null}
      {payload.map((entry) => (
        <p key={entry.dataKey ?? entry.name} className="text-slate-500">
          {entry.name}: {Number(entry.value).toLocaleString("th-TH")} {unit}
        </p>
      ))}
    </div>
  );
}

function EmptyChartMessage() {
  return (
    <div className="flex h-[220px] items-center justify-center text-sm text-slate-500">
      ยังไม่มีข้อมูล
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  className = "",
  children,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export function DashboardCharts({ charts }: DashboardChartsProps) {
  const categoryChartHeight = Math.max(220, charts.productsByCategory.length * 36);
  const hasVisitorData = charts.visitorsByDay.some(
    (point) => point.visitors > 0 || point.pageViews > 0
  );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard
        title="ผู้เข้าชมเว็บไซต์"
        subtitle="14 วันล่าสุด · นับผู้เยี่ยมชมไม่ซ้ำต่อวัน"
        className="lg:col-span-2"
      >
        {hasVisitorData ? (
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={charts.visitorsByDay} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={CHART_GRID_STROKE} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: CHART_AXIS_STROKE }} />
              <YAxis allowDecimals={false} width={36} tick={{ fontSize: 11, fill: CHART_AXIS_STROKE }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-lg border border-slate-200/80 bg-white/95 px-3 py-2 text-sm shadow-sm">
                      <p className="mb-1 font-medium text-slate-700">{label}</p>
                      {payload.map((item, index) => (
                        <p key={String(item.dataKey ?? index)} className="text-slate-500">
                          {item.dataKey === "visitors" ? "ผู้เข้าชม" : "การดูหน้า"}:{" "}
                          {Number(item.value).toLocaleString("th-TH")}{" "}
                          {item.dataKey === "visitors" ? "คน" : "ครั้ง"}
                        </p>
                      ))}
                    </div>
                  );
                }}
              />
              <Legend
                formatter={(value) => (value === "visitors" ? "ผู้เข้าชม" : "การดูหน้า")}
                wrapperStyle={{ fontSize: 12, color: CHART_AXIS_STROKE }}
              />
              <Area
                type="monotone"
                dataKey="pageViews"
                stroke="none"
                fill={CHART_LINE_COLORS.pageViews}
                fillOpacity={0.18}
              />
              <Line
                type="monotone"
                dataKey="visitors"
                name="visitors"
                stroke={CHART_LINE_COLORS.visitors}
                strokeWidth={2.5}
                dot={{ r: 3, fill: CHART_LINE_COLORS.visitors, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="pageViews"
                name="pageViews"
                stroke={CHART_LINE_COLORS.pageViews}
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChartMessage />
        )}
      </ChartCard>

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
                stroke="#ffffff"
                strokeWidth={2}
              >
                {charts.contentBySection.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: CHART_AXIS_STROKE }} />
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
                stroke="#ffffff"
                strokeWidth={2}
              >
                {charts.activeVsInactive.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: CHART_AXIS_STROKE }} />
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
              <CartesianGrid stroke={CHART_GRID_STROKE} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fill: CHART_AXIS_STROKE, fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fontSize: 12, fill: CHART_AXIS_STROKE }}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
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

      <ChartCard title="เนื้อหาที่เพิ่มใหม่" subtitle="6 เดือนล่าสุด">
        {charts.contentByMonth.some((point) => point.count > 0) ? (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={charts.contentByMonth} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={CHART_GRID_STROKE} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: CHART_AXIS_STROKE }} />
              <YAxis allowDecimals={false} width={32} tick={{ fill: CHART_AXIS_STROKE, fontSize: 11 }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-lg border border-slate-200/80 bg-white/95 px-3 py-2 text-sm shadow-sm">
                      <p className="mb-1 font-medium text-slate-700">{String(label ?? "")}</p>
                      <p className="text-slate-500">
                        {Number(payload[0].value).toLocaleString("th-TH")} รายการ
                      </p>
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke={CHART_LINE_COLORS.content}
                strokeWidth={2.5}
                dot={{ r: 4, fill: CHART_LINE_COLORS.content, strokeWidth: 0 }}
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
