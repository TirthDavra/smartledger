import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import CategoryChart from "@/components/dashboard/category-chart";
import ExpenseChart from "@/components/dashboard/expense-chart";
import RecentActivity from "@/components/dashboard/recent-activity";
import SectionHeader from "@/components/dashboard/section-header";
import StatsCard from "@/components/dashboard/stats-card";
import { dashboardStatConfig } from "@/constants/dashboard";
import {
  formatDashboardCurrency,
  getDashboardData,
} from "@/lib/dashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const data = await getDashboardData(session.user.id);

  const statValues: Record<
    (typeof dashboardStatConfig)[number]["key"],
    string
  > = {
    revenue: formatDashboardCurrency(data.stats.totalRevenue),
    expenses: formatDashboardCurrency(data.stats.totalExpenses),
    pending: String(data.stats.pendingInvoices),
    balance: formatDashboardCurrency(data.stats.netBalance),
  };

  return (
    <div className="space-y-8">
      <section className="space-y-6">
        <SectionHeader
          title="Finance Overview"
          description="A snapshot of your business cash flow, expenses, and invoice performance."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardStatConfig.map((item) => (
            <StatsCard
              key={item.key}
              title={item.title}
              value={statValues[item.key]}
              description={item.description}
              icon={item.icon}
              iconClassName={item.iconClassName}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <ExpenseChart data={data.expenseTrend} />
        <CategoryChart data={data.categoryBreakdown} />
      </section>

      <RecentActivity
        expenses={data.recentExpenses}
        invoices={data.recentInvoices}
      />
    </div>
  );
}
