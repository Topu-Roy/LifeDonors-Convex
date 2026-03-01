"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import {
  User,
  ShieldCheck,
  Loader2,
  Edit2,
  Calendar,
  Activity,
  Phone,
  Droplet,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

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
});

export default function ProfilePage() {
  const profile = useQuery(api.users.getMyProfile);
  const updateProfile = useMutation(api.users.updateProfile);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isProfileComplete = (
    p:
      | {
          _id: Id<"profiles">;
          _creationTime: number;
          age: number;
          bmi: number;
          bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
          hemoglobinLevel: number;
          phoneNumber: string;
          diseases: string[];
          lastDonationDate: number;
          userId: string;
        }
      | null
      | undefined,
  ) => {
    if (!p) return false;
    return !!(
      p.age > 0 &&
      p.bloodType &&
      p.bmi > 0 &&
      p.hemoglobinLevel > 0 &&
      p.phoneNumber
    );
  };

  const form = useForm({
    defaultValues: {
      age: 0,
      bmi: 0,
      bloodType: "A+" as (typeof bloodTypes)[number],
      hemoglobinLevel: 0,
      phoneNumber: "",
      diseases: "",
      lastDonationDate: "",
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
        setIsDialogOpen(false);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to update profile");
        }
      }
    },
  });

  if (profile) {
    if (!isProfileComplete(profile)) {
      setIsDialogOpen(true);
    }
  } else if (profile === null) {
    setIsDialogOpen(true);
  }

  useEffect(() => {
    if (profile) {
      form.reset({
        age: profile.age,
        bmi: profile.bmi,
        bloodType: profile.bloodType as (typeof bloodTypes)[number],
        hemoglobinLevel: profile.hemoglobinLevel,
        phoneNumber: profile.phoneNumber,
        diseases: profile.diseases.join(", "),
        lastDonationDate: profile.lastDonationDate
          ? new Date(profile.lastDonationDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [form, profile, isDialogOpen]);

  if (profile === undefined) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-red-100 p-3 rounded-full">
          <User className="h-8 w-8 text-red-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Donor Profile</h1>
          <p className="text-muted-foreground">
            Keep your health metrics updated for eligibility.
          </p>
        </div>
      </div>

      <Card className="border-t-4 border-t-red-600">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-xl">Health Information</CardTitle>
            <CardDescription>
              Your current donor profile and eligibility metrics.
            </CardDescription>
          </div>
          {profile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
              className="gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-50 p-4 rounded-xl border flex flex-col items-center justify-center text-center">
                <div className="bg-red-100 p-2 rounded-full mb-2">
                  <Droplet className="h-6 w-6 text-red-600" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Blood Type
                </span>
                <span className="text-2xl font-bold text-red-600">
                  {profile?.bloodType || "--"}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border flex flex-col items-center justify-center text-center">
                <div className="bg-blue-100 p-2 rounded-full mb-2">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-sm text-muted-foreground">BMI</span>
                <span className="text-2xl font-bold text-blue-600">
                  {profile?.bmi || "--"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-sm border-b pb-1">
                Donor Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Age</p>
                    <p className="font-medium">
                      {profile?.age ? `${profile.age} years` : "Not set"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Hemoglobin</p>
                    <p className="font-medium">
                      {profile?.hemoglobinLevel
                        ? `${profile.hemoglobinLevel} g/dL`
                        : "Not set"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">
                      {profile?.phoneNumber || "Not set"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Last Donation
                    </p>
                    <p className="font-medium">
                      {profile?.lastDonationDate
                        ? new Date(
                            profile.lastDonationDate,
                          ).toLocaleDateString()
                        : "None recorded"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {profile?.diseases && profile.diseases.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm border-b pb-1">
                  Conditions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.diseases.map((disease) => (
                    <Badge key={disease} variant="secondary">
                      {disease}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Health Profile</DialogTitle>
            <DialogDescription>
              Please provide accurate health information for blood donation
              eligibility.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6 pt-4"
          >
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <form.Field name="age">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      !!field.state.meta.errors.length;
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
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field name="bloodType">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      !!field.state.meta.errors.length;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Blood Type</FieldLabel>
                        <Select
                          onValueChange={(val) =>
                            field.handleChange(
                              val as (typeof bloodTypes)[number],
                            )
                          }
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
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <form.Field name="bmi">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      !!field.state.meta.errors.length;
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
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field name="hemoglobinLevel">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      !!field.state.meta.errors.length;
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
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              <form.Field name="phoneNumber">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    !!field.state.meta.errors.length;
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
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="lastDonationDate">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    !!field.state.meta.errors.length;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Last Donation Date
                      </FieldLabel>
                      <Input
                        id={field.name}
                        type="date"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          field.handleChange(e.target.value)
                        }
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="diseases">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    !!field.state.meta.errors.length;
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
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>

            <div className="bg-slate-50 p-4 rounded-lg flex items-start gap-3 border">
              <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your data is private and only used to ensure safe donation
                practices.
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
                    className="w-full bg-red-600 hover:bg-red-700 font-bold"
                  >
                    {isSubmitting ? "Saving..." : "Save Profile Updates"}
                  </Button>
                );
              }}
            </form.Subscribe>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
