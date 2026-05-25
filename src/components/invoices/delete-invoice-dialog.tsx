"use client";

import { useState } from "react";
import { deleteInvoice } from "@/actions/invoice.actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DeleteInvoiceDialogProps {
  invoiceId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteInvoiceDialog({
  invoiceId,
  onClose,
  onSuccess,
}: DeleteInvoiceDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deleteInvoice(invoiceId);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Invoice deleted successfully");
        onSuccess();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete invoice");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Invoice?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The invoice will be permanently
            deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
