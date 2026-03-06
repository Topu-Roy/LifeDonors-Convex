"use client";

import { useMemo } from "react";
import { useForm } from "@tanstack/react-form";
import { bangladeshAdministrativeData } from "@/constants/bangladeshAdministrativeAreas";
import { currentStepAtom, setupFormAtom } from "@/state/setup/store";
import { useAtom } from "jotai";
import { ArrowRight, MapPin, Phone, User } from "lucide-react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      age: formData.age ?? 0,
      phoneNumber: formData.phoneNumber ?? "",
      division: formData.division ?? "",
      district: formData.district ?? "",
      subDistrict: formData.subDistrict ?? "",
    },
    validators: {
      onChange: step1Schema,
    },
    onSubmit: async ({ value }) => {
      setFormData(prev => ({ ...prev, ...value }));
      setCurrentStep(2);
    },
  });

  const divisions = useMemo(() => {
    return bangladeshAdministrativeData.map(d => d.division);
  }, []);

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
        {/* Age and Phone */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <form.Field name="age">
            {field => {
              const isInvalid = field.state.meta.isTouched && !!field.state.meta.errors.length;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name} className="flex items-center gap-2">
                    <User className="text-primary h-4 w-4" />
                    Your Age
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    placeholder="e.g. 25"
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(parseInt(e.target.value) || 0)}
                    className="border-primary/10 bg-background focus-visible:ring-primary/20 focus-visible:border-primary h-12 rounded-3xl text-base font-medium shadow-sm transition-all md:h-14 md:text-lg"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="phoneNumber">
            {field => {
              const isInvalid = field.state.meta.isTouched && !!field.state.meta.errors.length;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name} className="flex items-center gap-2">
                    <Phone className="text-primary h-4 w-4" />
                    Phone Number
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="tel"
                    placeholder="e.g. 017XXXXXXXX"
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    className="border-primary/10 bg-background focus-visible:ring-primary/20 focus-visible:border-primary h-12 rounded-3xl text-base font-medium shadow-sm transition-all md:h-14 md:text-lg"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>

        {/* Location Selectors */}
        <div className="space-y-6 pt-4">
          <h3 className="flex items-center gap-2 text-base font-bold">
            <MapPin className="text-primary h-4 w-4" />
            Current Location
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <form.Field name="division">
              {field => (
                <Field>
                  <FieldLabel className="text-muted-foreground ml-1 text-xs font-bold tracking-wider uppercase">
                    Division
                  </FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={v => {
                      field.handleChange(v!);
                      form.setFieldValue("district", "");
                      form.setFieldValue("subDistrict", "");
                    }}
                  >
                    <SelectTrigger className="border-primary/10 bg-background focus:ring-primary/20 h-11 rounded-2xl text-sm shadow-sm md:h-12 md:text-base">
                      <SelectValue placeholder="Select Division" />
                    </SelectTrigger>
                    <SelectContent className="border-primary/10 rounded-2xl">
                      {divisions.map(d => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              )}
            </form.Field>

            <form.Subscribe selector={state => state.values.division}>
              {division => (
                <form.Field name="district">
                  {field => {
                    const districts = division
                      ? (bangladeshAdministrativeData
                          .find(d => d.division === division)
                          ?.districts.map(d => d.district) ?? [])
                      : [];
                    return (
                      <Field>
                        <FieldLabel className="text-muted-foreground ml-1 text-xs font-bold tracking-wider uppercase">
                          District
                        </FieldLabel>
                        <Select
                          value={field.state.value}
                          onValueChange={v => {
                            field.handleChange(v!);
                            form.setFieldValue("subDistrict", "");
                          }}
                          disabled={!division}
                        >
                          <SelectTrigger className="border-primary/10 bg-background focus:ring-primary/20 h-11 rounded-2xl text-sm shadow-sm md:h-12 md:text-base">
                            <SelectValue placeholder="Select District" />
                          </SelectTrigger>
                          <SelectContent className="border-primary/10 rounded-2xl">
                            {districts.map(d => (
                              <SelectItem key={d} value={d}>
                                {d}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              )}
            </form.Subscribe>

            <form.Subscribe selector={state => [state.values.division, state.values.district]}>
              {([division, district]) => (
                <form.Field name="subDistrict">
                  {field => {
                    const subDistricts =
                      division && district
                        ? (bangladeshAdministrativeData
                            .find(d => d.division === division)
                            ?.districts.find(d => d.district === district)?.subDistricts ?? [])
                        : [];
                    return (
                      <Field>
                        <FieldLabel className="text-muted-foreground ml-1 text-xs font-bold tracking-wider uppercase">
                          Sub District
                        </FieldLabel>
                        <Select
                          value={field.state.value}
                          onValueChange={v => field.handleChange(v!)}
                          disabled={!district}
                        >
                          <SelectTrigger className="border-primary/10 bg-background focus:ring-primary/20 h-11 rounded-2xl text-sm shadow-sm md:h-12 md:text-base">
                            <SelectValue placeholder="Select Sub District" />
                          </SelectTrigger>
                          <SelectContent className="border-primary/10 rounded-2xl">
                            {subDistricts.map(s => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
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

      <div className="flex justify-end border-t pt-8">
        <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="shadow-primary/20 h-12 w-full gap-2 rounded-3xl px-10 font-black shadow-xl transition-all hover:scale-105 active:scale-95 md:h-14 md:w-auto"
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
