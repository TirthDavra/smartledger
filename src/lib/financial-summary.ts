import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import { getDashboardData } from "@/lib/dashboard";
import { Invoice } from "@/models/invoice.model";

export type FinancialSummary = {
  totalRevenue: number;
  totalExpenses: number;
  netBalance: number;
  pendingInvoiceCount: number;
  pendingInvoiceTotal: number;
  expenseByCategory: { category: string; amount: number }[];
  monthlyExpenses: { month: string; amount: number }[];
  pendingInvoices: {
    clientName: string;
    invoiceNumber: string;
    total: number;
    status: string;
    dueDate: string;
  }[];
};

export async function buildFinancialSummary(
  userId: string
): Promise<FinancialSummary> {
  const dashboard = await getDashboardData(userId);

  await connectDB();

  const pendingInvoices = await Invoice.find({
    userId: new mongoose.Types.ObjectId(userId),
    status: { $in: ["sent", "overdue"] },
  })
    .select("clientName invoiceNumber total status dueDate")
    .lean();

  return {
    totalRevenue: dashboard.stats.totalRevenue,
    totalExpenses: dashboard.stats.totalExpenses,
    netBalance: dashboard.stats.netBalance,
    pendingInvoiceCount: dashboard.stats.pendingInvoices,
    pendingInvoiceTotal: pendingInvoices.reduce((sum, inv) => sum + inv.total, 0),
    expenseByCategory: dashboard.categoryBreakdown.map((item) => ({
      category: item.name,
      amount: item.amount,
    })),
    monthlyExpenses: dashboard.expenseTrend.map((item) => ({
      month: item.name,
      amount: item.amount,
    })),
    pendingInvoices: pendingInvoices.map((inv) => ({
      clientName: inv.clientName,
      invoiceNumber: inv.invoiceNumber,
      total: inv.total,
      status: inv.status,
      dueDate: inv.dueDate.toISOString().split("T")[0],
    })),
  };
}
