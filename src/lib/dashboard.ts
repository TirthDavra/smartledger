import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models/expense.model";
import { Invoice } from "@/models/invoice.model";
import type {
  CategoryBreakdownItem,
  ChartDataPoint,
  RecentExpenseItem,
  RecentInvoiceItem,
} from "@/constants/dashboard";
import { formatInr, formatInrCompact } from "@/lib/format-currency";

export type DashboardData = {
  stats: {
    totalRevenue: number;
    totalExpenses: number;
    pendingInvoices: number;
    netBalance: number;
  };
  expenseTrend: ChartDataPoint[];
  categoryBreakdown: CategoryBreakdownItem[];
  recentExpenses: RecentExpenseItem[];
  recentInvoices: RecentInvoiceItem[];
};

const EXPENSE_CATEGORY_META: Record<
  string,
  { label: string; color: string }
> = {
  meals: { label: "Meals", color: "#0ea5e9" },
  software: { label: "Software", color: "#22c55e" },
  operations: { label: "Operations", color: "#7c3aed" },
  payroll: { label: "Payroll", color: "#f97316" },
  marketing: { label: "Marketing", color: "#ec4899" },
  travel: { label: "Travel", color: "#14b8a6" },
  utilities: { label: "Utilities", color: "#eab308" },
  office: { label: "Office", color: "#6366f1" },
  other: { label: "Other", color: "#94a3b8" },
};

const PENDING_INVOICE_STATUSES = ["sent", "overdue"];

function getLastSixMonths() {
  const months: { key: string; name: string }[] = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    months.push({
      key,
      name: date.toLocaleString("en-US", { month: "short" }),
    });
  }

  return months;
}

function formatShortDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function mapInvoiceStatus(
  status: string
): RecentInvoiceItem["status"] {
  if (status === "paid") return "Paid";
  if (status === "overdue") return "Overdue";
  if (status === "cancelled") return "Cancelled";
  return "Pending";
}

async function sumPaidRevenue(userId: mongoose.Types.ObjectId) {
  const result = await Invoice.aggregate([
    { $match: { userId, status: "paid" } },
    { $group: { _id: null, total: { $sum: "$total" } } },
  ]);

  return result[0]?.total ?? 0;
}

async function sumExpenses(userId: mongoose.Types.ObjectId) {
  const result = await Expense.aggregate([
    { $match: { userId } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  return result[0]?.total ?? 0;
}

async function countPendingInvoices(userId: mongoose.Types.ObjectId) {
  return Invoice.countDocuments({
    userId,
    status: { $in: PENDING_INVOICE_STATUSES },
  });
}

async function getMonthlyExpenseTrend(userId: mongoose.Types.ObjectId) {
  const months = getLastSixMonths();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 5);
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);

  const results = await Expense.aggregate([
    {
      $match: {
        userId,
        expenseDate: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$expenseDate" },
          month: { $month: "$expenseDate" },
        },
        amount: { $sum: "$amount" },
      },
    },
  ]);

  const totalsByMonth = new Map<string, number>();

  for (const row of results) {
    const key = `${row._id.year}-${String(row._id.month).padStart(2, "0")}`;
    totalsByMonth.set(key, row.amount);
  }

  return months.map((month) => ({
    name: month.name,
    amount: totalsByMonth.get(month.key) ?? 0,
  }));
}

async function getCategoryBreakdown(userId: mongoose.Types.ObjectId) {
  const results = await Expense.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: "$category",
        amount: { $sum: "$amount" },
      },
    },
    { $sort: { amount: -1 } },
  ]);

  return results.map((row) => {
    const meta = EXPENSE_CATEGORY_META[row._id] ?? {
      label: row._id,
      color: "#94a3b8",
    };

    return {
      name: meta.label,
      amount: row.amount,
      color: meta.color,
    };
  });
}

async function getRecentExpenses(userId: mongoose.Types.ObjectId) {
  const expenses = await Expense.find({ userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return expenses.map((expense) => {
    const meta = EXPENSE_CATEGORY_META[expense.category];

    return {
      id: expense._id.toString(),
      title: expense.title,
      category: meta?.label ?? expense.category,
      amount: formatInr(expense.amount),
      date: formatShortDate(expense.expenseDate),
    };
  });
}

async function getRecentInvoices(userId: mongoose.Types.ObjectId) {
  const invoices = await Invoice.find({ userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return invoices.map((invoice) => ({
    id: invoice._id.toString(),
    title: invoice.clientName,
    status: mapInvoiceStatus(invoice.status),
    amount: formatInr(invoice.total),
    dueDate: formatShortDate(invoice.dueDate),
  }));
}

export async function getDashboardData(
  userId: string
): Promise<DashboardData> {
  await connectDB();

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const [
    totalRevenue,
    totalExpenses,
    pendingInvoices,
    expenseTrend,
    categoryBreakdown,
    recentExpenses,
    recentInvoices,
  ] = await Promise.all([
    sumPaidRevenue(userObjectId),
    sumExpenses(userObjectId),
    countPendingInvoices(userObjectId),
    getMonthlyExpenseTrend(userObjectId),
    getCategoryBreakdown(userObjectId),
    getRecentExpenses(userObjectId),
    getRecentInvoices(userObjectId),
  ]);

  return {
    stats: {
      totalRevenue,
      totalExpenses,
      pendingInvoices,
      netBalance: totalRevenue - totalExpenses,
    },
    expenseTrend,
    categoryBreakdown,
    recentExpenses,
    recentInvoices,
  };
}

export function formatDashboardCurrency(amount: number) {
  return formatInrCompact(amount);
}
