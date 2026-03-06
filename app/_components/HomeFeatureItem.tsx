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
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/50 border border-transparent hover:border-border transition-all">
      <div
        className={cn(
          "p-2 rounded-xl bg-background shadow-sm border border-border",
          color,
        )}
      >
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
