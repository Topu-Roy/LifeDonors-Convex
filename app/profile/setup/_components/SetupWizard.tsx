"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, Check } from "lucide-react";
import { useAtom } from "jotai";
import { currentStepAtom } from "@/state/setup/store";
import { BasicInfoStep } from "./BasicInfoStep";
import { HealthDetailsStep } from "./HealthDetailsStep";
import { EligibilityStep } from "./EligibilityStep";
import { cn } from "@/lib/utils";
import { type ProfileType } from "../../_components/ProfileView";

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
      <div className="flex h-[80vh] items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {/* Header Info (Dynamic Part) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <p className="text-muted-foreground font-medium text-base md:text-lg ml-1">
          {steps[currentStep - 1].title}:{" "}
          <span className="md:inline hidden">
            {steps[currentStep - 1].description}
          </span>
        </p>

        <div className="flex items-center gap-3">
          <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">
            Step {currentStep} of 3
          </p>
          <div className="w-32 h-3 bg-primary/10 rounded-full overflow-hidden border border-primary/5">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out shadow-[0_0_10px_rgba(43,238,108,0.3)]"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Indicator (Visual) */}
      <div className="flex justify-between relative px-2 mb-10">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-primary/5 -translate-y-1/2 z-0" />
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex flex-col items-center gap-3 z-10 relative"
          >
            <div
              className={cn(
                "size-8 md:size-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all duration-300 border-2 md:border-4",
                currentStep > step.id
                  ? "bg-primary border-primary/20 text-white shadow-lg shadow-primary/20"
                  : currentStep === step.id
                    ? "bg-background border-primary text-primary shadow-xl scale-110"
                    : "bg-background border-muted text-muted-foreground",
              )}
            >
              {currentStep > step.id ? (
                <Check className="h-4 w-4 md:h-5 md:w-5" />
              ) : (
                step.id
              )}
            </div>
            <span
              className={cn(
                "text-[8px] md:text-[10px] font-black uppercase tracking-widest",
                currentStep === step.id
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              {step.title.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>

      {/* Form Container */}
      <div className="bg-background border border-primary/5 rounded-3xl p-6 md:p-12 shadow-2xl shadow-primary/5">
        {currentStep === 1 && <BasicInfoStep />}
        {currentStep === 2 && <HealthDetailsStep />}
        {currentStep === 3 && <EligibilityStep />}
      </div>
    </>
  );
}
