"use client";

import { useAtom } from "jotai";
import { currentStepAtom, setupFormAtom } from "@/state/setup/store";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { ArrowRight, ArrowLeft, Activity, Ruler, Weight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { bloodTypes } from "../page";

const step2Schema = z.object({
  bloodType: z.enum(bloodTypes),
  weight: z.number().min(45, "Weight must be at least 45kg"),
  height: z.number().min(120, "Height must be at least 120cm"),
  hemoglobinLevel: z
    .number()
    .min(10, "Minimum 10 g/dL")
    .max(20, "Maximum 20 g/dL"),
});

export function HealthDetailsStep() {
  const [formData, setFormData] = useAtom(setupFormAtom);
  const [, setCurrentStep] = useAtom(currentStepAtom);

  const form = useForm({
    defaultValues: {
      bloodType: formData.bloodType || "A+",
      weight: formData.weight || 0,
      height: formData.height || 0,
      hemoglobinLevel: formData.hemoglobinLevel || 12.5,
    },
    validators: {
      onChange: step2Schema,
    },
    onSubmit: async ({ value }) => {
      setFormData((prev) => ({ ...prev, ...value }));
      setCurrentStep(3);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <FieldGroup>
        {/* Blood Type Grid */}
        <div className="space-y-4">
          <form.Field name="bloodType">
            {(field) => (
              <Field>
                <div className="flex items-center justify-between mb-2">
                  <FieldLabel className="text-base font-bold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Blood Type
                  </FieldLabel>
                  <span className="text-2xl font-black text-primary bg-primary/10 px-3 py-1 rounded-lg">
                    {field.state.value}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {bloodTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => field.handleChange(type)}
                      className={cn(
                        "h-14 rounded-2xl flex items-center justify-center text-lg font-black transition-all border-2",
                        field.state.value === type
                          ? "bg-primary border-primary text-white shadow-lg shadow-primary/25 scale-105"
                          : "bg-background border-primary/5 text-foreground hover:border-primary/20 hover:bg-primary/5",
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
              </Field>
            )}
          </form.Field>
        </div>

        {/* Weight and Height */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <form.Field name="weight">
            {(field) => (
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <Weight className="h-4 w-4 text-primary" />
                  Weight (kg)
                </FieldLabel>
                <div className="relative">
                  <input
                    type="number"
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(parseFloat(e.target.value) || 0)
                    }
                    className="w-full h-20 rounded-[1.5rem] border-2 border-primary/5 bg-primary/5 px-6 pt-8 pb-3 text-2xl font-black focus:outline-none focus:border-primary/20 transition-all"
                  />
                  <span className="absolute top-3 left-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Current Weight
                  </span>
                </div>
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
              </Field>
            )}
          </form.Field>

          <form.Field name="height">
            {(field) => (
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-primary" />
                  Height (cm)
                </FieldLabel>
                <div className="relative">
                  <input
                    type="number"
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(parseFloat(e.target.value) || 0)
                    }
                    className="w-full h-20 rounded-[1.5rem] border-2 border-primary/5 bg-primary/5 px-6 pt-8 pb-3 text-2xl font-black focus:outline-none focus:border-primary/20 transition-all"
                  />
                  <span className="absolute top-3 left-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Your Height
                  </span>
                </div>
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
              </Field>
            )}
          </form.Field>
        </div>

        {/* Hemoglobin Level Slider */}
        <div className="pt-6 space-y-6">
          <form.Field name="hemoglobinLevel">
            {(field) => (
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Hemoglobin Level (g/dL)
                  </FieldLabel>
                  <span className="text-2xl font-black text-foreground">
                    {field.state.value}
                  </span>
                </div>
                <Slider
                  value={[field.state.value]}
                  onValueChange={(v) => field.handleChange((v as number[])[0])}
                  min={10}
                  max={20}
                  step={0.1}
                  className="**:[[role=slider]]:h-6 **:[[role=slider]]:w-6 **:[[role=slider]]:border-4 **:[[role=slider]]:border-white **:[[role=slider]]:shadow-xl **:[[role=slider]]:shadow-primary/20"
                />
                <div className="flex justify-between mt-4">
                  <span className="text-xs font-bold text-muted-foreground">
                    Min Safe (12.5)
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">
                    Max (20.0)
                  </span>
                </div>
                <FieldDescription className="text-center pt-2">
                  If unknown, a typical healthy range is 12-16 g/dL.
                </FieldDescription>
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
              </Field>
            )}
          </form.Field>
        </div>
      </FieldGroup>

      <div className="pt-8 border-t flex justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep(1)}
          className="h-14 px-8 rounded-2xl font-bold border-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="h-14 px-10 rounded-2xl font-black shadow-xl shadow-primary/20 gap-2 transition-all hover:scale-105 active:scale-95"
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
