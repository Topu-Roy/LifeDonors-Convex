import { Container } from "@/components/Container";
import { RequestsExplorer } from "./_components/RequestsExplorer";
import { Suspense } from "react";

export default function RequestsPage() {
  return (
    <div className="min-h-screen bg-[#f6f8f6] dark:bg-[#102216]">
      <Container className="py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              Blood Requests Explorer
            </h1>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Find and respond to urgent blood needs in your area.
            </p>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="h-screen w-full animate-pulse bg-muted/50 rounded-[3rem]" />
          }
        >
          <RequestsExplorer />
        </Suspense>
      </Container>
    </div>
  );
}
