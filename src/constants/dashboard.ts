import {
  type LucideIcon,
  Clock,
  CreditCard,
  DollarSign,
  Wallet,
} from "lucide-react";

export interface DashboardStatConfig {
  key: "revenue" | "expenses" | "pending" | "balance";
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName?: string;
}

export const dashboardStatConfig: DashboardStatConfig[] = [
  {
    key: "revenue",
    title: "Total Revenue",
    description: "Sum of paid invoices",
    icon: DollarSign,
    iconClassName: "text-emerald-600 bg-emerald-500/10",
  },
  {
    key: "expenses",
    title: "Total Expenses",
    description: "Total tracked expenses",
    icon: CreditCard,
    iconClassName: "text-sky-600 bg-sky-500/10",
  },
  {
    key: "pending",
    title: "Pending Invoices",
    description: "Invoices awaiting payment",
    icon: Clock,
    iconClassName: "text-orange-600 bg-orange-500/10",
  },
  {
    key: "balance",
    title: "Net Balance",
    description: "Revenue minus expenses",
    icon: Wallet,
    iconClassName: "text-violet-600 bg-violet-500/10",
  },
];

export interface ChartDataPoint {
  name: string;
  amount: number;
}

export interface CategoryBreakdownItem {
  name: string;
  amount: number;
  color: string;
}

export interface RecentExpenseItem {
  id: string;
  title: string;
  category: string;
  amount: string;
  date: string;
}

export interface RecentInvoiceItem {
  id: string;
  title: string;
  status: "Paid" | "Pending" | "Overdue" | "Cancelled";
  amount: string;
  dueDate: string;
}
