"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { deleteExpense } from "@/actions/expense.actions";
import { getClientErrorMessage } from "@/lib/errors";
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

interface DeleteExpenseDialogProps {
  expenseId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteExpenseDialog({
  expenseId,
  onClose,
  onSuccess,
}: DeleteExpenseDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deleteExpense(expenseId);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Expense deleted successfully");
        onSuccess();
      }
    } catch (error) {
      toast.error(
        getClientErrorMessage(error, "Failed to delete expense. Please try again.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Expense?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The expense will be permanently
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
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
