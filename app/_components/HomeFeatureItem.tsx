import { cn } from "@/lib/utils";

export function FeatureItem({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="bg-muted/50 hover:border-border flex items-start gap-4 rounded-2xl border border-transparent p-4 transition-all">
      <div className={cn("bg-background border-border rounded-xl border p-2 shadow-sm", color)}>{icon}</div>
      <div>
        <h4 className="text-sm font-bold">{title}</h4>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
