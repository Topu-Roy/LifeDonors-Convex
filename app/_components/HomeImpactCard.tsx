"use client";

import { cn } from "@/lib/utils";

export function ImpactCard({
  icon,
  label,
  value,
  color,
  bgColor,
  borderColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  bgColor: string;
  borderColor: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-2xl p-6 border transition-all hover:shadow-md",
        bgColor,
        borderColor,
      )}
    >
      <div className={cn("flex items-center gap-2", color)}>
        {icon}
        <p className="text-xs font-bold uppercase tracking-widest opacity-80">
          {label}
        </p>
      </div>
      <p className="text-4xl font-black tracking-tighter">{value}</p>
    </div>
  );
}
