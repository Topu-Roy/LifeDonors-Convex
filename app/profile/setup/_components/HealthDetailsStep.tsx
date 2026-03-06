"use client";

import { useForm } from "@tanstack/react-form";
import { currentStepAtom, setupFormAtom } from "@/state/setup/store";
import { useAtom } from "jotai";
import { Activity, ArrowLeft, ArrowRight, Ruler, Weight } from "lucide-react";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

const step2Schema = z.object({
  bloodType: z.enum(bloodTypes),
  weight: z.number().min(45, "Weight must be at least 45kg"),
  height: z.number().min(120, "Height must be at least 120cm"),
  hemoglobinLevel: z.number().min(10, "Minimum 10 g/dL").max(20, "Maximum 20 g/dL"),
});

export function HealthDetailsStep() {
  const [formData, setFormData] = useAtom(setupFormAtom);
  const [, setCurrentStep] = useAtom(currentStepAtom);

  const form = useForm({
    defaultValues: {
      bloodType: formData.bloodType ?? "A+",
      weight: formData.weight ?? 0,
      height: formData.height ?? 0,
      hemoglobinLevel: formData.hemoglobinLevel ?? 12.5,
    },
    validators: {
      onChange: step2Schema,
    },
    onSubmit: async ({ value }) => {
      setFormData(prev => ({ ...prev, ...value }));
      setCurrentStep(3);
    },
  });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500"
    >
      <FieldGroup>
        {/* Blood Type Grid */}
        <div className="space-y-4">
          <form.Field name="bloodType">
            {field => (
              <Field>
                <div className="mb-2 flex items-center justify-between">
                  <FieldLabel className="flex items-center gap-2 text-base font-bold">
                    <Activity className="text-primary h-4 w-4" />
                    Blood Type
                  </FieldLabel>
                  <span className="text-primary bg-primary/10 rounded-xl px-3 py-1 text-2xl font-black">
                    {field.state.value}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {bloodTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => field.handleChange(type)}
                      className={cn(
                        "flex h-12 items-center justify-center rounded-3xl border-2 text-base font-black transition-all md:h-14 md:text-lg",
                        field.state.value === type
                          ? "bg-primary border-primary shadow-primary/25 scale-105 text-white shadow-lg"
                          : "bg-background border-primary/5 text-foreground hover:border-primary/20 hover:bg-primary/5"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            )}
          </form.Field>
        </div>

        {/* Weight and Height */}
        <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2">
          <form.Field name="weight">
            {field => (
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <Weight className="text-primary h-4 w-4" />
                  Weight (kg)
                </FieldLabel>
                <div className="relative">
                  <input
                    type="number"
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(parseFloat(e.target.value) || 0)}
                    className="border-primary/5 bg-primary/5 focus:border-primary/20 h-16 w-full rounded-3xl border-2 px-6 pt-6 pb-3 text-center text-xl font-black transition-all focus:outline-none md:h-20 md:pt-8 md:text-left md:text-2xl"
                  />
                  <span className="text-muted-foreground absolute top-3 left-6 text-[10px] font-black tracking-widest uppercase">
                    Current Weight
                  </span>
                </div>
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            )}
          </form.Field>

          <form.Field name="height">
            {field => (
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <Ruler className="text-primary h-4 w-4" />
                  Height (cm)
                </FieldLabel>
                <div className="relative">
                  <input
                    type="number"
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(parseFloat(e.target.value) || 0)}
                    className="border-primary/5 bg-primary/5 focus:border-primary/20 h-16 w-full rounded-3xl border-2 px-6 pt-6 pb-3 text-center text-xl font-black transition-all focus:outline-none md:h-20 md:pt-8 md:text-left md:text-2xl"
                  />
                  <span className="text-muted-foreground absolute top-3 left-6 text-[10px] font-black tracking-widest uppercase">
                    Your Height
                  </span>
                </div>
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            )}
          </form.Field>
        </div>

        {/* Hemoglobin Level Slider */}
        <div className="space-y-6 pt-6">
          <form.Field name="hemoglobinLevel">
            {field => (
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel className="flex items-center gap-2">
                    <Activity className="text-primary h-4 w-4" />
                    Hemoglobin Level (g/dL)
                  </FieldLabel>
                  <span className="text-foreground text-2xl font-black">{field.state.value}</span>
                </div>
                <Slider
                  value={[field.state.value]}
                  onValueChange={v => {
                    const val: number = Array.isArray(v) ? (v[0] as number) : (v as number);
                    field.handleChange(Math.round(val * 10) / 10);
                  }}
                  min={10}
                  max={20}
                  step={0.1}
                  className="**:[[role=slider]]:shadow-primary/20 **:[[role=slider]]:h-6 **:[[role=slider]]:w-6 **:[[role=slider]]:border-4 **:[[role=slider]]:border-white **:[[role=slider]]:shadow-xl"
                />
                <div className="mt-4 flex justify-between">
                  <span className="text-muted-foreground text-xs font-bold">Min Safe (12.5)</span>
                  <span className="text-muted-foreground text-xs font-bold">Max (20.0)</span>
                </div>
                <FieldDescription className="pt-2 text-center">
                  If unknown, a typical healthy range is 12-16 g/dL.
                </FieldDescription>
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            )}
          </form.Field>
        </div>
      </FieldGroup>

      <div className="flex flex-col-reverse justify-between gap-4 border-t pt-8 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep(1)}
          className="h-12 w-full rounded-3xl border-2 px-8 font-bold sm:w-auto md:h-14"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="shadow-primary/20 h-12 w-full gap-2 rounded-3xl px-10 font-black shadow-xl transition-all hover:scale-105 active:scale-95 sm:w-auto md:h-14"
            >
              Continue
              <ArrowRight className="h-5 w-5" />
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
