import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
}

export function TableSkeleton({ rows = 5 }: TableSkeletonProps) {
  return (
    <Card className="border border-slate-200/70 bg-white/80 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/60">
      <div className="space-y-0 p-2">
        <div className="flex gap-4 border-b border-slate-200/70 px-4 py-3 dark:border-slate-800/70">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, row) => (
          <div
            key={row}
            className="flex gap-4 border-b border-slate-200/50 px-4 py-4 last:border-0 dark:border-slate-800/50"
          >
            {Array.from({ length: 4 }).map((_, col) => (
              <Skeleton key={col} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}
