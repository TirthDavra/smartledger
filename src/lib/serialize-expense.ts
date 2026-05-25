import type { Types } from "mongoose";

import type { ExpenseFormOutput } from "@/schemas/expense.schema";

export type SerializedExpense = {
  _id: string;
  title: string;
  amount: number;
  category: ExpenseFormOutput["category"];
  vendor: string;
  expenseDate: string;
  notes: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

type ExpenseDoc = {
  _id: Types.ObjectId | string;
  title: string;
  amount: number;
  category: ExpenseFormOutput["category"];
  vendor: string;
  expenseDate: Date;
  notes?: string;
  userId: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
};

export function serializeExpense(expense: ExpenseDoc): SerializedExpense {
  return {
    _id: expense._id.toString(),
    title: expense.title,
    amount: expense.amount,
    category: expense.category,
    vendor: expense.vendor,
    expenseDate: expense.expenseDate.toISOString(),
    notes: expense.notes ?? "",
    userId: expense.userId.toString(),
    createdAt: expense.createdAt?.toISOString() ?? "",
    updatedAt: expense.updatedAt?.toISOString() ?? "",
  };
}
