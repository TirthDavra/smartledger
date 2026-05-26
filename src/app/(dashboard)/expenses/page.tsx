"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getUserExpenses } from "@/actions/expense.actions";
import ExpenseForm from "@/components/expenses/expense-form";
import ExpenseTable from "@/components/expenses/expense-table";
import SectionHeader from "@/components/dashboard/section-header";
import { formatInr } from "@/lib/format-currency";
import { formatDateForInput } from "@/lib/format-date";
import { getClientErrorMessage } from "@/lib/errors";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/table-skeleton";
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
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const hasFilters = Boolean(searchQuery) || categoryFilter !== "all";

  const loadExpenses = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const result = await getUserExpenses(
        searchQuery || undefined,
        categoryFilter === "all" ? undefined : categoryFilter
      );

      if (result.error) {
        setFetchError(result.error);
        setExpenses([]);
        toast.error(result.error);
      } else {
        setExpenses(result.data || []);
      }
    } catch (error) {
      const message = getClientErrorMessage(
        error,
        "Could not load expenses. Check your connection and try again."
      );
      setFetchError(message);
      setExpenses([]);
      toast.error(message);
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

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
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
                        expenseDate: formatDateForInput(
                          selectedExpense.expenseDate
                        ),
                        notes: selectedExpense.notes,
                        _id: selectedExpense._id,
                      }
                    : undefined
                }
                onSuccess={handleFormSuccess}
              />
              <Button
                variant="ghost"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setIsFormOpen(false);
                  setSelectedExpense(null);
                }}
              >
                ← Back to expenses
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <Button
                className="w-full"
                onClick={() => {
                  setIsFormOpen(true);
                  setSelectedExpense(null);
                }}
              >
                + New Expense
              </Button>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Summary
                </label>
                <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">
                    Total Expenses
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatInr(expenses.reduce((sum, e) => sum + e.amount, 0))}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {expenses.length} expenses tracked
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Search by title or vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
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
            <TableSkeleton />
          ) : (
            <ExpenseTable
              expenses={expenses}
              onEdit={handleEdit}
              onDelete={handleDelete}
              error={fetchError}
              isFiltered={hasFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
}
