"use client";

import { useState } from "react";
import { AlertCircle, Pencil, Receipt, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatInr } from "@/lib/format-currency";
import { formatDisplayDate } from "@/lib/format-date";
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
  category:
    | "meals"
    | "software"
    | "operations"
    | "payroll"
    | "marketing"
    | "travel"
    | "utilities"
    | "office"
    | "other";
  vendor: string;
  expenseDate: string;
  notes: string;
}

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: () => void;
  error?: string | null;
  isFiltered?: boolean;
}

export default function ExpenseTable({
  expenses,
  onEdit,
  onDelete,
  error,
  isFiltered,
}: ExpenseTableProps) {
  const [deleteExpenseId, setDeleteExpenseId] = useState<string | null>(null);

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Could not load expenses"
        description={error}
      />
    );
  }

  if (expenses.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title={isFiltered ? "No matching expenses" : "No expenses yet"}
        description={
          isFiltered
            ? "Try adjusting your search or category filter."
            : "Create your first expense to start tracking spending."
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="hidden overflow-x-auto md:block">
        <Card className="border border-slate-200/70 bg-white/80 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/60">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-200/70 bg-slate-50/50 dark:border-slate-800/70 dark:bg-slate-900/50">
                <th className="px-4 py-3 text-left text-sm font-semibold sm:px-6 sm:py-4">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold sm:px-6 sm:py-4">
                  Category
                </th>
                <th className="hidden px-4 py-3 text-left text-sm font-semibold lg:table-cell sm:px-6 sm:py-4">
                  Vendor
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold sm:px-6 sm:py-4">
                  Amount
                </th>
                <th className="hidden px-4 py-3 text-left text-sm font-semibold sm:table-cell sm:px-6 sm:py-4">
                  Date
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold sm:px-6 sm:py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
              {expenses.map((expense) => (
                <tr
                  key={expense._id}
                  className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/50"
                >
                  <td className="px-4 py-3 text-sm font-medium sm:px-6 sm:py-4">
                    {expense.title}
                  </td>
                  <td className="px-4 py-3 text-sm sm:px-6 sm:py-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-800/50 dark:text-slate-200">
                      {CATEGORY_LABELS[expense.category] || expense.category}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground lg:table-cell sm:px-6 sm:py-4">
                    {expense.vendor}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold sm:px-6 sm:py-4">
                    {formatInr(expense.amount)}
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell sm:px-6 sm:py-4">
                    {formatDisplayDate(expense.expenseDate)}
                  </td>
                  <td className="px-4 py-3 text-center sm:px-6 sm:py-4">
                    <div className="flex justify-center gap-1">
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

      <div className="space-y-3 md:hidden">
        {expenses.map((expense) => (
          <Card
            key={expense._id}
            className="border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/60"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold truncate">{expense.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {expense.vendor}
                </p>
              </div>
              <p className="shrink-0 text-lg font-bold">
                {formatInr(expense.amount)}
              </p>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium dark:bg-slate-800/50">
                  {CATEGORY_LABELS[expense.category] || expense.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDisplayDate(expense.expenseDate)}
                </span>
              </div>
              <div className="flex gap-1">
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
