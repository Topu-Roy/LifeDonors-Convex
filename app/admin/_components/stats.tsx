"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Activity, History, MessageSquarePlus, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ProgressIndicator } from "./progressIndicator";
import { StatCard } from "./statsCard";

export function StatsGrid() {
  const stats = useQuery(api.admin.getStats);

  if (stats === undefined) {
    return (
      <section className="grid grid-cols-1 items-center gap-6">
        <Spinner />
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={<Users className="h-6 w-6" />}
        label="Total Users"
        value={stats.totalProfiles}
        trend="+5%"
        color="text-blue-500"
        bgColor="bg-blue-500/5"
      />
      <StatCard
        icon={<MessageSquarePlus className="h-6 w-6" />}
        label="Total Requests"
        value={stats.totalRequests}
        trend="+12%"
        color="text-primary"
        bgColor="bg-primary/5"
      />
      <StatCard
        icon={<History className="h-6 w-6" />}
        label="Total Donations"
        value={stats.totalDonations}
        trend="+3%"
        color="text-emerald-500"
        bgColor="bg-emerald-500/5"
      />
      <StatCard
        icon={<Activity className="h-6 w-6" />}
        label="Conversion Rate"
        value={`${Math.round((stats.completedRequests / stats.totalRequests) * 100 || 0)}%`}
        trend="+2%"
        color="text-amber-500"
        bgColor="bg-amber-500/5"
      />
    </section>
  );
}

export function DetailedStats() {
  const stats = useQuery(api.admin.getStats);

  if (stats === undefined) {
    return (
      <section className="grid grid-cols-1 items-center gap-6">
        <Spinner />
      </section>
    );
  }

  return (
    <Card className="border-primary/10 relative overflow-hidden rounded-3xl p-8 shadow-xl lg:col-span-2">
      <div className="pointer-events-none absolute top-0 right-0 p-8 opacity-[0.03]">
        <TrendingUp className="text-primary h-48 w-48" />
      </div>

      <div className="relative z-10 space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-xl font-black tracking-tight">
            <Activity className="text-primary h-5 w-5" />
            Operational Overview
          </h3>
          <Badge
            variant="outline"
            className="bg-primary/5 text-primary border-primary/10 rounded-full px-3 py-1 font-bold"
          >
            System Healthy
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
              Request Status Distribution
            </p>
            <div className="space-y-3">
              <ProgressIndicator
                label="Open Requests"
                count={stats.openRequests}
                total={stats.totalRequests}
                color="bg-primary"
              />
              <ProgressIndicator
                label="Completed Requests"
                count={stats.completedRequests}
                total={stats.totalRequests}
                color="bg-emerald-500"
              />
              <ProgressIndicator
                label="Other Statuses"
                count={stats.totalRequests - stats.openRequests - stats.completedRequests}
                total={stats.totalRequests}
                color="bg-muted"
              />
            </div>
          </div>

          <div className="bg-muted/30 flex flex-col justify-center gap-2 rounded-3xl border border-dashed p-6">
            <p className="text-foreground text-sm font-bold">System Maintenance</p>
            <p className="text-muted-foreground text-xs leading-relaxed font-medium">
              Regularly monitoring these metrics helps ensure the donor-seeker matching efficiency remains high
              across all divisions.
            </p>
            <div className="bg-primary/20 mt-2 h-1 w-full overflow-hidden rounded-full">
              <div className="bg-primary h-full w-[75%] animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
