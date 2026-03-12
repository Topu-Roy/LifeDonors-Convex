import { Suspense } from "react";
import { RequestsExplorer } from "@/app/requests/_components/RequestsExplorer";
import { Container } from "@/components/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blood Requests Explorer",
  description: "Find blood requests in your area and help those in need.",
};

export default function RequestsPage() {
  return (
    <div className="min-h-screen bg-[#f6f8f6] dark:bg-[#102216]">
      <Container className="py-8">
        {/* Header Section */}
        <div className="relative mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl dark:text-slate-100">
              Blood Requests Explorer
            </h1>
            <p className="text-sm leading-relaxed font-medium text-slate-500 md:text-base dark:text-slate-400">
              Find and respond to urgent blood needs in your area.
            </p>
          </div>
        </div>

        <Suspense fallback={<div className="bg-muted/50 h-screen w-full animate-pulse rounded-[3rem]" />}>
          <RequestsExplorer />
        </Suspense>
      </Container>
    </div>
  );
}
