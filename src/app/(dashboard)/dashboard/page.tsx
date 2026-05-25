import CategoryChart from "@/components/dashboard/category-chart";
import ExpenseChart from "@/components/dashboard/expense-chart";
import RecentActivity from "@/components/dashboard/recent-activity";
import SectionHeader from "@/components/dashboard/section-header";
import StatsCard from "@/components/dashboard/stats-card";
import { dashboardStats } from "@/constants/dashboard";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-6">
        <SectionHeader
          title="Finance Overview"
          description="A snapshot of your business cash flow, expenses, and invoice performance."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((item) => (
            <StatsCard
              key={item.title}
              title={item.title}
              value={item.value}
              description={item.description}
              icon={item.icon}
              iconClassName={item.iconClassName}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <ExpenseChart />
        <CategoryChart />
      </section>

      <RecentActivity />
    </div>
  );
}