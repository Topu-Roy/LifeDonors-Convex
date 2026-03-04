"use client";

import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Phone,
  User,
  ArrowLeft,
  AlertCircle,
  Hospital,
  Droplets,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Container } from "@/components/Container";

export function RequestDetails({ requestId }: { requestId: Id<"requests"> }) {
  const router = useRouter();

  const request = useQuery(api.users.getRequestById, { requestId });
  const selectDonor = useMutation(api.users.selectDonor);
  const rejectDonor = useMutation(api.users.rejectDonor);
  const updateDonationStatus = useMutation(api.users.updateDonationStatus);
  const cancelRequest = useMutation(api.users.cancelRequest);

  if (request === undefined) {
    return (
      <Container className="py-12 space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-muted rounded-2xl" />
        <div className="h-64 w-full bg-muted rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 h-96 bg-muted rounded-3xl" />
          <div className="h-96 bg-muted rounded-3xl" />
        </div>
      </Container>
    );
  }

  if (request === null) {
    return (
      <Container className="py-24 text-center space-y-6 max-w-md">
        <div className="bg-red-100 dark:bg-red-900/20 h-24 w-24 rounded-3xl flex items-center justify-center mx-auto">
          <AlertCircle className="h-12 w-12 text-red-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">
            Request Not Found
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            This request doesn&apos;t exist or you don&apos;t have permission to
            view it.
          </p>
        </div>
        <Link
          href="/requests"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "rounded-2xl h-12 px-8 font-bold border-primary/20",
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
      toast.error(
        err instanceof Error ? err.message : "Failed to select donor",
      );
    }
  };

  const handleRejectDonor = async (donationId: Id<"donations">) => {
    try {
      if (confirm("Reject this donor?")) {
        await rejectDonor({ donationId, requestId });
        toast.success("Donor rejected");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to reject donor",
      );
    }
  };

  const handleUpdateStatus = async (
    donationId: Id<"donations">,
    status: "Donated" | "No Show",
  ) => {
    try {
      await updateDonationStatus({ donationId, status });
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleCancelRequest = async () => {
    try {
      if (
        confirm(
          "Are you sure you want to cancel the ENTIRE request? This cannot be undone.",
        )
      ) {
        await cancelRequest({ requestId: request._id });
        toast.success("Request cancelled");
        router.push("/requests");
      }
    } catch {
      toast.error("Failed to cancel request");
    }
  };

  const securedBags = request.volunteers.filter(
    (v) => v.status === "Accepted" || v.status === "Donated",
  ).length;
  const donatedBags = request.volunteers.filter(
    (v) => v.status === "Donated",
  ).length;
  const progressPercent = Math.min(
    (securedBags / request.numberOfBags) * 100,
    100,
  );

  const urgencyBadgeStyles = {
    Low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    Medium:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
    High: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
    Critical: "bg-red-600 text-white animate-pulse",
  };

  return (
    <div className="min-h-screen bg-[#f6f8f6] dark:bg-[#102216]">
      <Container className="py-10 space-y-10">
        {/* Top Navbar/Back */}
        <div className="flex items-center justify-between">
          <Link
            href="/requests"
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-primary/10 text-sm font-bold text-slate-600 hover:text-primary transition-all shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Explorer
          </Link>

          <div className="flex items-center gap-3">
            <Badge
              className={cn(
                "rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-none",
                urgencyBadgeStyles[request.urgency],
              )}
            >
              {request.urgency} Priority
            </Badge>
            <Badge
              variant={request.status === "Completed" ? "default" : "outline"}
              className={cn(
                "rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest",
                request.status === "Completed" &&
                  "bg-green-500 hover:bg-green-600 border-none",
                request.status === "Cancelled" &&
                  "bg-slate-200 text-slate-500 dark:bg-slate-800 border-none",
                request.status === "Open" && "border-primary/20 text-primary",
              )}
            >
              {request.status}
            </Badge>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-primary/10 shadow-xl shadow-primary/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 dark:opacity-10 pointer-events-none">
            <Droplets className="h-48 w-48 text-primary" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start md:items-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-primary text-slate-900 font-black text-5xl shadow-2xl shadow-primary/20 shrink-0">
              {request.bloodTypeNeeded}
            </div>

            <div className="space-y-4 flex-1">
              <div className="space-y-1">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                  {request.bloodTypeNeeded} Blood Required
                </h1>
                <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">
                  Patient Name:{" "}
                  <span className="text-slate-900 dark:text-slate-100 font-bold">
                    {request.patientName}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                  <Calendar className="h-5 w-5 text-primary" />
                  Requested{" "}
                  {new Date(request.createdAt).toLocaleDateString([], {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {request.numberOfBags}{" "}
                  {request.numberOfBags > 1 ? "Bags" : "Bag"} Needed
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content: Volunteers */}
          <div className="lg:col-span-2 space-y-10">
            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                  Potential Volunteers
                  <span className="h-8 w-8 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-black">
                    {request.volunteers.length}
                  </span>
                </h2>
              </div>

              {request.volunteers.length === 0 ? (
                <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-primary/10">
                  <div className="bg-slate-100 dark:bg-slate-800 h-20 w-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <User className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-black mb-2">No volunteers yet</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">
                    As soon as donors respond to this request, they will appear
                    here for your review.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {request.volunteers.map((v) => (
                    <Card
                      key={v._id}
                      className={cn(
                        "rounded-3xl border-2 overflow-hidden transition-all duration-300 group",
                        v.status === "Accepted" || v.status === "Donated"
                          ? "border-primary/40 shadow-lg shadow-primary/5 scale-100"
                          : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900",
                      )}
                    >
                      <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                          <div className="flex items-center gap-6">
                            <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                              <User className="h-8 w-8" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <span className="font-black text-xl tracking-tight">
                                  {v.donor?.phoneNumber || "Private Donor"}
                                </span>
                                <Badge
                                  className={cn(
                                    "rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-widest border-none",
                                    v.status === "Donated" &&
                                      "bg-green-500 text-white",
                                    v.status === "Accepted" &&
                                      "bg-primary text-slate-900",
                                    v.status === "Offered" &&
                                      "bg-slate-100 text-slate-500",
                                  )}
                                >
                                  {v.status}
                                </Badge>
                              </div>
                              {v.donor && (
                                <p className="text-xs text-slate-500 font-bold flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {v.donor.district &&
                                    `${v.donor.subDistrict}, ${v.donor.district}`}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-3 w-full md:w-auto">
                            {v.status === "Offered" && (
                              <>
                                <Button
                                  className="flex-1 md:flex-none h-12 rounded-xl font-bold bg-primary text-slate-900 hover:scale-105 transition-transform"
                                  onClick={() => handleSelectDonor(v._id)}
                                >
                                  Select Donor
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="h-12 w-12 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                                  onClick={() => handleRejectDonor(v._id)}
                                >
                                  <XCircle className="h-6 w-6" />
                                </Button>
                              </>
                            )}
                            {v.status === "Accepted" && (
                              <>
                                <Button
                                  className="flex-1 md:flex-none h-12 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700 hover:scale-105 transition-transform gap-2"
                                  onClick={() =>
                                    handleUpdateStatus(v._id, "Donated")
                                  }
                                >
                                  <CheckCircle2 className="h-5 w-5" />
                                  Mark Donated
                                </Button>
                                <Button
                                  variant="outline"
                                  className="h-12 rounded-xl font-bold border-red-200 text-red-600 hover:bg-red-50 transition-all"
                                  onClick={() =>
                                    handleUpdateStatus(v._id, "No Show")
                                  }
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
            {request.status !== "Cancelled" &&
              request.status !== "Completed" && (
                <section className="pt-10 border-t border-red-100 dark:border-red-900/20">
                  <div className="bg-red-50/50 dark:bg-red-950/10 rounded-3xl p-8 md:p-10 border-2 border-dashed border-red-200 dark:border-red-900/40 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2 text-center md:text-left">
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <ShieldAlert className="h-6 w-6 text-red-600" />
                        <h3 className="text-xl font-black text-red-600 italic uppercase tracking-tighter">
                          Danger Zone
                        </h3>
                      </div>
                      <p className="text-sm font-bold text-slate-500 dark:text-slate-400 max-w-sm">
                        Cancel this blood request. This will notify all
                        volunteers and mark request as inactive.
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      className="h-14 px-10 rounded-2xl font-black text-base shadow-xl shadow-red-500/20 active:scale-95 transition-all"
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
            <Card className="rounded-3xl border-2 border-primary/10 bg-white dark:bg-slate-900 p-8 shadow-xl shadow-primary/5">
              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-xl font-black tracking-tight">
                    Fulfillment Status
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">
                    Live Progress Tracking
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-4xl font-black text-primary">
                        {securedBags}
                      </p>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                        Bags Secured
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-2xl font-black text-slate-300 dark:text-slate-700">
                        / {request.numberOfBags}
                      </p>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                        Target
                      </p>
                    </div>
                  </div>

                  <div className="h-6 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1.5 border-2 border-slate-50 dark:border-slate-800 shadow-inner">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-1000 ease-out",
                        donatedBags === request.numberOfBags
                          ? "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                          : "bg-primary shadow-[0_0_20px_rgba(43,238,108,0.3)]",
                      )}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-green-600">
                      {donatedBags} Donated
                    </span>
                    <span className="text-primary">
                      {securedBags - donatedBags} Committed
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Logistics Card */}
            <Card className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-md">
              <div className="space-y-8">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-2 italic">
                  Hospital Details
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 h-10 w-10 rounded-xl flex items-center justify-center shrink-0">
                      <Hospital className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <p className="font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none wrap-break-word">
                        {request.hospitalName}
                      </p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                        Hospital Name
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 h-10 w-10 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <p className="font-bold text-slate-700 dark:text-slate-300 text-sm leading-tight italic">
                        {request.hospitalLocation}
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                        {request.subDistrict}, {request.district}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 py-4 border-t border-slate-50 dark:border-slate-800">
                    <div className="bg-primary/10 h-10 w-10 rounded-xl flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-black text-2xl text-slate-900 dark:text-slate-100 tracking-tighter">
                        {request.contactNumber}
                      </p>
                      <p className="text-xs font-black uppercase tracking-widest text-primary/80">
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
