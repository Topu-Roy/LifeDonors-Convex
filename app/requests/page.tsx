"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RequestCard } from "@/components/RequestCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  FieldError,
} from "@/components/ui/field";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { Plus, Filter } from "lucide-react";
import { toast } from "sonner";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
const urgencies = ["Low", "Medium", "High", "Critical"] as const;

const formSchema = z.object({
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

export default function RequestsPage() {
  const [filterBloodType, setFilterBloodType] = useState<string | undefined>(
    undefined,
  );
  const [filterDivision, setFilterDivision] = useState<string | undefined>(
    undefined,
  );
  const [filterDistrict, setFilterDistrict] = useState<string | undefined>(
    undefined,
  );
  const [filterSubDistrict, setFilterSubDistrict] = useState<
    string | undefined
  >(undefined);

  const profile = useQuery(api.users.getMyProfile);

  if (profile && !filterDivision) {
    setFilterDivision(profile.division);
    setFilterDistrict(profile.district);
    setFilterSubDistrict(profile.subDistrict);
  }

  const requests = useQuery(api.users.getAllRequests, {
    bloodType: filterBloodType === "ALL" ? undefined : filterBloodType,
    division: filterDivision === "ALL" ? undefined : filterDivision,
    district: filterDistrict === "ALL" ? undefined : filterDistrict,
    subDistrict: filterSubDistrict === "ALL" ? undefined : filterSubDistrict,
  });
  const createRequest = useMutation(api.users.createBloodRequest);
  const [open, setOpen] = useState(false);

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
        setOpen(false);
        form.reset();
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
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Blood Requests</h1>
          <p className="text-muted-foreground">
            Help people in need of life-saving blood donations.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button className="bg-red-600 hover:bg-red-700 gap-2">
              <Plus className="h-4 w-4" />
              Post a Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Request Blood</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-4 pt-4"
            >
              <FieldGroup>
                <form.Field name="patientName">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      !!field.state.meta.errors.length;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Patient Name
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Enter patient's name"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
                <div className="grid grid-cols-2 gap-4">
                  <form.Field name="bloodTypeNeeded">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched &&
                        !!field.state.meta.errors.length;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Blood Type Needed
                          </FieldLabel>
                          <Select
                            onValueChange={(val) =>
                              field.handleChange(
                                val as (typeof bloodTypes)[number],
                              )
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
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                  <form.Field name="urgency">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched &&
                        !!field.state.meta.errors.length;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Urgency</FieldLabel>
                          <Select
                            onValueChange={(val) =>
                              field.handleChange(
                                val as (typeof urgencies)[number],
                              )
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
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                </div>
                <form.Field name="hospitalName">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      !!field.state.meta.errors.length;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Hospital Name
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="e.g., Central Hospital"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field name="hospitalLocation">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      !!field.state.meta.errors.length;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Hospital Location
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="e.g., Downtown, Block A"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
                <div className="grid grid-cols-2 gap-4">
                  <form.Field name="phoneNumber">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched &&
                        !!field.state.meta.errors.length;
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
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                  <form.Field name="contactNumber">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched &&
                        !!field.state.meta.errors.length;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Backup Contact
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="Backup number"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                </div>
                <form.Field name="numberOfBags">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      !!field.state.meta.errors.length;
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
                          onChange={(e) =>
                            field.handleChange(Number(e.target.value))
                          }
                          aria-invalid={isInvalid}
                          placeholder="How many bags of blood?"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
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
                      className="w-full bg-red-600 hover:bg-red-700 font-bold"
                    >
                      {isSubmitting ? "Posting..." : "Post Request"}
                    </Button>
                  );
                }}
              </form.Subscribe>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <Select
          onValueChange={(val) => setFilterBloodType(val as string)}
          defaultValue="ALL"
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Blood Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Blood Types</SelectItem>
            {bloodTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests === undefined ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
          ))
        ) : requests.length > 0 ? (
          requests.map((request) => (
            <RequestCard key={request._id} request={request} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <h3 className="text-xl font-semibold mb-2">No Requests Found</h3>
            <p className="text-muted-foreground">
              Try selecting a different blood type or check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
