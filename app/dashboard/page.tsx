import { Suspense } from "react";
import { DashboardTabs } from "@/app/dashboard/_components/dashboardTabs";
import { LayoutDashboard } from "lucide-react";
import { Container } from "@/components/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | LifeDonors",
  description: "Monitor your blood donation requests and commitments in one place.",
};

export default function DashboardPage() {
  return (
    <div className="bg-muted/30 flex min-h-screen flex-col">
      <Container className="space-y-8 py-12">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight md:text-4xl">
            <div className="bg-primary/10 shrink-0 rounded-xl p-2">
              <LayoutDashboard className="text-primary h-6 w-6 md:h-8 md:w-8" />
            </div>
            <span>Dashboard Overview</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed font-medium md:text-lg">
            Manage your blood donation requests and commitments in one place.
          </p>
        </div>

        <Suspense fallback={<div className="bg-muted/50 h-96 w-full animate-pulse rounded-3xl" />}>
          <DashboardTabs />
        </Suspense>
      </Container>
    </div>
  );
}
