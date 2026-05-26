import { Receipt, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type {
  RecentExpenseItem,
  RecentInvoiceItem,
} from "@/constants/dashboard";

const statusVariantMap: Record<
  RecentInvoiceItem["status"],
  "default" | "secondary" | "destructive"
> = {
  Paid: "default",
  Pending: "secondary",
  Overdue: "destructive",
  Cancelled: "secondary",
};

interface RecentActivityProps {
  expenses: RecentExpenseItem[];
  invoices: RecentInvoiceItem[];
}

export default function RecentActivity({
  expenses,
  invoices,
}: RecentActivityProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
      <Card className="border border-slate-200/70 bg-white/80 shadow-sm transition hover:shadow-md dark:border-slate-800/70 dark:bg-slate-950/60">
        <CardHeader className="px-5 pb-4 pt-5">
          <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Recent Expenses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-5 pb-5 pt-0">
          {expenses.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No recent expenses"
              description="New expenses will show up here once you add them."
              className="min-h-40 border-0 bg-transparent py-4"
            />
          ) : (
            expenses.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800/80 dark:bg-slate-900/60 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {item.title}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {item.category}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <span>{item.date}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {item.amount}
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="border border-slate-200/70 bg-white/80 shadow-sm transition hover:shadow-md dark:border-slate-800/70 dark:bg-slate-950/60">
        <CardHeader className="px-5 pb-4 pt-5">
          <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Recent Invoices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-5 pb-5 pt-0">
          {invoices.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No recent invoices"
              description="Created invoices will appear here for quick reference."
              className="min-h-40 border-0 bg-transparent py-4"
            />
          ) : (
            invoices.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800/80 dark:bg-slate-900/60 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {item.title}
                  </p>
                  <Badge
                    variant={statusVariantMap[item.status] ?? "default"}
                  >
                    {item.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <span>{item.dueDate}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {item.amount}
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </section>
  );
}
