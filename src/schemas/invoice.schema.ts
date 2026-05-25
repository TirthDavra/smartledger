import { z } from "zod";

export const INVOICE_STATUSES = [
  "draft",
  "sent",
  "paid",
  "overdue",
  "cancelled",
] as const;

export const lineItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  quantity: z.coerce
    .number()
    .positive("Quantity must be greater than 0")
    .finite(),
  price: z.coerce
    .number()
    .positive("Price must be greater than 0")
    .finite()
    .multipleOf(0.01),
});

export const invoiceFormSchema = z
  .object({
    clientName: z.string().min(1, "Client name is required").max(100),
    invoiceNumber: z.string().min(1, "Invoice number is required").max(50),
    status: z.enum(INVOICE_STATUSES, { message: "Invalid status" }),
    issueDate: z.coerce.date({ message: "Issue date is required" }),
    dueDate: z.coerce.date({ message: "Due date is required" }),
    lineItems: z
      .array(lineItemSchema)
      .min(1, "At least one line item is required"),
    tax: z.coerce
      .number()
      .min(0, "Tax rate cannot be negative")
      .max(100, "Tax rate cannot exceed 100%"),
  })
  .refine((data) => data.dueDate >= data.issueDate, {
    message: "Due date must be on or after issue date",
    path: ["dueDate"],
  });

export type InvoiceFormInput = z.input<typeof invoiceFormSchema>;
export type InvoiceFormOutput = z.output<typeof invoiceFormSchema>;
export type LineItem = z.infer<typeof lineItemSchema>;
export type InvoiceFormData = InvoiceFormOutput;

export function calculateInvoiceTotals(
  lineItems: LineItem[],
  taxRate: number
) {
  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}
