"use client";

import { useEffect, useState } from "react";
import { getUserInvoices } from "@/actions/invoice.actions";
import InvoiceForm from "@/components/invoices/invoice-form";
import InvoiceTable from "@/components/invoices/invoice-table";
import SectionHeader from "@/components/dashboard/section-header";
import { formatInr } from "@/lib/format-currency";
import { getTaxRateFromAmounts } from "@/lib/serialize-invoice";
import type { InvoiceFormOutput } from "@/schemas/invoice.schema";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Invoice {
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
}

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "cancelled", label: "Cancelled" },
];

function formatDateForInput(isoDate: string) {
  return new Date(isoDate).toISOString().split("T")[0];
}

export default function InvoicesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadInvoices = async () => {
    setIsLoading(true);
    try {
      const result = await getUserInvoices(
        searchQuery || undefined,
        statusFilter === "all" ? undefined : statusFilter
      );

      if (result.error) {
        console.error(result.error);
        setInvoices([]);
      } else {
        setInvoices(result.data || []);
      }
    } catch (error) {
      console.error(error);
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadInvoices();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  const handleEdit = (invoice: { _id: string }) => {
    const fullInvoice = invoices.find((inv) => inv._id === invoice._id);
    if (fullInvoice) {
      setSelectedInvoice(fullInvoice);
      setIsFormOpen(true);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedInvoice(null);
    loadInvoices();
  };

  const handleDelete = () => {
    loadInvoices();
  };

  const totalRevenue = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.total, 0);

  const outstandingTotal = invoices
    .filter((inv) => inv.status === "sent" || inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Invoice Management"
        description="Create, track, and manage client invoices with dynamic line items."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <div>
          {isFormOpen ? (
            <>
              <InvoiceForm
                initialData={
                  selectedInvoice
                    ? {
                        clientName: selectedInvoice.clientName,
                        invoiceNumber: selectedInvoice.invoiceNumber,
                        status: selectedInvoice.status,
                        issueDate: formatDateForInput(
                          selectedInvoice.issueDate
                        ),
                        dueDate: formatDateForInput(
                          selectedInvoice.dueDate
                        ),
                        lineItems: selectedInvoice.lineItems,
                        tax: getTaxRateFromAmounts(
                          selectedInvoice.subtotal,
                          selectedInvoice.tax
                        ),
                        _id: selectedInvoice._id,
                      }
                    : undefined
                }
                onSuccess={handleFormSuccess}
              />
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setSelectedInvoice(null);
                }}
                className="mt-4 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                ← Back to invoices
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => {
                  setIsFormOpen(true);
                  setSelectedInvoice(null);
                }}
                className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 transition"
              >
                + New Invoice
              </button>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Summary
                </label>
                <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900 space-y-3">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Paid Revenue
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {formatInr(totalRevenue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Outstanding
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {formatInr(outstandingTotal)}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {invoices.length} invoices tracked
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <Input
              placeholder="Search by client name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-slate-200/70 dark:border-slate-800/70"
            />

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-slate-200/70 dark:border-slate-800/70">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTER_OPTIONS.map((option) => (
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
                Loading invoices...
              </p>
            </div>
          ) : (
            <InvoiceTable
              invoices={invoices}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
