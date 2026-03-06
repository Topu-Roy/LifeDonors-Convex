"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import {
  getAllDivisions,
  getDistrictsByDivision,
  getSubDistrictsByDistrict,
} from "@/constants/bangladeshAdministrativeAreas";
import { type ProfileType } from "../page";

export const bloodTypes = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

const formSchema = z.object({
  age: z.number().min(18, "Must be at least 18").max(65, "Must be under 65"),
  bmi: z.number().min(18.5, "BMI too low").max(30, "BMI too high"),
  bloodType: z.enum(bloodTypes),
  hemoglobinLevel: z
    .number()
    .min(12.5, "Hemoglobin too low")
    .max(18, "Hemoglobin too high"),
  phoneNumber: z.string().min(10, "Valid phone number required"),
  diseases: z.string(),
  lastDonationDate: z.string(),
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  subDistrict: z.string().min(1, "Sub-district is required"),
});

export function ProfileForm({
  profile,
  onSuccess,
}: {
  profile?: ProfileType;
  onSuccess: () => void;
}) {
  const updateProfile = useMutation(api.users.updateProfile);

  const form = useForm({
    defaultValues: {
      age: profile?.age ?? 0,
      bmi: profile?.bmi ?? 0,
      bloodType: profile?.bloodType ?? "A+",
      hemoglobinLevel: profile?.hemoglobinLevel ?? 0,
      phoneNumber: profile?.phoneNumber ?? "",
      diseases: profile?.diseases?.join(", ") ?? "",
      lastDonationDate: profile?.lastDonationDate
        ? new Date(profile.lastDonationDate).toISOString().split("T")[0]
        : "",
      division: profile?.division ?? "",
      district: profile?.district ?? "",
      subDistrict: profile?.subDistrict ?? "",
    } satisfies z.infer<typeof formSchema>,
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateProfile({
          ...value,
          diseases: value.diseases
            ? value.diseases
                .split(",")
                .map((d) => d.trim())
                .filter(Boolean)
            : [],
          lastDonationDate: value.lastDonationDate
            ? new Date(value.lastDonationDate).getTime()
            : 0,
        });
        toast.success("Profile updated successfully!");
        onSuccess();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to update profile");
        }
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="space-y-6 pt-4"
    >
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <form.Field name="age">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !!field.state.meta.errors.length;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Age</FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      field.handleChange(Number(e.target.value))
                    }
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="bloodType">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !!field.state.meta.errors.length;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Blood Type</FieldLabel>
                  <Select
                    onValueChange={(val) => {
                      if (val) field.handleChange(val);
                    }}
                    value={field.state.value}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <form.Field name="bmi">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !!field.state.meta.errors.length;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>BMI</FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    step="0.1"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      field.handleChange(Number(e.target.value))
                    }
                  />
                  <FieldDescription className="text-[10px]">
                    Weight(kg) / Height(m)²
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="hemoglobinLevel">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !!field.state.meta.errors.length;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Hemoglobin (g/dL)
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    step="0.1"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      field.handleChange(Number(e.target.value))
                    }
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>

        <form.Field name="phoneNumber">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !!field.state.meta.errors.length;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                <Input
                  id={field.name}
                  placeholder="Your primary phone number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(e.target.value)
                  }
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="lastDonationDate">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !!field.state.meta.errors.length;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Last Donation Date</FieldLabel>
                <Input
                  id={field.name}
                  type="date"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(e.target.value)
                  }
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <div className="space-y-4 border-y py-4 my-2">
          <h4 className="text-sm font-semibold text-foreground">
            Preferred Donation Location
          </h4>
          <div className="grid grid-cols-1 gap-4">
            <form.Field name="division">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched &&
                  !!field.state.meta.errors.length;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Division</FieldLabel>
                    <Select
                      onValueChange={(val) => {
                        field.handleChange(val ?? "");
                        form.setFieldValue("district", "");
                        form.setFieldValue("subDistrict", "");
                      }}
                      value={field.state.value}
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue placeholder="Select division" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAllDivisions().map((div) => (
                          <SelectItem key={div} value={div}>
                            {div}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <div className="grid grid-cols-2 gap-4">
              <form.Subscribe selector={(state) => state.values.division}>
                {(division) => (
                  <form.Field name="district">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched &&
                        !!field.state.meta.errors.length;
                      const districts = division
                        ? getDistrictsByDivision({ division })
                        : [];
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>District</FieldLabel>
                          <Select
                            disabled={!division}
                            onValueChange={(val) => {
                              field.handleChange(val ?? "");
                              form.setFieldValue("subDistrict", "");
                            }}
                            value={field.state.value}
                          >
                            <SelectTrigger id={field.name}>
                              <SelectValue placeholder="District" />
                            </SelectTrigger>
                            <SelectContent>
                              {districts.map((dist) => (
                                <SelectItem key={dist} value={dist}>
                                  {dist}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isInvalid && (
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
                      const isInvalid =
                        field.state.meta.isTouched &&
                        !!field.state.meta.errors.length;
                      const subDistricts =
                        division && district
                          ? getSubDistrictsByDistrict({
                              division,
                              district,
                            })
                          : [];
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Sub-District
                          </FieldLabel>
                          <Select
                            disabled={!district}
                            onValueChange={(val) =>
                              field.handleChange(val ?? "")
                            }
                            value={field.state.value}
                          >
                            <SelectTrigger id={field.name}>
                              <SelectValue placeholder="Town/Area" />
                            </SelectTrigger>
                            <SelectContent>
                              {subDistricts.map((sub) => (
                                <SelectItem key={sub} value={sub}>
                                  {sub}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isInvalid && (
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
        </div>

        <form.Field name="diseases">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !!field.state.meta.errors.length;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Pre-existing Conditions
                </FieldLabel>
                <Input
                  id={field.name}
                  placeholder="e.g., Diabetes, Hypertension (comma separated)"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(e.target.value)
                  }
                />
                <FieldDescription>
                  Leave empty if none. Use commas to separate multiple.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <div className="bg-muted/50 p-4 rounded-lg flex items-start gap-3 border border-border">
        <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your data is private and only used to ensure safe donation practices.
        </p>
      </div>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {(state) => {
          const [canSubmit, isSubmitting] = state;
          return (
            <Button
              type="submit"
              disabled={!canSubmit}
              className="w-full font-bold"
            >
              {isSubmitting ? "Saving..." : "Save Profile Updates"}
            </Button>
          );
        }}
      </form.Subscribe>
    </form>
  );
}
