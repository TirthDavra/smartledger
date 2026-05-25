"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
        const message = data.error || "Failed to generate insights";
        setError(message);
        toast.error(message);
        return;
      }

      setInsights(data.insights ?? []);
      setHasGenerated(true);
    } catch (err) {
      console.error(err);
      const message = "Failed to generate insights";
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
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
            <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            AI Financial Insights
          </CardTitle>
          <CardDescription className="max-w-xl text-sm text-slate-500 dark:text-slate-400">
            Generate concise, business-focused observations from your current
            revenue, expenses, and invoice activity.
          </CardDescription>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          className="shrink-0"
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
              <div
                key={index}
                className="h-14 animate-pulse rounded-3xl bg-slate-200/80 dark:bg-slate-800/80"
              />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-3xl border border-red-200/80 bg-red-50/80 p-4 dark:border-red-900/50 dark:bg-red-950/40">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 text-red-600 dark:text-red-300" />
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
                className="group flex items-start gap-4 rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4 shadow-sm transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-950/40"
              >
                <span className="mt-1 grid h-10 w-10 place-items-center rounded-2xl bg-violet-600/10 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <p className="text-sm leading-6 whitespace-pre-line text-slate-900 dark:text-slate-100">
                  {insight}
                </p>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && !hasGenerated && (
          <div className="rounded-3xl border border-dashed border-slate-200/80 bg-slate-50/80 p-8 text-center dark:border-slate-800/80 dark:bg-slate-950/40">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              AI insights are ready when you are.
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Click the button to generate a compact summary of your current
              financial position.
            </p>
          </div>
        )}

        {!isLoading && !error && hasGenerated && insights.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200/80 bg-slate-50/80 p-8 text-center dark:border-slate-800/80 dark:bg-slate-950/40">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              No insights available yet.
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Add more expenses or invoices and try again to get a stronger AI
              summary.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
