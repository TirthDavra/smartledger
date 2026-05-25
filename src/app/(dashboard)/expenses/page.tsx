"use client";

import { useEffect, useState } from "react";
import { getUserExpenses } from "@/actions/expense.actions";
import ExpenseForm from "@/components/expenses/expense-form";
import ExpenseTable from "@/components/expenses/expense-table";
import SectionHeader from "@/components/dashboard/section-header";
import { formatInr } from "@/lib/format-currency";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: "meals" | "software" | "operations" | "payroll" | "marketing" | "travel" | "utilities" | "office" | "other";
  vendor: string;
  expenseDate: string;
  notes: string;
}

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "meals", label: "Meals" },
  { value: "software", label: "Software" },
  { value: "operations", label: "Operations" },
  { value: "payroll", label: "Payroll" },
  { value: "marketing", label: "Marketing" },
  { value: "travel", label: "Travel" },
  { value: "utilities", label: "Utilities" },
  { value: "office", label: "Office" },
  { value: "other", label: "Other" },
];

export default function ExpensesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const loadExpenses = async () => {
    setIsLoading(true);
    try {
      const result = await getUserExpenses(
        searchQuery || undefined,
        categoryFilter === "all" ? undefined : categoryFilter
      );

      if (result.error) {
        console.error(result.error);
        setExpenses([]);
      } else {
        setExpenses(result.data || []);
      }
    } catch (error) {
      console.error(error);
      setExpenses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadExpenses();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, categoryFilter]);

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedExpense(null);
    loadExpenses();
  };

  const handleDelete = () => {
    loadExpenses();
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Expense Management"
        description="Track and manage all your business expenses in one place."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <div>
          {isFormOpen ? (
            <>
              <ExpenseForm
                initialData={
                  selectedExpense
                    ? {
                        title: selectedExpense.title,
                        amount: selectedExpense.amount,
                        category: selectedExpense.category,
                        vendor: selectedExpense.vendor,
                        expenseDate: new Date(
                          selectedExpense.expenseDate
                        ).toISOString().split("T")[0] as any,
                        notes: selectedExpense.notes,
                        _id: selectedExpense._id,
                      }
                    : undefined
                }
                onSuccess={handleFormSuccess}
              />
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setSelectedExpense(null);
                }}
                className="mt-4 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                ← Back to expenses
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => {
                  setIsFormOpen(true);
                  setSelectedExpense(null);
                }}
                className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 transition"
              >
                + New Expense
              </button>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Summary
                </label>
                <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Total Expenses
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {formatInr(expenses.reduce((sum, e) => sum + e.amount, 0))}
                  </p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {expenses.length} expenses tracked
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <Input
              placeholder="Search by title or vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-slate-200/70 dark:border-slate-800/70"
            />

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="border-slate-200/70 dark:border-slate-800/70">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-slate-600 dark:text-slate-400">
                Loading expenses...
              </p>
            </div>
          ) : (
            <ExpenseTable
              expenses={expenses}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
