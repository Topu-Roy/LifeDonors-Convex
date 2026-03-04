"use client";

import { useAtom } from "jotai";
import { currentStepAtom, setupFormAtom } from "@/state/setup/store";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import {
  ArrowLeft,
  CheckCircle2,
  Heart,
  Calendar as CalendarIcon,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";

const healthConditions = [
  "Heart Disease or history of heart attack",
  "Diabetes (requiring insulin)",
  "Cancer (other than minor skin cancer)",
  "Hepatitis or Liver Disease",
  "HIV/AIDS",
];

const step3Schema = z.object({
  diseases: z.array(z.string()),
  lastDonationDate: z.number(),
});

export function EligibilityStep() {
  const [formData] = useAtom(setupFormAtom);
  const [, setCurrentStep] = useAtom(currentStepAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateProfile = useMutation(api.users.updateProfile);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      diseases: formData.diseases || [],
      lastDonationDate: formData.lastDonationDate || 0,
    },
    validators: {
      onChange: step3Schema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        // Aggregate all data from store + current step
        const finalData = {
          ...formData,
          ...value,
        };

        // BMI calculation: weight / (height/100)^2
        const heightInMeters = (finalData.height || 0) / 100;
        const bmi =
          heightInMeters > 0
            ? parseFloat(
                (
                  (finalData.weight || 0) /
                  (heightInMeters * heightInMeters)
                ).toFixed(1),
              )
            : 0;

        await updateProfile({
          age: finalData.age || 0,
          bmi: bmi,
          bloodType:
            (finalData.bloodType as
              | "A+"
              | "A-"
              | "B+"
              | "B-"
              | "AB+"
              | "AB-"
              | "O+"
              | "O-") || "A+",
          hemoglobinLevel: finalData.hemoglobinLevel || 12.5,
          phoneNumber: finalData.phoneNumber || "",
          diseases: finalData.diseases || [],
          lastDonationDate: finalData.lastDonationDate || 0,
          division: finalData.division || "",
          district: finalData.district || "",
          subDistrict: finalData.subDistrict || "",
        });

        toast.success("Profile setup complete!");
        router.push("/profile");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to save profile",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500"
    >
      <FieldGroup>
        {/* Health Conditions */}
        <section className="space-y-6">
          <form.Field name="diseases">
            {(field) => (
              <Field>
                <div>
                  <FieldLabel className="text-xl font-black tracking-tight flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Health Conditions
                  </FieldLabel>
                  <FieldDescription className="text-sm text-muted-foreground font-medium mt-1">
                    Please check any underlying health conditions you may have.
                  </FieldDescription>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  {healthConditions.map((condition) => (
                    <label
                      key={condition}
                      className="flex items-start gap-3 p-5 rounded-3xl border-2 border-primary/5 hover:border-primary/20 hover:bg-primary/5 transition-all cursor-pointer group"
                    >
                      <Checkbox
                        checked={field.state.value?.includes(condition)}
                        onCheckedChange={(checked) => {
                          const current = field.state.value || [];
                          if (checked) {
                            field.handleChange([...current, condition]);
                          } else {
                            field.handleChange(
                              current.filter((c: string) => c !== condition),
                            );
                          }
                        }}
                        className="mt-1 border-2 border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className="text-sm font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                        {condition}
                      </span>
                    </label>
                  ))}
                  <label className="flex items-start gap-3 p-5 rounded-3xl border-2 border-primary/5 hover:border-primary/20 hover:bg-primary/5 transition-all cursor-pointer group">
                    <Checkbox
                      checked={(field.state.value || []).length === 0}
                      onCheckedChange={(checked) => {
                        if (checked) field.handleChange([]);
                      }}
                      className="mt-1 border-2 border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className="text-sm font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                      None of the above
                    </span>
                  </label>
                </div>
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
              </Field>
            )}
          </form.Field>
        </section>

        {/* Last Donation Date */}
        <section className="space-y-6 pt-4">
          <form.Field name="lastDonationDate">
            {(field) => (
              <Field>
                <div>
                  <FieldLabel className="text-xl font-black tracking-tight flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    Donation History
                  </FieldLabel>
                  <FieldDescription className="text-sm text-muted-foreground font-medium mt-1">
                    When was your last blood donation? (Leave blank if never)
                  </FieldDescription>
                </div>

                <div className="max-w-md mt-4">
                  <Input
                    type="date"
                    value={
                      field.state.value
                        ? new Date(field.state.value)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value ? new Date(e.target.value).getTime() : 0,
                      )
                    }
                    className="h-14 rounded-3xl border-primary/10 bg-background shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary transition-all text-lg font-medium"
                  />
                </div>
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
              </Field>
            )}
          </form.Field>
        </section>

        {/* Initial Eligibility Status Preview */}
        <div className="bg-primary/5 border-2 border-primary/20 rounded-3xl p-8 flex items-start gap-5 shadow-sm mt-8">
          <div className="p-3 bg-primary/20 rounded-2xl text-primary shrink-0 shadow-lg shadow-primary/10">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-xl font-black text-foreground mb-1 tracking-tight">
              Initial Eligibility Review
            </h3>
            <p className="text-muted-foreground font-medium text-base leading-relaxed">
              Based on your responses,{" "}
              <strong>you&apos;re on the right path!</strong> Final eligibility
              will be confirmed during pre-donation health screening at the
              center.
            </p>
          </div>
        </div>
      </FieldGroup>

      <div className="pt-8 border-t flex justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep(2)}
          disabled={isSubmitting}
          className="h-14 px-8 rounded-3xl font-bold border-primary/10 bg-background shadow-sm hover:bg-primary/5 transition-all gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </Button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="h-14 px-10 flex-1 rounded-3xl font-black shadow-xl shadow-primary/20 gap-3 transition-all hover:scale-[1.02] active:scale-95 bg-primary text-white"
            >
              {isSubmitting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Complete Profile
                </>
              )}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
