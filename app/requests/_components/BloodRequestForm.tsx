"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllDivisions,
  getDistrictsByDivision,
  getSubDistrictsByDistrict,
} from "@/constants/bangladeshAdministrativeAreas";
import { api } from "@/convex/_generated/api";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import z from "zod";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
const urgencies = ["Low", "Medium", "High", "Critical"] as const;

export const formSchema = z.object({
  patientName: z.string().min(2, "Name is too short"),
  bloodTypeNeeded: z.enum(bloodTypes),
  hospitalName: z.string().min(2, "Hospital name is required"),
  hospitalLocation: z.string().min(2, "Hospital location is required"),
  urgency: z.enum(urgencies),
  phoneNumber: z.string().min(10, "Phone number is required"),
  contactNumber: z.string().min(10, "Contact number is required"),
  numberOfBags: z.number().min(1, "At least 1 bag is required"),
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  subDistrict: z.string().min(1, "Sub-district is required"),
});

interface BloodRequestFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function BloodRequestForm({
  onSuccess,
  className,
}: BloodRequestFormProps) {
  const createRequest = useMutation(api.users.createBloodRequest);

  const form = useForm({
    defaultValues: {
      patientName: "",
      bloodTypeNeeded: "A+" as (typeof bloodTypes)[number],
      hospitalName: "",
      hospitalLocation: "",
      urgency: "Medium" as (typeof urgencies)[number],
      phoneNumber: "",
      contactNumber: "",
      numberOfBags: 1,
      division: "",
      district: "",
      subDistrict: "",
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createRequest(value);
        toast.success("Blood request created successfully!");
        form.reset();
        onSuccess?.();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to create request");
        }
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
      className={className ?? "space-y-6"}
    >
      <FieldGroup>
        <form.Field name="patientName">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !!field.state.meta.errors.length;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Patient Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Enter patient's name"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <div className="grid grid-cols-2 gap-4">
          <form.Field name="bloodTypeNeeded">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !!field.state.meta.errors.length;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Blood Type Needed
                  </FieldLabel>
                  <Select
                    onValueChange={(val) =>
                      field.handleChange(val as (typeof bloodTypes)[number])
                    }
                    defaultValue={field.state.value}
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
          <form.Field name="urgency">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !!field.state.meta.errors.length;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Urgency</FieldLabel>
                  <Select
                    onValueChange={(val) =>
                      field.handleChange(val as (typeof urgencies)[number])
                    }
                    defaultValue={field.state.value}
                    value={field.state.value}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencies.map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
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

        <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
          <h4 className="text-sm font-semibold">Location Details</h4>
          <form.Field name="division">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !!field.state.meta.errors.length;
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                          onValueChange={(val) => field.handleChange(val ?? "")}
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

        <form.Field name="hospitalName">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !!field.state.meta.errors.length;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Hospital Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="e.g., Central Hospital"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="hospitalLocation">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !!field.state.meta.errors.length;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Hospital Location Details
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="e.g., Floor 3, Room 302"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <div className="grid grid-cols-2 gap-4">
          <form.Field name="phoneNumber">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !!field.state.meta.errors.length;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Your Phone Number
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Your number"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="contactNumber">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !!field.state.meta.errors.length;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Backup Contact</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Backup number"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>
        <form.Field name="numberOfBags">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !!field.state.meta.errors.length;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Number of Bags Needed
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  min={1}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  aria-invalid={isInvalid}
                  placeholder="How many bags?"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

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
              {isSubmitting ? "Posting..." : "Post Request"}
            </Button>
          );
        }}
      </form.Subscribe>
    </form>
  );
}
