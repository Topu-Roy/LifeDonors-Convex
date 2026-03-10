"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Activity, Calendar, Droplet, Scale, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

export function MetricGrid() {
  const profile = useQuery(api.users.getMyProfile);

  if (!profile) return <Spinner />;

  return (
    <>
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-black tracking-tight">
        <Activity className="text-primary h-6 w-6" />
        Donor Health Metrics
      </h2>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        <MetricCard
          icon={<Droplet className="h-5 w-5" />}
          label="Blood Type"
          value={profile.bloodType ?? "--"}
          color="text-primary"
          bgColor="bg-primary/5"
        />
        <MetricCard icon={<Calendar className="h-5 w-5" />} label="Age" value={`${profile.age} yrs`} />
        <MetricCard icon={<Scale className="h-5 w-5" />} label="BMI Index" value={String(profile.bmi)} />
        <MetricCard
          icon={<Waves className="h-5 w-5" />}
          label="Hemoglobin"
          value={`${profile.hemoglobinLevel}`}
          unit="g/dL"
        />
      </div>
    </>
  );
}

type Props = {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  color?: string;
  bgColor?: string;
};

function MetricCard({ icon, label, value, unit, color = "text-foreground", bgColor = "bg-background" }: Props) {
  return (
    <div
      className={cn(
        "border-primary/10 group relative flex flex-col gap-2 overflow-hidden rounded-3xl border p-6 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md",
        bgColor
      )}
    >
      <div className="pointer-events-none absolute -right-4 -bottom-4 opacity-[0.03] transition-opacity group-hover:opacity-[0.08]">
        <div className="h-24 w-24">{icon}</div>
      </div>
      <p className="text-muted-foreground relative z-10 flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
        <span className={cn(color)}>{icon}</span>
        {label}
      </p>
      <div className="relative z-10 flex items-end gap-1">
        <p className={cn("text-3xl font-black tracking-tight", color)}>{value}</p>
        {unit && (
          <span className="text-muted-foreground mb-1.5 text-xs font-bold tracking-wider uppercase">{unit}</span>
        )}
      </div>
    </div>
  );
}
