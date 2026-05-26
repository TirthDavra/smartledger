"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { ChartDataPoint } from "@/constants/dashboard";
import { formatInrChart } from "@/lib/format-currency";
import { BarChart3 } from "lucide-react";

interface ExpenseChartProps {
  data: ChartDataPoint[];
}

export default function ExpenseChart({ data }: ExpenseChartProps) {
  const hasData = data.some((item) => item.amount > 0);

  return (
    <Card className="border border-slate-200/70 bg-white/80 shadow-sm transition hover:shadow-md dark:border-slate-800/70 dark:bg-slate-950/60">
      <CardHeader className="px-5 pb-4 pt-5">
        <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Monthly Expense Trend
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-0">
        <div className="h-64 w-full sm:h-80">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%" minHeight={240}>
              <LineChart
                data={data}
                margin={{ top: 10, right: 16, left: -12, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatInrChart}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => {
                    const amount =
                      typeof value === "number" ? value : Number(value ?? 0);
                    return formatInrChart(amount);
                  }}
                  contentStyle={{
                    borderRadius: 12,
                    borderColor: "#e2e8f0",
                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#0ea5e9" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              icon={BarChart3}
              title="No expense trend yet"
              description="Add expenses over the last six months to see your monthly chart."
              className="min-h-48 border-0 bg-transparent"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
