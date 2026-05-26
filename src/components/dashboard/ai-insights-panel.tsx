"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { getClientErrorMessage } from "@/lib/errors";

export default function AiInsightsPanel() {
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/financial-insights", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        const message =
          data.error ||
          (response.status === 401
            ? "Please sign in to generate insights."
            : "Failed to generate insights. Please try again.");
        setError(message);
        toast.error(message);
        return;
      }

      setInsights(data.insights ?? []);
      setHasGenerated(true);
    } catch (err) {
      const message = getClientErrorMessage(
        err,
        "Network error while generating insights. Check your connection and try again."
      );
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border border-slate-200/70 bg-white/80 shadow-sm transition hover:shadow-md dark:border-slate-800/70 dark:bg-slate-950/60">
      <CardHeader className="flex flex-col gap-4 px-5 pb-4 pt-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            AI Financial Insights
          </CardTitle>
          <CardDescription className="max-w-xl text-sm">
            Generate concise, business-focused observations from your current
            revenue, expenses, and invoice activity.
          </CardDescription>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full shrink-0 sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Insights"
          )}
        </Button>
      </CardHeader>

      <CardContent className="space-y-5 px-5 pb-5 pt-0">
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-xl border border-red-200/80 bg-red-50/80 p-4 dark:border-red-900/50 dark:bg-red-950/40">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-300" />
              <div>
                <p className="text-sm font-semibold text-red-900 dark:text-red-100">
                  Unable to generate insights
                </p>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && hasGenerated && insights.length > 0 && (
          <div className="grid gap-3">
            {insights.map((insight, index) => (
              <div
                key={`${index}-${insight.slice(0, 24)}`}
                className="flex items-start gap-4 rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-950/40"
              >
                <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-600/10 text-violet-600 dark:text-violet-300">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <p className="text-sm leading-6 whitespace-pre-line">
                  {insight}
                </p>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && !hasGenerated && (
          <EmptyState
            icon={Sparkles}
            title="AI insights are ready when you are"
            description="Generate a compact summary of your revenue, expenses, and invoice activity."
          />
        )}

        {!isLoading && !error && hasGenerated && insights.length === 0 && (
          <EmptyState
            icon={Sparkles}
            title="No insights available yet"
            description="Add more expenses or invoices, then generate again for a stronger summary."
          />
        )}
      </CardContent>
    </Card>
  );
}
