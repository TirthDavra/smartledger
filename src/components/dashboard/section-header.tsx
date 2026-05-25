interface SectionHeaderProps {
  title: string;
  description: string;
}

export default function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{title}</p>
          <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400">{description}</p>
        </div>
      </div>
    </div>
  );
}
