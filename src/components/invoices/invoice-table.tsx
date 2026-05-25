"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatInr } from "@/lib/format-currency";
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
}

export default function InvoiceTable({
  invoices,
  onEdit,
  onDelete,
}: InvoiceTableProps) {
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<string | null>(null);

  if (invoices.length === 0) {
    return (
      <Card className="border border-slate-200/70 bg-white/80 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/60">
        <CardContent className="flex min-h-96 items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              No invoices yet
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Create your first invoice to get started
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="hidden md:block overflow-x-auto">
        <Card className="border border-slate-200/70 bg-white/80 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/60">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/70 bg-slate-50/50 dark:border-slate-800/70 dark:bg-slate-900/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Invoice #
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Due Date
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
              {invoices.map((invoice) => (
                <tr
                  key={invoice._id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {invoice.clientName}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[invoice.status]}`}
                    >
                      {STATUS_LABELS[invoice.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {formatInr(invoice.total)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
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

      <div className="md:hidden space-y-3">
        {invoices.map((invoice) => (
          <Card
            key={invoice._id}
            className="border border-slate-200/70 bg-white/80 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/60"
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {invoice.invoiceNumber}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {invoice.clientName}
                  </p>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {formatInr(invoice.total)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[invoice.status]}`}
                  >
                    {STATUS_LABELS[invoice.status]}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Due {new Date(invoice.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
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
            </CardContent>
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
