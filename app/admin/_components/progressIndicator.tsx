import { cn } from "@/lib/utils";

type Props = {
  label: string;
  count: number;
  total: number;
  color: string;
};

export function ProgressIndicator({ label, count, total, color }: Props) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-bold">
        <span>{label}</span>
        <span className="text-muted-foreground">{count}</span>
      </div>
      <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
        <div className={cn("h-full transition-all duration-500", color)} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
