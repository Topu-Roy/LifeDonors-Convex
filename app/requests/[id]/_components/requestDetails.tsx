"use client";

import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Droplets,
  Hospital,
  MapPin,
  Phone,
  ShieldAlert,
  TrendingUp,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Container } from "@/components/Container";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function RequestDetails({ requestId }: { requestId: Id<"requests"> }) {
  const router = useRouter();

  const request = useQuery(api.requests.getRequestById, { requestId });
  const selectDonor = useMutation(api.donations.selectDonor);
  const rejectDonor = useMutation(api.donations.rejectDonor);
  const updateDonationStatus = useMutation(api.donations.updateDonationStatus);
  const cancelRequest = useMutation(api.requests.cancelRequest);

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

  const handleSelectDonor = async (donationId: Id<"donations">) => {
    try {
      await selectDonor({ donationId });
      toast.success("Donor selected!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to select donor");
    }
  };

  const handleRejectDonor = async (donationId: Id<"donations">) => {
    try {
      if (confirm("Reject this donor?")) {
        await rejectDonor({ donationId, requestId });
        toast.success("Donor rejected");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reject donor");
    }
  };

  const handleUpdateStatus = async (donationId: Id<"donations">, status: "Donated" | "No Show") => {
    try {
      await updateDonationStatus({ donationId, status });
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleCancelRequest = async () => {
    try {
      if (confirm("Are you sure you want to cancel the ENTIRE request? This cannot be undone.")) {
        await cancelRequest({ requestId: request._id });
        toast.success("Request cancelled");
        router.push("/requests");
      }
    } catch {
      toast.error("Failed to cancel request");
    }
  };

  const securedBags = request.volunteers.filter(v => v.status === "Accepted" || v.status === "Donated").length;
  const donatedBags = request.volunteers.filter(v => v.status === "Donated").length;
  const progressPercent = Math.min((securedBags / request.numberOfBags) * 100, 100);

  const urgencyBadgeStyles = {
    Low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    Medium: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
    High: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
    Critical: "bg-red-600 text-white animate-pulse",
  };

  return (
    <div className="min-h-screen bg-[#f6f8f6] dark:bg-[#102216]">
      <Container className="space-y-10 py-10">
        {/* Top Navbar/Back */}
        <div className="flex items-center justify-between">
          <Link
            href="/requests"
            className="border-primary/10 hover:text-primary flex w-fit items-center gap-2 rounded-2xl border bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition-all sm:text-sm dark:bg-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="xs:inline hidden">Back to Explorer</span>
            <span className="xs:hidden">Back</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <Badge
              className={cn(
                "rounded-full border-none px-3 py-1.5 text-[9px] font-black tracking-widest uppercase sm:px-4 sm:text-[10px]",
                urgencyBadgeStyles[request.urgency]
              )}
            >
              <span className="xs:inline hidden">{request.urgency} Priority</span>
              <span className="xs:inline">{request.urgency}</span>
            </Badge>
            <Badge
              variant={request.status === "Completed" ? "default" : "outline"}
              className={cn(
                "rounded-full px-3 py-1.5 text-[9px] font-black tracking-widest uppercase sm:px-4 sm:text-[10px]",
                request.status === "Completed" && "border-none bg-green-500 text-white hover:bg-green-600",
                request.status === "Cancelled" && "border-none bg-slate-200 text-slate-500 dark:bg-slate-800",
                request.status === "Open" && "border-primary/20 text-primary"
              )}
            >
              {request.status}
            </Badge>
          </div>
        </div>

        {/* Hero Section */}
        <section className="border-primary/10 shadow-primary/5 relative overflow-hidden rounded-3xl border bg-white p-8 shadow-xl md:p-12 dark:bg-slate-900">
          <div className="pointer-events-none absolute top-0 right-0 p-12 opacity-5 dark:opacity-10">
            <Droplets className="text-primary h-48 w-48" />
          </div>

          <div className="relative z-10 flex flex-col items-start gap-10 md:flex-row md:items-center">
            <div className="bg-primary shadow-primary/20 flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl text-5xl font-black text-slate-900 shadow-2xl">
              {request.bloodTypeNeeded}
            </div>

            <div className="flex-1 space-y-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl lg:text-5xl dark:text-slate-100">
                  {request.bloodTypeNeeded} Blood Required
                </h1>
                <p className="text-lg font-medium text-slate-500 md:text-xl dark:text-slate-400">
                  Patient Name:{" "}
                  <span className="font-bold text-slate-900 dark:text-slate-100">{request.patientName}</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
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
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Main Content: Volunteers */}
          <div className="space-y-10 lg:col-span-2">
            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight">
                  Potential Volunteers
                  <span className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-black">
                    {request.volunteers.length}
                  </span>
                </h2>
              </div>

              {request.volunteers.length === 0 ? (
                <div className="border-primary/10 rounded-3xl border-2 border-dashed bg-white py-20 text-center dark:bg-slate-900">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 dark:bg-slate-800">
                    <User className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-black">No volunteers yet</h3>
                  <p className="mx-auto max-w-xs font-medium text-slate-500 dark:text-slate-400">
                    As soon as donors respond to this request, they will appear here for your review.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {request.volunteers.map(v => (
                    <Card
                      key={v._id}
                      className={cn(
                        "group overflow-hidden rounded-3xl border-2 transition-all duration-300",
                        v.status === "Accepted" || v.status === "Donated"
                          ? "border-primary/40 shadow-primary/5 scale-100 shadow-lg"
                          : "border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900"
                      )}
                    >
                      <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                          <div className="flex items-center gap-6">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 sm:h-16 sm:w-16 dark:bg-slate-800">
                              <User className="h-6 w-6 sm:h-8 sm:w-8" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <span className="text-lg font-black tracking-tight sm:text-xl">
                                  {v.donor?.phoneNumber ?? "Private Donor"}
                                </span>
                                <Badge
                                  className={cn(
                                    "rounded-full border-none px-3 py-0.5 text-[9px] font-black tracking-widest uppercase",
                                    v.status === "Donated" && "bg-green-500 text-white",
                                    v.status === "Accepted" && "bg-primary text-slate-900",
                                    v.status === "Offered" && "bg-slate-100 text-slate-500"
                                  )}
                                >
                                  {v.status}
                                </Badge>
                              </div>
                              {v.donor && (
                                <p className="flex items-center gap-1 text-xs font-bold text-slate-500">
                                  <MapPin className="h-3 w-3" />
                                  {v.donor.district && `${v.donor.subDistrict}, ${v.donor.district}`}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
                            {v.status === "Offered" && (
                              <>
                                <Button
                                  className="bg-primary h-12 w-full rounded-xl font-bold text-slate-900 transition-transform hover:scale-105 sm:w-auto"
                                  onClick={() => handleSelectDonor(v._id)}
                                >
                                  Select Donor
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-red-500 hover:bg-red-50 sm:w-12 sm:gap-0 dark:hover:bg-red-950/20"
                                  onClick={() => handleRejectDonor(v._id)}
                                >
                                  <XCircle className="h-6 w-6" />
                                  <span className="font-bold sm:hidden">Reject Donor</span>
                                </Button>
                              </>
                            )}
                            {v.status === "Accepted" && (
                              <>
                                <Button
                                  className="h-12 w-full gap-2 rounded-xl bg-green-600 font-bold text-white transition-transform hover:scale-105 hover:bg-green-700 sm:w-auto"
                                  onClick={() => handleUpdateStatus(v._id, "Donated")}
                                >
                                  <CheckCircle2 className="h-5 w-5" />
                                  Mark Donated
                                </Button>
                                <Button
                                  variant="outline"
                                  className="h-12 w-full rounded-xl border-red-200 font-bold text-red-600 transition-all hover:bg-red-50 sm:w-auto"
                                  onClick={() => handleUpdateStatus(v._id, "No Show")}
                                >
                                  No Show
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Danger Zone */}
            {request.status !== "Cancelled" && request.status !== "Completed" && (
              <section className="border-t border-red-100 pt-10 dark:border-red-900/20">
                <div className="flex flex-col items-center justify-between gap-8 rounded-3xl border-2 border-dashed border-red-200 bg-red-50/50 p-8 md:flex-row md:p-10 dark:border-red-900/40 dark:bg-red-950/10">
                  <div className="space-y-2 text-center md:text-left">
                    <div className="flex items-center justify-center gap-2 md:justify-start">
                      <ShieldAlert className="h-6 w-6 text-red-600" />
                      <h3 className="text-xl font-black tracking-tighter text-red-600 uppercase italic">
                        Danger Zone
                      </h3>
                    </div>
                    <p className="max-w-sm text-sm font-bold text-slate-500 dark:text-slate-400">
                      Cancel this blood request. This will notify all volunteers and mark request as inactive.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    className="h-14 rounded-2xl px-10 text-base font-black shadow-xl shadow-red-500/20 transition-all active:scale-95"
                    onClick={handleCancelRequest}
                  >
                    Cancel Entire Request
                  </Button>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Area: Fulfillment & Logistics */}
          <aside className="space-y-8">
            {/* Fulfillment Status Card */}
            <Card className="border-primary/10 shadow-primary/5 rounded-3xl border-2 bg-white p-8 shadow-xl dark:bg-slate-900">
              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-xl font-black tracking-tight">Fulfillment Status</h3>
                  <p className="text-xs font-bold tracking-widest text-slate-400 uppercase italic">
                    Live Progress Tracking
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="flex items-end justify-between">
                    <div className="space-y-1">
                      <p className="text-primary text-4xl font-black">{securedBags}</p>
                      <p className="text-[10px] font-black tracking-tighter text-slate-400 uppercase">
                        Bags Secured
                      </p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-2xl font-black text-slate-300 dark:text-slate-700">
                        / {request.numberOfBags}
                      </p>
                      <p className="text-[10px] font-black tracking-tighter text-slate-400 uppercase">Target</p>
                    </div>
                  </div>

                  <div className="h-6 w-full overflow-hidden rounded-full border-2 border-slate-50 bg-slate-100 p-1.5 shadow-inner dark:border-slate-800 dark:bg-slate-800">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-1000 ease-out",
                        donatedBags === request.numberOfBags
                          ? "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                          : "bg-primary shadow-[0_0_20px_rgba(43,238,108,0.3)]"
                      )}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] font-black tracking-widest uppercase">
                    <span className="text-green-600">{donatedBags} Donated</span>
                    <span className="text-primary">{securedBags - donatedBags} Committed</span>
                  </div>
                </div>
              </div>
            </Card>

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
        </div>
      </Container>
    </div>
  );
}
