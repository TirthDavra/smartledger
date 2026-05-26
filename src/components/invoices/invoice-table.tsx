"use client";

import { useState } from "react";
import { AlertCircle, FileText, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatInr } from "@/lib/format-currency";
import { formatDisplayDate } from "@/lib/format-date";
import DeleteInvoiceDialog from "./delete-invoice-dialog";
import type { InvoiceFormOutput } from "@/schemas/invoice.schema";

const STATUS_LABELS: Record<InvoiceFormOutput["status"], string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

const STATUS_STYLES: Record<InvoiceFormOutput["status"], string> = {
  draft: "bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-200",
  sent: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  overdue: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
};

interface Invoice {
  _id: string;
  clientName: string;
  invoiceNumber: string;
  status: InvoiceFormOutput["status"];
  total: number;
  dueDate: string;
}

interface InvoiceTableProps {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  onDelete: () => void;
  error?: string | null;
  isFiltered?: boolean;
}

export default function InvoiceTable({
  invoices,
  onEdit,
  onDelete,
  error,
  isFiltered,
}: InvoiceTableProps) {
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<string | null>(null);

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Could not load invoices"
        description={error}
      />
    );
  }

  if (invoices.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title={isFiltered ? "No matching invoices" : "No invoices yet"}
        description={
          isFiltered
            ? "Try adjusting your search or status filter."
            : "Create your first invoice to start tracking client billing."
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="hidden overflow-x-auto md:block">
        <Card className="border border-slate-200/70 bg-white/80 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/60">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-200/70 bg-slate-50/50 dark:border-slate-800/70 dark:bg-slate-900/50">
                <th className="px-4 py-3 text-left text-sm font-semibold sm:px-6 sm:py-4">
                  Invoice #
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold sm:px-6 sm:py-4">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold sm:px-6 sm:py-4">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold sm:px-6 sm:py-4">
                  Total
                </th>
                <th className="hidden px-4 py-3 text-left text-sm font-semibold sm:table-cell sm:px-6 sm:py-4">
                  Due Date
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold sm:px-6 sm:py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
              {invoices.map((invoice) => (
                <tr
                  key={invoice._id}
                  className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/50"
                >
                  <td className="px-4 py-3 text-sm font-medium sm:px-6 sm:py-4">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground sm:px-6 sm:py-4">
                    {invoice.clientName}
                  </td>
                  <td className="px-4 py-3 text-sm sm:px-6 sm:py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[invoice.status]}`}
                    >
                      {STATUS_LABELS[invoice.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold sm:px-6 sm:py-4">
                    {formatInr(invoice.total)}
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell sm:px-6 sm:py-4">
                    {formatDisplayDate(invoice.dueDate)}
                  </td>
                  <td className="px-4 py-3 text-center sm:px-6 sm:py-4">
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onEdit(invoice)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteInvoiceId(invoice._id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <div className="space-y-3 md:hidden">
        {invoices.map((invoice) => (
          <Card
            key={invoice._id}
            className="border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/60"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold truncate">{invoice.invoiceNumber}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {invoice.clientName}
                </p>
              </div>
              <p className="shrink-0 text-lg font-bold">
                {formatInr(invoice.total)}
              </p>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[invoice.status]}`}
                >
                  {STATUS_LABELS[invoice.status]}
                </span>
                <span className="text-xs text-muted-foreground">
                  Due {formatDisplayDate(invoice.dueDate)}
                </span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onEdit(invoice)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setDeleteInvoiceId(invoice._id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {deleteInvoiceId && (
        <DeleteInvoiceDialog
          invoiceId={deleteInvoiceId}
          onClose={() => setDeleteInvoiceId(null)}
          onSuccess={() => {
            setDeleteInvoiceId(null);
            onDelete();
          }}
        />
      )}
    </div>
  );
}
