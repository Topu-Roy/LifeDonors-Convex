"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, User, Clock } from "lucide-react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface RequestCardProps {
  request: Doc<"requests"> & {
    volunteers?: (Doc<"donations"> & {
      donor?: Doc<"profiles"> | null;
    })[];
  };
  isOwner?: boolean;
}

export function RequestCard({ request, isOwner }: RequestCardProps) {
  const acceptRequest = useMutation(api.users.acceptRequest);
  const cancelRequest = useMutation(api.users.cancelRequest);
  const selectDonor = useMutation(api.users.selectDonor);
  const rejectDonor = useMutation(api.users.rejectDonor);
  const updateDonationStatus = useMutation(api.users.updateDonationStatus);

  const urgencyColors = {
    Low: "bg-blue-100 text-blue-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-orange-100 text-orange-800",
    Critical: "bg-red-100 text-red-800 animate-pulse",
  };

  const handleAccept = async () => {
    try {
      await acceptRequest({ requestId: request._id });
      toast.success("You have volunteered to help!");
    } catch {
      toast.error("Failed to volunteer");
    }
  };

  const handleCancel = async () => {
    try {
      if (confirm("Are you sure you want to cancel this request?")) {
        await cancelRequest({ requestId: request._id });
        toast.success("Request cancelled");
      }
    } catch {
      toast.error("Failed to cancel request");
    }
  };

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

  const acceptedCount =
    request.volunteers?.filter(
      (v) => v.status === "Accepted" || v.status === "Donated",
    ).length || 0;

  return (
    <Card
      className={`overflow-hidden border-l-4 ${request.status === "Cancelled" ? "border-l-slate-400 opacity-75" : "border-l-red-600"} shadow-md hover:shadow-lg transition-shadow`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-red-600">{request.bloodTypeNeeded}</span>
              <span>Blood Needed</span>
            </div>
            <span className="text-xs font-normal text-muted-foreground mt-1">
              Goal: {request.numberOfBags} bag
              {request.numberOfBags > 1 ? "s" : ""}
              {isOwner && ` (${acceptedCount} secured)`}
            </span>
          </CardTitle>
          <Badge className={urgencyColors[request.urgency]}>
            {request.urgency}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>
            Patient:{" "}
            <span className="text-foreground font-medium">
              {request.patientName}
            </span>
          </span>
        </div>
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-foreground font-medium">
              {request.hospitalName}
            </span>
            <span>{request.hospitalLocation}</span>
            {request.division && (
              <span className="text-[10px] italic text-slate-500 mt-0.5">
                {request.subDistrict}, {request.district}, {request.division}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>Contact: {request.contactNumber}</span>
        </div>

        {isOwner && request.volunteers && request.volunteers.length > 0 && (
          <div className="mt-4 space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              Volunteers ({request.volunteers.length})
            </h4>
            <div className="space-y-2">
              {request.volunteers.map((v) => (
                <div
                  key={v._id}
                  className={`p-3 rounded-lg border text-sm ${
                    v.status === "Accepted" || v.status === "Donated"
                      ? "bg-emerald-50 border-emerald-100"
                      : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-xs">
                        {v.donor?.phoneNumber || "Anonymous"}
                      </p>
                      <Badge variant="outline" className="text-[10px] h-4 px-1">
                        {v.status}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      {v.status === "Offered" && (
                        <>
                          <Button
                            size="xs"
                            variant="ghost"
                            className="h-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100"
                            onClick={() => handleSelectDonor(v._id)}
                          >
                            Select
                          </Button>
                          <Button
                            size="xs"
                            variant="ghost"
                            className="h-7 text-red-600 hover:bg-red-100"
                            onClick={() => handleRejectDonor(v._id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {v.status === "Accepted" && (
                        <>
                          <Button
                            size="xs"
                            variant="ghost"
                            className="h-7 text-emerald-600 hover:bg-emerald-100"
                            onClick={() => handleUpdateStatus(v._id, "Donated")}
                          >
                            Donated
                          </Button>
                          <Button
                            size="xs"
                            variant="ghost"
                            className="h-7 text-red-600 hover:bg-red-100"
                            onClick={() => handleUpdateStatus(v._id, "No Show")}
                          >
                            NoShow
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  {(v.status === "Accepted" || v.status === "Donated") && (
                    <p className="text-[10px] text-emerald-600 italic">
                      Coordinating for bag fulfillment.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
          <Clock className="h-3 w-3" />
          <span>
            Requested {new Date(request.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex flex-col gap-2">
        {!isOwner && request.status === "Open" && (
          <Button
            onClick={handleAccept}
            className="w-full bg-red-600 hover:bg-red-700 font-bold"
          >
            Volunteer Blood
          </Button>
        )}

        {isOwner && (
          <div className="w-full space-y-2 pt-2 border-t">
            <div className="flex justify-between items-center w-full">
              <Badge
                variant={request.status === "Open" ? "outline" : "default"}
                className={`w-full justify-center py-1 ${request.status === "Accepted" || request.status === "Completed" ? "bg-emerald-100 text-emerald-800" : ""}`}
              >
                Status: {request.status}
              </Badge>
            </div>

            {request.status === "Open" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="w-full text-red-600 border-red-200 hover:bg-red-50 text-xs"
              >
                Cancel Entire Request
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
