"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategoryBreakdownItem } from "@/constants/dashboard";
import { formatInrChart } from "@/lib/format-currency";

interface CategoryChartProps {
  data: CategoryBreakdownItem[];
}

export default function CategoryChart({ data }: CategoryChartProps) {
  const hasData = data.length > 0;

  return (
    <Card className="border border-slate-200/70 bg-white/80 shadow-sm transition hover:shadow-md dark:border-slate-800/70 dark:bg-slate-950/60">
      <CardHeader className="px-5 pb-4 pt-5">
        <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Expense Category Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-0">
        <div className="h-80 w-full">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%" minHeight={320}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={48}
                  paddingAngle={4}
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => {
                    const amount =
                      typeof value === "number" ? value : Number(value ?? 0);
                    return formatInrChart(amount);
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12, color: "#64748b" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No expenses by category yet
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
