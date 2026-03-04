"use client";

import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { BloodRequestForm } from "../_components/BloodRequestForm";

export default function CreateRequestPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f6f8f6] dark:bg-[#102216] py-12">
      <Container maxWidth="2xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="group mb-6 text-slate-500 hover:text-primary transition-colors p-0 h-auto"
            onClick={() => router.back()}
          >
            <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Explorer
          </Button>

          <div className="flex items-center gap-4 mb-2">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              Post a Blood Request
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
            Fill out the details below to find donors in your area.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-primary/10 shadow-sm">
          <BloodRequestForm
            onSuccess={() => router.push("/requests")}
            className="space-y-8"
          />
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-slate-400 font-medium">
            By posting a request, you agree to our terms of service and privacy
            policy. Your contact details will only be visible to potential
            donors.
          </p>
        </div>
      </Container>
    </div>
  );
}
