"use client";

import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
  Activity,
  AlertTriangle,
  Database,
  History,
  Loader2,
  MessageSquarePlus,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Container } from "@/components/Container";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AdminStats {
  totalProfiles: number;
  totalRequests: number;
  totalDonations: number;
  openRequests: number;
  completedRequests: number;
}

export default function AdminPage() {
  const stats = useQuery(api.admin.getStats) as unknown as AdminStats | undefined;
  const profile = useQuery(api.users.getMyProfile);
  const seedDatabase = useMutation(api.seed.seedDatabase);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    if (!confirm("Are you sure you want to seed the database? This can only be done when the database is empty."))
      return;
    setIsSeeding(true);
    try {
      const result = await seedDatabase();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to seed database");
    } finally {
      setIsSeeding(false);
    }
  };

  if (profile === undefined || stats === undefined) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (profile?.role !== "admin") {
    return (
      <Container className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
        <AlertTriangle className="h-16 w-16 text-amber-500" />
        <h1 className="text-3xl font-black tracking-tight">Access Denied</h1>
        <p className="text-muted-foreground max-w-md font-medium">
          You do not have the necessary permissions to access the administrative dashboard.
        </p>
        <Link href="/" className={cn(buttonVariants({ variant: "default" }), "mt-4 rounded-2xl px-8 font-bold")}>
          Return Home
        </Link>
      </Container>
    );
  }

  return (
    <Container as="main" className="flex flex-1 flex-col gap-8 py-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 rounded-2xl p-2 shadow-sm">
            <ShieldCheck className="text-primary h-6 w-6" />
          </div>
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">Admin Dashboard</h1>
        </div>
        <p className="text-muted-foreground font-medium">
          Manage system data, monitor activity, and perform administrative tasks.
        </p>
      </div>

      {/* Stats Grid */}
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

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: Detailed Stats */}
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

        {/* Right: Actions */}
        <Card className="border-primary/10 bg-primary/5 flex flex-col gap-6 rounded-3xl p-8 shadow-xl">
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-xl font-black tracking-tight">
              <ShieldCheck className="text-primary h-5 w-5" />
              Administrative Tools
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed font-medium">
              Critical system operations. These actions directly modify production data.
            </p>
          </div>

          <div className="mt-auto space-y-4">
            <div className="border-primary/20 bg-background/50 rounded-2xl border border-dashed p-4">
              <p className="text-primary mb-2 text-xs font-bold tracking-wider uppercase">Data Seeding</p>
              <p className="text-muted-foreground mb-4 text-[10px] font-medium">
                Populate the database with demo entries from the asset library. This is only possible if the
                database is currently empty.
              </p>
              <Button
                onClick={handleSeed}
                disabled={isSeeding}
                className="shadow-primary/20 h-12 w-full gap-2 rounded-2xl font-bold shadow-lg"
              >
                {isSeeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
                Seed Database
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Container>
  );
}

function StatCard({
  icon,
  label,
  value,
  trend,
  color,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  trend: string;
  color: string;
  bgColor: string;
}) {
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

function ProgressIndicator({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
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
