"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectDB } from "@/lib/db";
import { serializeInvoice } from "@/lib/serialize-invoice";
import { Invoice } from "@/models/invoice.model";
import {
  calculateInvoiceTotals,
  invoiceFormSchema,
} from "@/schemas/invoice.schema";

function buildInvoicePayload(
  data: ReturnType<typeof invoiceFormSchema.parse>
) {
  const { subtotal, tax, total } = calculateInvoiceTotals(
    data.lineItems,
    data.tax
  );

  return {
    clientName: data.clientName,
    invoiceNumber: data.invoiceNumber.trim(),
    status: data.status,
    issueDate: data.issueDate,
    dueDate: data.dueDate,
    lineItems: data.lineItems,
    subtotal,
    tax,
    total,
  };
}

async function isInvoiceNumberTaken(
  userId: string,
  invoiceNumber: string,
  excludeInvoiceId?: string
) {
  const query: Record<string, unknown> = {
    userId,
    invoiceNumber: invoiceNumber.trim(),
  };

  if (excludeInvoiceId) {
    query._id = { $ne: excludeInvoiceId };
  }

  const existing = await Invoice.findOne(query).select("_id").lean();
  return Boolean(existing);
}

function isDuplicateKeyError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: number }).code === 11000
  );
}

export async function createInvoice(data: unknown) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const validatedFields = invoiceFormSchema.safeParse(data);

    if (!validatedFields.success) {
      return { error: "Invalid fields" };
    }

    await connectDB();

    const payload = buildInvoicePayload(validatedFields.data);

    if (await isInvoiceNumberTaken(session.user.id, payload.invoiceNumber)) {
      return { error: "Invoice number already exists" };
    }

    const invoice = await Invoice.create({
      ...payload,
      userId: session.user.id,
    });

    return { success: true, data: serializeInvoice(invoice) };
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return { error: "Invoice number already exists" };
    }
    console.error("Create invoice error:", error);
    return { error: "Failed to create invoice" };
  }
}

export async function updateInvoice(id: string, data: unknown) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const validatedFields = invoiceFormSchema.safeParse(data);

    if (!validatedFields.success) {
      return { error: "Invalid fields" };
    }

    await connectDB();

    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return { error: "Invoice not found" };
    }

    if (invoice.userId.toString() !== session.user.id) {
      return { error: "Unauthorized" };
    }

    const payload = buildInvoicePayload(validatedFields.data);

    if (await isInvoiceNumberTaken(session.user.id, payload.invoiceNumber, id)) {
      return { error: "Invoice number already exists" };
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      payload,
      { new: true }
    );

    if (!updatedInvoice) {
      return { error: "Failed to update invoice" };
    }

    return { success: true, data: serializeInvoice(updatedInvoice) };
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return { error: "Invoice number already exists" };
    }
    console.error("Update invoice error:", error);
    return { error: "Failed to update invoice" };
  }
}

export async function deleteInvoice(id: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    await connectDB();

    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return { error: "Invoice not found" };
    }

    if (invoice.userId.toString() !== session.user.id) {
      return { error: "Unauthorized" };
    }

    await Invoice.findByIdAndDelete(id);

    return { success: true };
  } catch (error) {
    console.error("Delete invoice error:", error);
    return { error: "Failed to delete invoice" };
  }
}

export async function getUserInvoices(
  searchQuery?: string,
  statusFilter?: string
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
      query.clientName = { $regex: searchQuery, $options: "i" };
    }

    if (statusFilter) {
      query.status = statusFilter;
    }

    const invoices = await Invoice.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      data: invoices.map((invoice) => serializeInvoice(invoice)),
    };
  } catch (error) {
    console.error("Get invoices error:", error);
    return { error: "Failed to fetch invoices" };
  }
}
