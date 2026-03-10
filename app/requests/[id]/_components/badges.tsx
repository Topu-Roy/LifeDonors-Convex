import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Props = {
  urgency: "Low" | "Medium" | "High" | "Critical";
  isSeed: boolean | undefined;
  status: "Accepted" | "Completed" | "Cancelled" | "Open";
};

const urgencyBadgeStyles = {
  Low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  Medium: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
  High: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
  Critical: "bg-red-600 text-white animate-pulse",
};

export function Badges({ isSeed, status, urgency }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge
        className={cn(
          "rounded-full border-none px-3 py-4 text-xs font-black tracking-widest uppercase sm:px-4 sm:text-[10px]",
          urgencyBadgeStyles[urgency]
        )}
      >
        <span className="xs:inline hidden">{urgency} Priority</span>
        <span className="xs:inline">{urgency}</span>
      </Badge>
      <Badge
        variant={status === "Completed" ? "default" : "outline"}
        className={cn(
          "ppx-3 rounded-full py-4 text-xs font-black tracking-widest uppercase sm:px-4 sm:text-[10px]",
          status === "Completed" && "border-none bg-green-500 text-white hover:bg-green-600",
          status === "Cancelled" && "border-none bg-slate-200 text-slate-500 dark:bg-slate-800",
          status === "Open" && "border-primary/20 text-primary"
        )}
      >
        {status}
      </Badge>
      {isSeed && (
        <Badge className="rounded-full border-none bg-blue-100 px-3 py-4 text-xs font-black tracking-widest text-blue-600 uppercase sm:px-4 sm:text-[10px] dark:bg-blue-900/40 dark:text-blue-300">
          Demo Data
        </Badge>
      )}
    </div>
  );
}
