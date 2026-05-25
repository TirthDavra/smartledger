"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectDB } from "@/lib/db";
import { serializeExpense } from "@/lib/serialize-expense";
import { Expense } from "@/models/expense.model";
import { expenseSchema } from "@/schemas/expense.schema";

export async function createExpense(data: unknown) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const validatedFields = expenseSchema.safeParse(data);

    if (!validatedFields.success) {
      return { error: "Invalid fields" };
    }

    await connectDB();

    const expense = await Expense.create({
      ...validatedFields.data,
      userId: session.user.id,
    });

    return { success: true, data: serializeExpense(expense) };
  } catch (error) {
    console.error("Create expense error:", error);
    return { error: "Failed to create expense" };
  }
}

export async function updateExpense(
  id: string,
  data: unknown
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const validatedFields = expenseSchema.safeParse(data);

    if (!validatedFields.success) {
      return { error: "Invalid fields" };
    }

    await connectDB();

    const expense = await Expense.findById(id);

    if (!expense) {
      return { error: "Expense not found" };
    }

    if (expense.userId.toString() !== session.user.id) {
      return { error: "Unauthorized" };
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      validatedFields.data,
      { new: true }
    );

    if (!updatedExpense) {
      return { error: "Failed to update expense" };
    }

    return { success: true, data: serializeExpense(updatedExpense) };
  } catch (error) {
    console.error("Update expense error:", error);
    return { error: "Failed to update expense" };
  }
}

export async function deleteExpense(id: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    await connectDB();

    const expense = await Expense.findById(id);

    if (!expense) {
      return { error: "Expense not found" };
    }

    if (expense.userId.toString() !== session.user.id) {
      return { error: "Unauthorized" };
    }

    await Expense.findByIdAndDelete(id);

    return { success: true };
  } catch (error) {
    console.error("Delete expense error:", error);
    return { error: "Failed to delete expense" };
  }
}

export async function getUserExpenses(
  searchQuery?: string,
  categoryFilter?: string
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    await connectDB();

    const query: Record<string, unknown> = {
      userId: session.user.id,
    };

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { vendor: { $regex: searchQuery, $options: "i" } },
      ];
    }

    if (categoryFilter) {
      query.category = categoryFilter;
    }

    const expenses = await Expense.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      data: expenses.map((expense) => serializeExpense(expense)),
    };
  } catch (error) {
    console.error("Get expenses error:", error);
    return { error: "Failed to fetch expenses" };
  }
}
