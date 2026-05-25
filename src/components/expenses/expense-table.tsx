"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatInr } from "@/lib/format-currency";
import DeleteExpenseDialog from "./delete-expense-dialog";

const CATEGORY_LABELS: Record<string, string> = {
  meals: "Meals",
  software: "Software",
  operations: "Operations",
  payroll: "Payroll",
  marketing: "Marketing",
  travel: "Travel",
  utilities: "Utilities",
  office: "Office",
  other: "Other",
};

interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: "meals" | "software" | "operations" | "payroll" | "marketing" | "travel" | "utilities" | "office" | "other";
  vendor: string;
  expenseDate: string;
  notes: string;
}

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: () => void;
}

export default function ExpenseTable({
  expenses,
  onEdit,
  onDelete,
}: ExpenseTableProps) {
  const [deleteExpenseId, setDeleteExpenseId] = useState<string | null>(null);

  if (expenses.length === 0) {
    return (
      <Card className="border border-slate-200/70 bg-white/80 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/60">
        <CardContent className="flex min-h-96 items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              No expenses yet
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Create your first expense to get started
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="hidden md:block overflow-x-auto">
        <Card className="border border-slate-200/70 bg-white/80 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/60">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/70 bg-slate-50/50 dark:border-slate-800/70 dark:bg-slate-900/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Vendor
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Date
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
              {expenses.map((expense) => (
                <tr
                  key={expense._id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                    {expense.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-800/50 dark:text-slate-200">
                      {CATEGORY_LABELS[expense.category] || expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {expense.vendor}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {formatInr(expense.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {new Date(expense.expenseDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onEdit(expense)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteExpenseId(expense._id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <div className="md:hidden space-y-3">
        {expenses.map((expense) => (
          <Card
            key={expense._id}
            className="border border-slate-200/70 bg-white/80 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/60"
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {expense.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {expense.vendor}
                  </p>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {formatInr(expense.amount)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-800/50 dark:text-slate-200">
                    {CATEGORY_LABELS[expense.category] || expense.category}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(expense.expenseDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(expense)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setDeleteExpenseId(expense._id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {deleteExpenseId && (
        <DeleteExpenseDialog
          expenseId={deleteExpenseId}
          onClose={() => setDeleteExpenseId(null)}
          onSuccess={() => {
            setDeleteExpenseId(null);
            onDelete();
          }}
        />
      )}
    </div>
  );
}
