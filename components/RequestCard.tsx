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
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface RequestCardProps {
  request: Doc<"requests"> & {
    donation?: Doc<"donations">;
    donor?: Doc<"profiles"> | null;
  };
  isOwner?: boolean;
}

export function RequestCard({ request, isOwner }: RequestCardProps) {
  const acceptRequest = useMutation(api.users.acceptRequest);
  const cancelRequest = useMutation(api.users.cancelRequest);
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
      toast.success("Request accepted successfully!");
    } catch {
      toast.error("Failed to accept request");
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

  const handleRejectDonor = async () => {
    if (!request.donation) return;
    try {
      if (confirm("Reject this donor and open the request again?")) {
        await rejectDonor({ donationId: request.donation._id });
        toast.success("Donor rejected. Request is open again.");
      }
    } catch {
      toast.error("Failed to reject donor");
    }
  };

  const handleUpdateStatus = async (status: "Donated" | "No Show") => {
    if (!request.donation) return;
    try {
      await updateDonationStatus({ donationId: request.donation._id, status });
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <Card
      className={`overflow-hidden border-l-4 ${request.status === "Cancelled" ? "border-l-slate-400 opacity-75" : "border-l-red-600"} shadow-md hover:shadow-lg transition-shadow`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <span className="text-red-600">{request.bloodTypeNeeded}</span>{" "}
            Blood Needed
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
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>
            {request.hospitalName}, {request.hospitalLocation}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>Contact: {request.contactNumber}</span>
        </div>

        {isOwner && request.status === "Accepted" && request.donor && (
          <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-800 mb-1 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Donor Committed
            </p>
            <p className="text-sm font-medium">{request.donor.phoneNumber}</p>
            <p className="text-[10px] text-emerald-600 italic">
              Call the donor to coordinate.
            </p>
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
            Accept Request
          </Button>
        )}

        {isOwner && (
          <div className="w-full space-y-2">
            <div className="flex justify-between items-center w-full">
              <Badge
                variant={request.status === "Open" ? "outline" : "default"}
                className={`w-full justify-center py-1 ${request.status === "Accepted" ? "bg-emerald-100 text-emerald-800" : ""}`}
              >
                Status: {request.status}
              </Badge>
            </div>

            {request.status === "Open" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
              >
                Cancel Request
              </Button>
            )}

            {request.status === "Accepted" && (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 col-span-2 font-bold"
                  onClick={() => handleUpdateStatus("Donated")}
                >
                  Confirm Donation Received
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200"
                  onClick={() => handleUpdateStatus("No Show")}
                >
                  Donor No-Show
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-slate-600"
                  onClick={handleRejectDonor}
                >
                  Reject Donor
                </Button>
              </div>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

// Internal icons since RequestCard doesn't import them all
import { CheckCircle2 } from "lucide-react";
