import { z } from "zod";

export const expenseSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  amount: z.coerce
    .number()
    .positive("Amount must be greater than 0")
    .finite()
    .multipleOf(0.01),
  category: z.enum(
    [
      "meals",
      "software",
      "operations",
      "payroll",
      "marketing",
      "travel",
      "utilities",
      "office",
      "other",
    ],
    { message: "Invalid category" }
  ),
  vendor: z.string().min(1, "Vendor is required").max(100),
  expenseDate: z.coerce.date().refine(
    (date) => date <= new Date(),
    "Expense date cannot be in the future"
  ),
  notes: z.string().max(500).optional().default(""),
});

export type ExpenseFormInput = z.input<typeof expenseSchema>;
export type ExpenseFormOutput = z.output<typeof expenseSchema>;
/** Parsed expense payload (after Zod validation). */
export type ExpenseFormData = ExpenseFormOutput;
