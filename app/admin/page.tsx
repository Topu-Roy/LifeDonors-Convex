import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Card } from "@/components/ui/card";
import { AdminGuard } from "./_components/AdminGuard";
import { DeleteSeedData } from "./_components/deleteSeedData";
import { SeedDatabase } from "./_components/seedDatabase";
import { DetailedStats, StatsGrid } from "./_components/stats";

export const metadata: Metadata = {
  title: "Admin Dashboard | LifeDonors",
  description: "Administrative tools for managing LifeDonors platform data.",
};

export default function AdminPage() {
  return (
    <AdminGuard>
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
        <StatsGrid />

        {/* Main Content Area */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left: Detailed Stats */}
          <DetailedStats />

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

            <SeedDatabase />
            <DeleteSeedData />
          </Card>
        </div>
      </Container>
    </AdminGuard>
  );
}
