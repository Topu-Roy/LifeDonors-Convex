"use client";

import { useState } from "react";
import { BloodRequestForm } from "@/app/requests/_components/BloodRequestForm";
import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Droplets,
  Edit2,
  Hospital,
  MapPin,
  Phone,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/Container";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badges } from "./badges";
import { DangerZone } from "./dangerZone";
import { FulfillmentStatus } from "./fulfillmentStatus";
import { Volunteers } from "./volunteers";

export function RequestDetails({ requestId }: { requestId: Id<"requests"> }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const request = useQuery(api.requests.getRequestById, { requestId });

  if (request === undefined) {
    return (
      <Container className="animate-pulse space-y-8 py-12">
        <div className="bg-muted h-10 w-48 rounded-2xl" />
        <div className="bg-muted h-64 w-full rounded-3xl" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-muted h-96 rounded-3xl md:col-span-2" />
          <div className="bg-muted h-96 rounded-3xl" />
        </div>
      </Container>
    );
  }

  if (request === null) {
    return (
      <Container className="max-w-md space-y-6 py-24 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-red-100 dark:bg-red-900/20">
          <AlertCircle className="h-12 w-12 text-red-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Request Not Found</h1>
          <p className="leading-relaxed font-medium text-slate-500 dark:text-slate-400">
            This request doesn&apos;t exist or you don&apos;t have permission to view it.
          </p>
        </div>
        <Link
          href="/requests"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "border-primary/20 h-12 rounded-2xl px-8 font-bold"
          )}
        >
          Back to All Requests
        </Link>
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8f6] dark:bg-[#102216]">
      <Container className="space-y-10 pt-4 pb-10 md:pt-10">
        {/* Top Navbar/Back & Edit */}
        <div className="flex items-center justify-between">
          <Link
            href="/requests"
            className="border-primary/10 hover:text-primary text-muted-foreground flex w-fit items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-bold shadow-sm transition-all sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="xs:inline hidden">Back to Explorer</span>
            <span className="xs:hidden">Back</span>
          </Link>

          {request.isOwner && (
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger
                render={props => (
                  <Button
                    {...props}
                    variant="outline"
                    size="sm"
                    className="border-primary/10 hover:text-primary text-muted-foreground flex w-fit items-center gap-2 rounded-2xl border px-4 py-4 text-xs font-bold shadow-sm transition-all sm:text-sm"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit Request
                  </Button>
                )}
              />

              <DialogContent className="max-h-[90vh] w-[95%] max-w-6xl overflow-y-auto">
                <DialogHeader className="mb-4 space-y-1">
                  <DialogTitle className="text-2xl font-black">Edit Blood Request</DialogTitle>
                  <DialogDescription className="font-medium">
                    Update the details of your request.
                  </DialogDescription>
                </DialogHeader>
                <BloodRequestForm
                  requestId={request._id}
                  initialData={{
                    patientName: request.patientName,
                    patientAge: request.patientAge,
                    patientGender: request.patientGender,
                    cause: request.cause,
                    bloodTypeNeeded: request.bloodTypeNeeded,
                    hospitalName: request.hospitalName,
                    hospitalLocation: request.hospitalLocation,
                    urgency: request.urgency,
                    phoneNumber: request.phoneNumber,
                    contactNumber: request.contactNumber,
                    numberOfBags: request.numberOfBags,
                    division: request.division ?? "",
                    district: request.district ?? "",
                    subDistrict: request.subDistrict ?? "",
                  }}
                  onSuccess={() => setIsEditOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Badges */}
        <Badges isSeed={request.isSeed} status={request.status} urgency={request.urgency} />

        {/* Seed Alert */}
        {request.isSeed ? (
          <Alert className="bg-accent space-y-2 px-4 py-4">
            <AlertTitle className="">Note</AlertTitle>
            <AlertDescription className="w-full italic">
              This is not a real request. This is a demo request created to test the application.
            </AlertDescription>
          </Alert>
        ) : null}

        {/* Hero Section */}
        <section className="border-primary/10 shadow-primary/5 bg-card text-card-foreground relative overflow-hidden rounded-3xl border p-8 shadow-xl md:p-12">
          <div className="pointer-events-none absolute top-0 right-0 p-12 opacity-5 dark:opacity-10">
            <Droplets className="text-primary h-48 w-48" />
          </div>

          <div className="relative z-10 flex flex-col items-start gap-10 md:flex-row md:items-center">
            <div className="bg-primary shadow-primary/20 flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl text-5xl font-black text-white shadow-2xl">
              {request.bloodTypeNeeded}
            </div>

            <div className="flex-1 space-y-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl lg:text-5xl dark:text-slate-100">
                  {request.bloodTypeNeeded} Blood Required
                </h1>
                <p className="text-lg font-medium text-slate-500 md:text-xl dark:text-slate-400">
                  Patient:{" "}
                  <span className="font-bold text-slate-900 dark:text-slate-100">{request.patientName}</span>
                  {(request.patientGender ?? request.patientAge) && (
                    <span className="text-muted-foreground ml-2 text-base font-medium">
                      {request.patientGender && `(${request.patientGender}`}
                      {request.patientAge && request.patientGender && `, ${request.patientAge} yrs)`}
                      {request.patientAge && !request.patientGender && `(${request.patientAge} yrs)`}
                      {request.patientGender && !request.patientAge && `)`}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                  <Calendar className="text-primary h-5 w-5" />
                  Requested{" "}
                  {new Date(request.createdAt).toLocaleDateString([], {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                  <TrendingUp className="text-primary h-5 w-5" />
                  {request.numberOfBags} {request.numberOfBags > 1 ? "Bags" : "Bag"} Needed
                </div>
                {request.cause && (
                  <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-black">
                    {request.cause}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Main Content: Volunteers */}
          <Volunteers requestId={requestId} isOwner={request.isOwner} volunteers={request.volunteers} />

          {/* Sidebar Area: Fulfillment & Logistics */}
          <aside className="space-y-8">
            {/* Fulfillment Status Card */}
            <FulfillmentStatus requestId={requestId} />

            {/* Logistics Card */}
            <Card className="rounded-3xl border border-slate-100 bg-white p-8 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <div className="space-y-8">
                <h3 className="flex items-center gap-2 text-xl font-black tracking-tight italic">
                  Hospital Details
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                      <Hospital className="text-primary h-5 w-5" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <p className="leading-none font-black tracking-tight wrap-break-word text-slate-900 dark:text-slate-100">
                        {request.hospitalName}
                      </p>
                      <p className="text-xs font-bold tracking-tighter text-slate-400 uppercase">Hospital Name</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                      <MapPin className="text-primary h-5 w-5" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm leading-tight font-bold text-slate-700 italic dark:text-slate-300">
                        {request.hospitalLocation}
                      </p>
                      <p className="text-[10px] font-black tracking-tighter text-slate-400 uppercase">
                        {request.subDistrict}, {request.district}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 border-t border-slate-50 py-4 dark:border-slate-800">
                    <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                      <Phone className="text-primary h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-black tracking-tighter text-slate-900 dark:text-slate-100">
                        {request.contactNumber}
                      </p>
                      <p className="text-primary/80 text-xs font-black tracking-widest uppercase">
                        Primary Contact
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          {/* Danger Zone */}
          <DangerZone requestId={requestId} />
        </div>
      </Container>
    </div>
  );
}
