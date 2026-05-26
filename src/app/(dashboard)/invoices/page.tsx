"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getUserInvoices } from "@/actions/invoice.actions";
import InvoiceForm from "@/components/invoices/invoice-form";
import InvoiceTable from "@/components/invoices/invoice-table";
import SectionHeader from "@/components/dashboard/section-header";
import { formatInr } from "@/lib/format-currency";
import { formatDateForInput } from "@/lib/format-date";
import { getClientErrorMessage } from "@/lib/errors";
import { getTaxRateFromAmounts } from "@/lib/serialize-invoice";
import type { InvoiceFormOutput } from "@/schemas/invoice.schema";
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

export default function InvoicesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const hasFilters = Boolean(searchQuery) || statusFilter !== "all";

  const loadInvoices = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const result = await getUserInvoices(
        searchQuery || undefined,
        statusFilter === "all" ? undefined : statusFilter
      );

      if (result.error) {
        setFetchError(result.error);
        setInvoices([]);
        toast.error(result.error);
      } else {
        setInvoices(result.data || []);
      }
    } catch (error) {
      const message = getClientErrorMessage(
        error,
        "Could not load invoices. Check your connection and try again."
      );
      setFetchError(message);
      setInvoices([]);
      toast.error(message);
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

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
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
                        dueDate: formatDateForInput(selectedInvoice.dueDate),
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
              <Button
                variant="ghost"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setIsFormOpen(false);
                  setSelectedInvoice(null);
                }}
              >
                ← Back to invoices
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <Button
                className="w-full"
                onClick={() => {
                  setIsFormOpen(true);
                  setSelectedInvoice(null);
                }}
              >
                + New Invoice
              </Button>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Summary
                </label>
                <div className="rounded-xl border border-border/60 bg-muted/30 space-y-3 p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Paid Revenue
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatInr(totalRevenue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Outstanding
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {formatInr(outstandingTotal)}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {invoices.length} invoices tracked
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Search by client name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
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
            <TableSkeleton />
          ) : (
            <InvoiceTable
              invoices={invoices}
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
