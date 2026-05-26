"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
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
        <div className="h-64 w-full sm:h-80">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%" minHeight={240}>
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
            <EmptyState
              icon={PieChartIcon}
              title="No category breakdown yet"
              description="Categorized expenses will appear here as a pie chart."
              className="min-h-48 border-0 bg-transparent"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
