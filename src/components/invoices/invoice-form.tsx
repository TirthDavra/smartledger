"use client";

import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { createInvoice, updateInvoice } from "@/actions/invoice.actions";
import {
  calculateInvoiceTotals,
  invoiceFormSchema,
  type InvoiceFormInput,
  type InvoiceFormOutput,
} from "@/schemas/invoice.schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "cancelled", label: "Cancelled" },
] as const;

interface InvoiceFormProps {
  initialData?: InvoiceFormInput & { _id?: string };
  onSuccess?: () => void;
}

export default function InvoiceForm({
  initialData,
  onSuccess,
}: InvoiceFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<InvoiceFormInput, unknown, InvoiceFormOutput>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: initialData || {
      status: "draft",
      tax: 0,
      lineItems: [{ title: "", quantity: 1, price: 0.01 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  });

  const status = watch("status");
  const lineItems = watch("lineItems");
  const taxRate = watch("tax");

  const totals = useMemo(() => {
    const items = (lineItems || []).filter(
      (item) =>
        item?.title &&
        Number(item.quantity) > 0 &&
        Number(item.price) > 0
    ) as InvoiceFormOutput["lineItems"];

    if (items.length === 0) {
      return { subtotal: 0, tax: 0, total: 0 };
    }

    return calculateInvoiceTotals(items, Number(taxRate) || 0);
  }, [lineItems, taxRate]);

  const onSubmit = async (data: InvoiceFormOutput) => {
    setIsLoading(true);
    try {
      let result;

      if (initialData?._id) {
        result = await updateInvoice(initialData._id, data);
      } else {
        result = await createInvoice(data);
      }

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          initialData?._id
            ? "Invoice updated successfully"
            : "Invoice created successfully"
        );
        onSuccess?.();
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData?._id ? "Edit Invoice" : "Create Invoice"}
        </CardTitle>
        <CardDescription>
          {initialData?._id
            ? "Update invoice details and line items"
            : "Add client details and line items for a new invoice"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="clientName">Client Name</FieldLabel>
              <Input
                {...register("clientName")}
                id="clientName"
                placeholder="e.g., Acme Corp"
                disabled={isLoading}
              />
              <FieldError
                errors={errors.clientName ? [errors.clientName] : undefined}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="invoiceNumber">Invoice Number</FieldLabel>
              <Input
                {...register("invoiceNumber")}
                id="invoiceNumber"
                placeholder="e.g., INV-2026-001"
                disabled={isLoading}
              />
              <FieldError
                errors={
                  errors.invoiceNumber ? [errors.invoiceNumber] : undefined
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <Select
                value={status}
                onValueChange={(value) =>
                  setValue("status", value as InvoiceFormOutput["status"])
                }
              >
                <SelectTrigger id="status" disabled={isLoading}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError
                errors={errors.status ? [errors.status] : undefined}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="issueDate">Issue Date</FieldLabel>
                <Input
                  {...register("issueDate")}
                  id="issueDate"
                  type="date"
                  disabled={isLoading}
                />
                <FieldError
                  errors={errors.issueDate ? [errors.issueDate] : undefined}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="dueDate">Due Date</FieldLabel>
                <Input
                  {...register("dueDate")}
                  id="dueDate"
                  type="date"
                  disabled={isLoading}
                />
                <FieldError
                  errors={errors.dueDate ? [errors.dueDate] : undefined}
                />
              </Field>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FieldLabel>Line Items</FieldLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  onClick={() => append({ title: "", quantity: 1, price: 0.01 })}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Item
                </Button>
              </div>

              {errors.lineItems?.message && (
                <FieldError errors={[errors.lineItems]} />
              )}

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-lg border border-slate-200/70 p-3 dark:border-slate-800/70"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Item {index + 1}
                      </span>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          disabled={isLoading}
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Input
                        {...register(`lineItems.${index}.title`)}
                        placeholder="Item title"
                        disabled={isLoading}
                      />
                      <FieldError
                        errors={
                          errors.lineItems?.[index]?.title
                            ? [errors.lineItems[index]?.title]
                            : undefined
                        }
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Input
                            {...register(`lineItems.${index}.quantity`)}
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="Qty"
                            disabled={isLoading}
                          />
                          <FieldError
                            errors={
                              errors.lineItems?.[index]?.quantity
                                ? [errors.lineItems[index]?.quantity]
                                : undefined
                            }
                          />
                        </div>
                        <div>
                          <Input
                            {...register(`lineItems.${index}.price`)}
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="Price"
                            disabled={isLoading}
                          />
                          <FieldError
                            errors={
                              errors.lineItems?.[index]?.price
                                ? [errors.lineItems[index]?.price]
                                : undefined
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Field>
              <FieldLabel htmlFor="tax">Tax Rate (%)</FieldLabel>
              <Input
                {...register("tax")}
                id="tax"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="0"
                disabled={isLoading}
              />
              <FieldError errors={errors.tax ? [errors.tax] : undefined} />
            </Field>

            <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  ${totals.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Tax</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  ${totals.tax.toFixed(2)}
                </span>
              </div>
              <div className="mt-2 flex justify-between border-t border-slate-200/70 pt-2 text-sm font-semibold dark:border-slate-800/70">
                <span className="text-slate-900 dark:text-slate-100">Total</span>
                <span className="text-slate-900 dark:text-slate-100">
                  ${totals.total.toFixed(2)}
                </span>
              </div>
            </div>

            <Field>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading
                  ? "Saving..."
                  : initialData?._id
                    ? "Update Invoice"
                    : "Create Invoice"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
