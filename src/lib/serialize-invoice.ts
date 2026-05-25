import type { Types } from "mongoose";

import type { InvoiceFormOutput } from "@/schemas/invoice.schema";

export type SerializedInvoice = {
  _id: string;
  clientName: string;
  invoiceNumber: string;
  status: InvoiceFormOutput["status"];
  issueDate: string;
  dueDate: string;
  lineItems: InvoiceFormOutput["lineItems"];
  subtotal: number;
  tax: number;
  total: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

type LineItemDoc = {
  title: string;
  quantity: number;
  price: number;
  toObject?: () => LineItemDoc;
};

type InvoiceDoc = {
  _id: Types.ObjectId | string;
  clientName: string;
  invoiceNumber: string;
  status: InvoiceFormOutput["status"];
  issueDate: Date | string;
  dueDate: Date | string;
  lineItems: LineItemDoc[];
  subtotal: number;
  tax: number;
  total: number;
  userId: Types.ObjectId | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  toObject?: () => InvoiceDoc;
};

function toIsoString(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function serializeLineItems(
  lineItems: LineItemDoc[]
): InvoiceFormOutput["lineItems"] {
  return lineItems.map((item) => {
    const plain =
      typeof item.toObject === "function" ? item.toObject() : item;

    return {
      title: plain.title,
      quantity: Number(plain.quantity),
      price: Number(plain.price),
    };
  });
}

export function serializeInvoice(invoice: InvoiceDoc): SerializedInvoice {
  const plain =
    typeof invoice.toObject === "function" ? invoice.toObject() : invoice;

  return {
    _id: plain._id.toString(),
    clientName: plain.clientName,
    invoiceNumber: plain.invoiceNumber,
    status: plain.status,
    issueDate: toIsoString(plain.issueDate),
    dueDate: toIsoString(plain.dueDate),
    lineItems: serializeLineItems(plain.lineItems),
    subtotal: Number(plain.subtotal),
    tax: Number(plain.tax),
    total: Number(plain.total),
    userId: plain.userId.toString(),
    createdAt: plain.createdAt ? toIsoString(plain.createdAt) : "",
    updatedAt: plain.updatedAt ? toIsoString(plain.updatedAt) : "",
  };
}

/** Derive tax rate % from stored subtotal and tax amount (for edit form). */
export function getTaxRateFromAmounts(subtotal: number, taxAmount: number) {
  if (subtotal <= 0) return 0;
  return Math.round((taxAmount / subtotal) * 10000) / 100;
}
