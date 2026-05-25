import mongoose, { Schema, models, model } from "mongoose";

const expenseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: [
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
    },
    vendor: {
      type: String,
      required: true,
      trim: true,
    },
    expenseDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Expense =
  models.Expense || model("Expense", expenseSchema);
