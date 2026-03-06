"use client";

import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { currentStepAtom } from "@/state/setup/store";
import { useQuery } from "convex/react";
import { useAtom } from "jotai";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { type ProfileType } from "../../_components/ProfileView";
import { BasicInfoStep } from "./BasicInfoStep";
import { EligibilityStep } from "./EligibilityStep";
import { HealthDetailsStep } from "./HealthDetailsStep";

const steps = [
  { id: 1, title: "Basic Information", description: "Age, Phone & Location" },
  { id: 2, title: "Health Details", description: "Blood Type & Vitals" },
  { id: 3, title: "Eligibility", description: "Review & Complete" },
];

const isProfileComplete = (p: ProfileType) => {
  if (!p) return false;

  return (
    p.age !== undefined &&
    p.bmi !== undefined &&
    p.bloodType !== undefined &&
    p.hemoglobinLevel !== undefined &&
    p.phoneNumber !== undefined &&
    p.division !== undefined &&
    p.district !== undefined &&
    p.subDistrict !== undefined
  );
};

export function SetupWizard() {
  const profile = useQuery(api.users.getMyProfile);
  const router = useRouter();
  const [currentStep] = useAtom(currentStepAtom);

  useEffect(() => {
    if (profile !== undefined && isProfileComplete(profile)) {
      router.push("/profile");
    }
  }, [profile, router]);

  if (profile === undefined) {
    return (
      <div className="bg-muted/30 flex h-[80vh] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Header Info (Dynamic Part) */}
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <p className="text-muted-foreground ml-1 text-base font-medium md:text-lg">
          {steps[currentStep - 1].title}:{" "}
          <span className="hidden md:inline">{steps[currentStep - 1].description}</span>
        </p>

        <div className="flex items-center gap-3">
          <p className="text-muted-foreground text-sm font-black tracking-widest uppercase">
            Step {currentStep} of 3
          </p>
          <div className="bg-primary/10 border-primary/5 h-3 w-32 overflow-hidden rounded-full border">
            <div
              className="bg-primary h-full shadow-[0_0_10px_rgba(43,238,108,0.3)] transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Indicator (Visual) */}
      <div className="relative mb-10 flex justify-between px-2">
        <div className="bg-primary/5 absolute top-1/2 left-0 z-0 h-1 w-full -translate-y-1/2" />
        {steps.map(step => (
          <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300 md:size-10 md:border-4 md:text-sm",
                currentStep > step.id
                  ? "bg-primary border-primary/20 shadow-primary/20 text-white shadow-lg"
                  : currentStep === step.id
                    ? "bg-background border-primary text-primary scale-110 shadow-xl"
                    : "bg-background border-muted text-muted-foreground"
              )}
            >
              {currentStep > step.id ? <Check className="h-4 w-4 md:h-5 md:w-5" /> : step.id}
            </div>
            <span
              className={cn(
                "text-[8px] font-black tracking-widest uppercase md:text-[10px]",
                currentStep === step.id ? "text-primary" : "text-muted-foreground"
              )}
            >
              {step.title.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>

      {/* Form Container */}
      <div className="bg-background border-primary/5 shadow-primary/5 rounded-3xl border p-6 shadow-2xl md:p-12">
        {currentStep === 1 && <BasicInfoStep />}
        {currentStep === 2 && <HealthDetailsStep />}
        {currentStep === 3 && <EligibilityStep />}
      </div>
    </>
  );
}
