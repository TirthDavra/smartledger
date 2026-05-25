import { type LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  iconClassName?: string;
}

export default function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName = "text-primary bg-primary/10",
}: StatsCardProps) {
  return (
    <Card className="border border-slate-200/70 bg-white/80 shadow-sm transition hover:shadow-md dark:border-slate-800/70 dark:bg-slate-950/60">
      <CardHeader className="flex items-start justify-between gap-4 px-5 pb-4 pt-5">
        <div>
          <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</CardTitle>
          <CardDescription className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {description}
          </CardDescription>
        </div>
        <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${iconClassName}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-0">
        <div className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{value}</div>
      </CardContent>
    </Card>
  );
}
