import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

type Props = {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  trend: string;
  color: string;
  bgColor: string;
};

export function StatCard({ icon, label, value, trend, color, bgColor }: Props) {
  return (
    <Card className="border-primary/10 group relative flex flex-col gap-2 overflow-hidden rounded-3xl border p-6 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md">
      <div className="pointer-events-none absolute -right-4 -bottom-4 opacity-[0.03] transition-opacity group-hover:opacity-[0.08]">
        <div className="h-24 w-24">{icon}</div>
      </div>
      <p className="text-muted-foreground relative z-10 flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
        <span className={cn(color)}>{icon}</span>
        {label}
      </p>
      <div className="relative z-10 mt-2 flex items-center justify-between">
        <p className={cn("text-3xl font-black tracking-tight")}>{value}</p>
        <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", bgColor, color)}>{trend}</span>
      </div>
    </Card>
  );
}
