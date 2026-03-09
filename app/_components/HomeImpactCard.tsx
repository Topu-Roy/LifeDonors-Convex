"use client";

import { cn } from "@/lib/utils";

type Props = {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  bgColor: string;
  borderColor: string;
};

export function ImpactCard({ icon, label, value, color, bgColor, borderColor }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-2xl border p-6 transition-all hover:shadow-md",
        bgColor,
        borderColor
      )}
    >
      <div className={cn("flex items-center gap-2", color)}>
        {icon}
        <p className="text-xs font-bold tracking-widest uppercase opacity-80">{label}</p>
      </div>
      <p className="text-4xl font-black tracking-tighter">{value}</p>
    </div>
  );
}
