"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createExpense, updateExpense } from "@/actions/expense.actions";
import {
  expenseSchema,
  type ExpenseFormInput,
  type ExpenseFormOutput,
} from "@/schemas/expense.schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const CATEGORY_OPTIONS = [
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

interface ExpenseFormProps {
  initialData?: ExpenseFormOutput & { _id?: string };
  onSuccess?: () => void;
}

export default function ExpenseForm({
  initialData,
  onSuccess,
}: ExpenseFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ExpenseFormInput, unknown, ExpenseFormOutput>({
    resolver: zodResolver(expenseSchema),
    defaultValues: initialData || {
      category: "other",
      notes: "",
    },
  });

  const category = watch("category");

  const onSubmit = async (data: ExpenseFormOutput) => {
    setIsLoading(true);
    try {
      let result;

      if (initialData?._id) {
        result = await updateExpense(initialData._id, data);
      } else {
        result = await createExpense(data);
      }

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          initialData?._id
            ? "Expense updated successfully"
            : "Expense created successfully"
        );
        onSuccess?.();
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData?._id ? "Edit Expense" : "Add New Expense"}
        </CardTitle>
        <CardDescription>
          {initialData?._id
            ? "Update the expense details below"
            : "Create a new expense entry"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                {...register("title")}
                id="title"
                placeholder="e.g., Team lunch"
                disabled={isLoading}
              />
              <FieldError errors={errors.title ? [errors.title] : undefined} />
            </Field>

            <Field>
              <FieldLabel htmlFor="amount">Amount</FieldLabel>
              <Input
                {...register("amount")}
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                disabled={isLoading}
              />
              <FieldError
                errors={errors.amount ? [errors.amount] : undefined}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="category">Category</FieldLabel>
              <Select
                value={category}
                onValueChange={(value) =>
                  setValue("category", value as ExpenseFormOutput["category"])
                }
              >
                <SelectTrigger id="category" disabled={isLoading}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError
                errors={errors.category ? [errors.category] : undefined}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="vendor">Vendor</FieldLabel>
              <Input
                {...register("vendor")}
                id="vendor"
                placeholder="e.g., Restaurant name"
                disabled={isLoading}
              />
              <FieldError
                errors={errors.vendor ? [errors.vendor] : undefined}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="expenseDate">Expense Date</FieldLabel>
              <Input
                {...register("expenseDate")}
                id="expenseDate"
                type="date"
                disabled={isLoading}
              />
              <FieldError
                errors={errors.expenseDate ? [errors.expenseDate] : undefined}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="notes">Notes (Optional)</FieldLabel>
              <Textarea
                {...register("notes")}
                id="notes"
                placeholder="Add any additional notes..."
                disabled={isLoading}
              />
              <FieldError
                errors={errors.notes ? [errors.notes] : undefined}
              />
            </Field>

            <Field>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading
                  ? "Saving..."
                  : initialData?._id
                    ? "Update Expense"
                    : "Create Expense"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
