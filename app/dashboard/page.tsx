import { LayoutDashboard } from "lucide-react";
import { Container } from "@/components/Container";
import { DashboardTabs } from "./_components/DashboardTabs";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <Container className="py-12 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 shrink-0">
              <LayoutDashboard className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            </div>
            <span>Dashboard Overview</span>
          </h1>
          <p className="text-muted-foreground font-medium text-base md:text-lg leading-relaxed">
            Manage your blood donation requests and commitments in one place.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="h-96 w-full animate-pulse bg-muted/50 rounded-3xl" />
          }
        >
          <DashboardTabs />
        </Suspense>
      </Container>
    </div>
  );
}
