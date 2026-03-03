"use client";

import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Phone,
  User,
  Clock,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function RequestDetails({ requestId }: { requestId: Id<"requests"> }) {
  const router = useRouter();

  const request = useQuery(api.users.getRequestById, { requestId });
  const selectDonor = useMutation(api.users.selectDonor);
  const rejectDonor = useMutation(api.users.rejectDonor);
  const updateDonationStatus = useMutation(api.users.updateDonationStatus);
  const cancelRequest = useMutation(api.users.cancelRequest);

  if (request === undefined) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse space-y-6">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-64 w-full bg-muted rounded-xl" />
        <div className="h-96 w-full bg-muted rounded-xl" />
      </div>
    );
  }

  if (request === null) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Request Not Found</h1>
        <p className="text-muted-foreground">
          This request doesn&apos;t exist or you don&apos;t have permission to
          view it.
        </p>
        <Link
          href="/requests"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Back to Requests
        </Link>
      </div>
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
        await rejectDonor({ donationId });
        toast.success("Donor rejected");
      }
    } catch {
      toast.error("Failed to reject donor");
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

  const urgencyColors = {
    Low: "bg-muted text-muted-foreground",
    Medium: "bg-secondary text-secondary-foreground",
    High: "bg-primary/20 text-primary border-primary/30",
    Critical: "bg-destructive text-destructive-foreground animate-pulse",
  };
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      <Link
        href="/requests"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to All Requests
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black tracking-tight">
              {request.bloodTypeNeeded} Needed
            </h1>
            <Badge className={urgencyColors[request.urgency]}>
              {request.urgency}
            </Badge>
            <Badge
              variant={request.status === "Completed" ? "default" : "outline"}
              className={cn(
                request.status === "Completed" &&
                  "bg-green-500 hover:bg-green-600",
                request.status === "Cancelled" &&
                  "bg-destructive/10 text-destructive",
              )}
            >
              {request.status}
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground">
            Patient:{" "}
            <span className="text-foreground font-semibold">
              {request.patientName}
            </span>
          </p>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Requested on {new Date(request.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              Volunteers
              <Badge variant="secondary" className="rounded-full">
                {request.volunteers.length}
              </Badge>
            </h2>

            {request.volunteers.length === 0 ? (
              <div className="py-12 text-center rounded-xl border-2 border-dashed border-border bg-muted/20">
                <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground font-medium">
                  No volunteers yet.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Once someone offers to help, they will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {request.volunteers.map((v) => (
                  <Card
                    key={v._id}
                    className={cn(
                      "overflow-hidden transition-all",
                      v.status === "Accepted" || v.status === "Donated"
                        ? "border-primary/50 shadow-md"
                        : "border-border",
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">
                              {v.donor?.phoneNumber || "Private Donor"}
                            </span>
                            <Badge
                              variant={
                                v.status === "Donated"
                                  ? "default"
                                  : v.status === "Accepted"
                                    ? "secondary"
                                    : v.status === "Offered"
                                      ? "outline"
                                      : "ghost"
                              }
                              className={cn(
                                v.status === "Donated" && "bg-green-500",
                                v.status === "Accepted" &&
                                  "bg-primary/20 text-primary border-primary/30",
                              )}
                            >
                              {v.status}
                            </Badge>
                          </div>
                          {v.donor && (
                            <p className="text-xs text-muted-foreground">
                              {v.donor.division &&
                                `${v.donor.subDistrict}, ${v.donor.district}`}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {v.status === "Offered" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleSelectDonor(v._id)}
                              >
                                Select Donor
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => handleRejectDonor(v._id)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {v.status === "Accepted" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleUpdateStatus(v._id, "Donated")
                                }
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Mark Donated
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive border-destructive/20 hover:bg-destructive/5"
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

          {request.status !== "Cancelled" && request.status !== "Completed" && (
            <div className="pt-8 border-t">
              <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-widest mb-4">
                Danger Zone
              </h3>
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-destructive">
                      Cancel this blood request
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This will cancel all volunteer commitments and mark the
                      request as inactive.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleCancelRequest}
                  >
                    Cancel Request
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">
                Fulfillment Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>Progress</span>
                  <span>
                    {securedBags} / {request.numberOfBags} bags
                  </span>
                </div>
                <div className="h-4 w-full bg-muted rounded-full overflow-hidden border">
                  <div
                    className={cn(
                      "h-full transition-all duration-500 ease-in-out",
                      donatedBags === request.numberOfBags
                        ? "bg-green-500"
                        : "bg-primary",
                    )}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground italic">
                  <span>{donatedBags} donated</span>
                  <span>{securedBags - donatedBags} committed</span>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="h-4 w-4 mt-1 text-primary shrink-0" />
                  <div>
                    <p className="font-bold">{request.hospitalName}</p>
                    <p className="text-muted-foreground text-xs">
                      {request.hospitalLocation}
                    </p>
                    <p className="text-[10px] italic text-muted-foreground mt-1">
                      {request.subDistrict}, {request.district},{" "}
                      {request.division}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <p className="font-bold">{request.contactNumber}</p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-primary shrink-0" />
                  <p className="font-medium text-xs">
                    Requester ID: {request.requesterId.substring(0, 8)}...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
