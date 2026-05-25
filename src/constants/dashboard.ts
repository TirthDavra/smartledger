import { type LucideIcon, Clock, CreditCard, DollarSign, Wallet } from "lucide-react";

export interface DashboardStatItem {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  iconClassName?: string;
}

export const dashboardStats: DashboardStatItem[] = [
  {
    title: "Total Revenue",
    value: "$52.4k",
    description: "Revenue generated this month",
    icon: DollarSign,
    iconClassName: "text-emerald-600 bg-emerald-500/10",
  },
  {
    title: "Total Expenses",
    value: "$18.7k",
    description: "Expenses tracked this month",
    icon: CreditCard,
    iconClassName: "text-sky-600 bg-sky-500/10",
  },
  {
    title: "Pending Invoices",
    value: "14",
    description: "Invoices awaiting payment",
    icon: Clock,
    iconClassName: "text-orange-600 bg-orange-500/10",
  },
  {
    title: "Net Balance",
    value: "$33.7k",
    description: "Current cash flow balance",
    icon: Wallet,
    iconClassName: "text-violet-600 bg-violet-500/10",
  },
];

export interface ChartDataPoint {
  name: string;
  amount: number;
}

export const dashboardExpenseTrend: ChartDataPoint[] = [
  { name: "Jan", amount: 4200 },
  { name: "Feb", amount: 3800 },
  { name: "Mar", amount: 5200 },
  { name: "Apr", amount: 4700 },
  { name: "May", amount: 6100 },
  { name: "Jun", amount: 5600 },
  { name: "Jul", amount: 6400 },
];

export interface CategoryBreakdownItem {
  name: string;
  amount: number;
  color: string;
}

export const dashboardCategoryBreakdown: CategoryBreakdownItem[] = [
  { name: "Marketing", amount: 4200, color: "#0ea5e9" },
  { name: "Operations", amount: 3100, color: "#7c3aed" },
  { name: "Payroll", amount: 2200, color: "#f97316" },
  { name: "Software", amount: 1500, color: "#22c55e" },
];

export interface RecentExpenseItem {
  title: string;
  category: string;
  amount: string;
  date: string;
}

export interface RecentInvoiceItem {
  title: string;
  status: "Paid" | "Pending" | "Overdue";
  amount: string;
  dueDate: string;
}

export const dashboardRecentExpenses: RecentExpenseItem[] = [
  {
    title: "Team lunch",
    category: "Meals",
    amount: "$112",
    date: "May 21",
  },
  {
    title: "Cloud storage",
    category: "Software",
    amount: "$245",
    date: "May 19",
  },
  {
    title: "Office supplies",
    category: "Operations",
    amount: "$79",
    date: "May 17",
  },
];

export const dashboardRecentInvoices: RecentInvoiceItem[] = [
  {
    title: "Acme Co.",
    status: "Pending",
    amount: "$1,240",
    dueDate: "May 28",
  },
  {
    title: "Nexa Labs",
    status: "Paid",
    amount: "$2,800",
    dueDate: "May 18",
  },
  {
    title: "Oakridge Ltd.",
    status: "Overdue",
    amount: "$980",
    dueDate: "May 10",
  },
];
