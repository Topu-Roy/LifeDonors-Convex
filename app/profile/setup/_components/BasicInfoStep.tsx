"use client";

import { useAtom } from "jotai";
import { currentStepAtom, setupFormAtom } from "@/state/setup/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
} from "@/components/ui/field";
import { ArrowRight, User, Phone, MapPin } from "lucide-react";
import { bangladeshAdministrativeData } from "@/constants/bangladeshAdministrativeAreas";
import { useMemo } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";

const step1Schema = z.object({
  age: z.number().min(18, "Must be at least 18").max(65, "Must be under 65"),
  phoneNumber: z.string().min(11, "Valid phone number required"),
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  subDistrict: z.string().min(1, "Sub-district is required"),
});

export function BasicInfoStep() {
  const [formData, setFormData] = useAtom(setupFormAtom);
  const [, setCurrentStep] = useAtom(currentStepAtom);

  const form = useForm({
    defaultValues: {
      age: formData.age || 0,
      phoneNumber: formData.phoneNumber || "",
      division: formData.division || "",
      district: formData.district || "",
      subDistrict: formData.subDistrict || "",
    },
    validators: {
      onChange: step1Schema,
    },
    onSubmit: async ({ value }) => {
      setFormData((prev) => ({ ...prev, ...value }));
      setCurrentStep(2);
    },
  });

  const divisions = useMemo(() => {
    return bangladeshAdministrativeData.map((d) => d.division);
  }, []);

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
        {/* Age and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form.Field name="age">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !!field.state.meta.errors.length;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4 text-primary" />
                    Your Age
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    placeholder="e.g. 25"
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(parseInt(e.target.value) || 0)
                    }
                    className="h-14 rounded-2xl border-primary/10 bg-background shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary transition-all text-lg font-medium"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="phoneNumber">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !!field.state.meta.errors.length;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4 text-primary" />
                    Phone Number
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="tel"
                    placeholder="e.g. 017XXXXXXXX"
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="h-14 rounded-2xl border-primary/10 bg-background shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary transition-all text-lg font-medium"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>

        {/* Location Selectors */}
        <div className="space-y-6 pt-4">
          <h3 className="text-base font-bold flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Current Location
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <form.Field name="division">
              {(field) => (
                <Field>
                  <FieldLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                    Division
                  </FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) => {
                      field.handleChange(v as string);
                      form.setFieldValue("district", "");
                      form.setFieldValue("subDistrict", "");
                    }}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-primary/10 bg-background shadow-sm focus:ring-primary/20">
                      <SelectValue placeholder="Select Division" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-primary/10">
                      {divisions.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                </Field>
              )}
            </form.Field>

            <form.Subscribe selector={(state) => state.values.division}>
              {(division) => (
                <form.Field name="district">
                  {(field) => {
                    const districts = division
                      ? bangladeshAdministrativeData
                          .find((d) => d.division === division)
                          ?.districts.map((d) => d.district) || []
                      : [];
                    return (
                      <Field>
                        <FieldLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                          District
                        </FieldLabel>
                        <Select
                          value={field.state.value}
                          onValueChange={(v) => {
                            field.handleChange(v as string);
                            form.setFieldValue("subDistrict", "");
                          }}
                          disabled={!division}
                        >
                          <SelectTrigger className="h-12 rounded-xl border-primary/10 bg-background shadow-sm focus:ring-primary/20">
                            <SelectValue placeholder="Select District" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-primary/10">
                            {districts.map((d) => (
                              <SelectItem key={d} value={d}>
                                {d}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0 && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                      </Field>
                    );
                  }}
                </form.Field>
              )}
            </form.Subscribe>

            <form.Subscribe
              selector={(state) => [
                state.values.division,
                state.values.district,
              ]}
            >
              {([division, district]) => (
                <form.Field name="subDistrict">
                  {(field) => {
                    const subDistricts =
                      division && district
                        ? bangladeshAdministrativeData
                            .find((d) => d.division === division)
                            ?.districts.find((d) => d.district === district)
                            ?.subDistricts || []
                        : [];
                    return (
                      <Field>
                        <FieldLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                          Sub District
                        </FieldLabel>
                        <Select
                          value={field.state.value}
                          onValueChange={(v) => field.handleChange(v as string)}
                          disabled={!district}
                        >
                          <SelectTrigger className="h-12 rounded-xl border-primary/10 bg-background shadow-sm focus:ring-primary/20">
                            <SelectValue placeholder="Select Sub District" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-primary/10">
                            {subDistricts.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0 && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                      </Field>
                    );
                  }}
                </form.Field>
              )}
            </form.Subscribe>
          </div>
        </div>
      </FieldGroup>

      <div className="pt-8 border-t flex justify-end">
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
