"use client";

import { useForm } from "@tanstack/react-form";
import {
  getAllDivisions,
  getDistrictsByDivision,
  getSubDistrictsByDistrict,
} from "@/constants/bangladeshAdministrativeAreas";
import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { HelpCircle } from "lucide-react";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
const urgencies = ["Low", "Medium", "High", "Critical"] as const;
const causes = ["Operation", "Delivery", "Accident", "Other"] as const;
const genders = ["Male", "Female", "Other"] as const;

export const formSchema = z.object({
  patientName: z.string().min(2, "Name is too short"),
  patientAge: z.number().min(1, "Age is required").max(120),
  patientGender: z.enum(genders),
  cause: z.enum(causes),
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

type BloodRequestFormProps = {
  onSuccess?: () => void;
  className?: string;
  initialData?: z.infer<typeof formSchema>;
  requestId?: Id<"requests">;
};

export function BloodRequestForm({ onSuccess, className, initialData, requestId }: BloodRequestFormProps) {
  const createRequest = useMutation(api.requests.createBloodRequest);
  const updateRequest = useMutation(api.requests.updateBloodRequest);

  const form = useForm({
    defaultValues: initialData ?? {
      patientName: "",
      patientAge: undefined,
      patientGender: undefined,
      cause: undefined,
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
        if (requestId) {
          await updateRequest({ ...(value as z.infer<typeof formSchema>), requestId });
          toast.success("Blood request updated successfully!");
        } else {
          await createRequest(value as z.infer<typeof formSchema>);
          toast.success("Blood request created successfully!");
          form.reset();
        }
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
    <TooltipProvider delay={200}>
      <form
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className={className ?? "space-y-6"}
      >
        <FieldGroup>
          <form.Field name="patientName">
            {field => {
              const isInvalid = field.state.meta.isTouched && !!field.state.meta.errors.length;
              return (
                <Field data-invalid={isInvalid}>
                  <div className="flex items-center gap-1.5">
                    <FieldLabel htmlFor={field.name}>Patient Name</FieldLabel>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="text-muted-foreground/50 hover:text-primary h-3.5 w-3.5 cursor-help transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent>The full name of the person who needs blood.</TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Enter patient's name"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Patient info: Gender, Age, Cause */}
          <div className="grid grid-cols-3 gap-4">
            <form.Field name="patientGender">
              {field => {
                const isInvalid = field.state.meta.isTouched && !!field.state.meta.errors.length;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Gender</FieldLabel>
                    <Select onValueChange={val => field.handleChange(val!)} value={field.state.value ?? ""}>
                      <SelectTrigger id={field.name}>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {genders.map(g => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="patientAge">
              {field => {
                const isInvalid = field.state.meta.isTouched && !!field.state.meta.errors.length;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Age</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min={1}
                      max={120}
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(prev => (e.target.value ? Number(e.target.value) : prev))}
                      aria-invalid={isInvalid}
                      placeholder="e.g. 35"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="cause">
              {field => {
                const isInvalid = field.state.meta.isTouched && !!field.state.meta.errors.length;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Cause</FieldLabel>
                    <Select onValueChange={val => field.handleChange(val!)} value={field.state.value ?? ""}>
                      <SelectTrigger id={field.name}>
                        <SelectValue placeholder="Select cause" />
                      </SelectTrigger>
                      <SelectContent>
                        {causes.map(c => (
                          <SelectItem key={c} value={c}>
                            {c}
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
            <form.Field name="bloodTypeNeeded">
              {field => {
                const isInvalid = field.state.meta.isTouched && !!field.state.meta.errors.length;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Blood Type Needed</FieldLabel>
                    <Select
                      onValueChange={val => field.handleChange(val!)}
                      defaultValue={field.state.value}
                      value={field.state.value}
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodTypes.map(type => (
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
              {field => {
                const isInvalid = field.state.meta.isTouched && !!field.state.meta.errors.length;
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center gap-1.5">
                      <FieldLabel htmlFor={field.name}>Urgency</FieldLabel>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="text-muted-foreground/50 hover:text-primary h-3.5 w-3.5 cursor-help transition-colors" />
                        </TooltipTrigger>
                        <TooltipContent>
                          How urgently is the blood needed? &quot;Critical&quot; usually means within a few hours.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Select
                      onValueChange={val => field.handleChange(val!)}
                      defaultValue={field.state.value}
                      value={field.state.value}
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        {urgencies.map(u => (
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

          <div className="bg-muted/30 space-y-4 rounded-lg border p-4">
            <h4 className="text-sm font-semibold">Location Details</h4>
            <form.Field name="division">
              {field => {
                const isInvalid = field.state.meta.isTouched && !!field.state.meta.errors.length;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Division</FieldLabel>
                    <Select
                      onValueChange={val => {
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
                        {getAllDivisions().map(div => (
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
              <form.Subscribe selector={state => state.values.division}>
                {division => (
                  <form.Field name="district">
                    {field => {
                      const isInvalid = field.state.meta.isTouched && !!field.state.meta.errors.length;
                      const districts = division ? getDistrictsByDivision({ division }) : [];
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>District</FieldLabel>
                          <Select
                            disabled={!division}
                            onValueChange={val => {
                              field.handleChange(val ?? "");
                              form.setFieldValue("subDistrict", "");
                            }}
                            value={field.state.value}
                          >
                            <SelectTrigger id={field.name}>
                              <SelectValue placeholder="District" />
                            </SelectTrigger>
                            <SelectContent>
                              {districts.map(dist => (
                                <SelectItem key={dist} value={dist}>
                                  {dist}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                      const isInvalid = field.state.meta.isTouched && !!field.state.meta.errors.length;
                      const subDistricts =
                        division && district
                          ? getSubDistrictsByDistrict({
                              division,
                              district,
                            })
                          : [];
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Sub-District</FieldLabel>
                          <Select
                            disabled={!district}
                            onValueChange={val => field.handleChange(val ?? "")}
                            value={field.state.value}
                          >
                            <SelectTrigger id={field.name}>
                              <SelectValue placeholder="Town/Area" />
                            </SelectTrigger>
                            <SelectContent>
                              {subDistricts.map(sub => (
                                <SelectItem key={sub} value={sub}>
                                  {sub}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                      );
                    }}
                  </form.Field>
                )}
              </form.Subscribe>
            </div>
          </div>

          <form.Field name="hospitalName">
            {field => {
              const isInvalid = field.state.meta.isTouched && !!field.state.meta.errors.length;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Hospital Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="e.g., Central Hospital"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="hospitalLocation">
            {field => {
              const isInvalid = field.state.meta.isTouched && !!field.state.meta.errors.length;
              return (
                <Field data-invalid={isInvalid}>
                  <div className="flex items-center gap-1.5">
                    <FieldLabel htmlFor={field.name}>Hospital Location Details</FieldLabel>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="text-muted-foreground/50 hover:text-primary h-3.5 w-3.5 cursor-help transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Room number, floor, or specific ward to help donors find the patient.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
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
              {field => {
                const isInvalid = field.state.meta.isTouched && !!field.state.meta.errors.length;
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center gap-1.5">
                      <FieldLabel htmlFor={field.name}>Your Phone Number</FieldLabel>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="text-muted-foreground/50 hover:text-primary h-3.5 w-3.5 cursor-help transition-colors" />
                        </TooltipTrigger>
                        <TooltipContent>
                          The primary number donors will call to coordinate with you.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Your number"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="contactNumber">
              {field => {
                const isInvalid = field.state.meta.isTouched && !!field.state.meta.errors.length;
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center gap-1.5">
                      <FieldLabel htmlFor={field.name}>Backup Contact</FieldLabel>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="text-muted-foreground/50 hover:text-primary h-3.5 w-3.5 cursor-help transition-colors" />
                        </TooltipTrigger>
                        <TooltipContent>
                          An alternative number in case your primary phone is unreachable.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
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
            {field => {
              const isInvalid = field.state.meta.isTouched && !!field.state.meta.errors.length;
              return (
                <Field data-invalid={isInvalid}>
                  <div className="flex items-center gap-1.5">
                    <FieldLabel htmlFor={field.name}>Number of Bags Needed</FieldLabel>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="text-muted-foreground/50 hover:text-primary h-3.5 w-3.5 cursor-help transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Total units of blood required for the patient&apos;s treatment.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min={1}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(Number(e.target.value))}
                    aria-invalid={isInvalid}
                    placeholder="How many bags?"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>

        <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
          {state => {
            const [canSubmit, isSubmitting] = state;
            return (
              <Button type="submit" disabled={!canSubmit} className="w-full font-bold">
                {isSubmitting
                  ? requestId
                    ? "Updating..."
                    : "Posting..."
                  : requestId
                    ? "Update Request"
                    : "Post Request"}
              </Button>
            );
          }}
        </form.Subscribe>
      </form>
    </TooltipProvider>
  );
}
