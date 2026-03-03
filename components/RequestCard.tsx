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
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

type RequestCardProps = {
  request: Doc<"requests"> & {
    volunteers?: (Doc<"donations"> & {
      donor?: Doc<"profiles"> | null;
    })[];
  };
  isOwner?: boolean;
};

export function RequestCard({
  request,
  isOwner: isOwnerProp,
}: RequestCardProps) {
  const user = useQuery(api.users.getMyProfile);
  const acceptRequest = useMutation(api.users.acceptRequest);
  const cancelRequest = useMutation(api.users.cancelRequest);

  const isOwner = isOwnerProp ?? user?._id === request.requesterId;

  const urgencyColors = {
    Low: "bg-muted text-muted-foreground",
    Medium: "bg-secondary text-secondary-foreground",
    High: "bg-primary/20 text-primary border-primary/30",
    Critical: "bg-destructive text-destructive-foreground animate-pulse",
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

  const acceptedCount =
    request.volunteers?.filter(
      (v) => v.status === "Accepted" || v.status === "Donated",
    ).length || 0;

  return (
    <Card
      className={cn(
        "overflow-hidden border-l-4 shadow-sm hover:shadow-md transition-shadow",
        request.status === "Cancelled"
          ? "border-l-muted-foreground/30 opacity-75"
          : "border-l-primary",
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold flex flex-col tracking-tight">
            <div className="flex items-center gap-2">
              <span className="text-primary">{request.bloodTypeNeeded}</span>
              <span>Blood Needed</span>
            </div>
            <span className="text-xs font-normal text-muted-foreground mt-1">
              Goal: {request.numberOfBags} bag
              {request.numberOfBags > 1 ? "s" : ""}
              {isOwner && ` (${acceptedCount} secured)`}
            </span>
          </CardTitle>
          <Badge className={urgencyColors[request.urgency]} variant="secondary">
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
              <span className="text-[10px] italic text-muted-foreground mt-0.5">
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
          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-primary">
                {request.volunteers.length} volunteer
                {request.volunteers.length > 1 ? "s" : ""}
              </span>
              <Badge variant="outline" className="text-[10px] h-4 px-1">
                {acceptedCount} secured
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Manage volunteers on the review page.
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
          <Button onClick={handleAccept} className="w-full font-bold">
            Volunteer Blood
          </Button>
        )}

        {isOwner && (
          <div className="w-full space-y-2 pt-2 border-t">
            <div className="flex gap-2">
              <Link
                href={`/requests/${request._id}`}
                className={cn(buttonVariants(), "w-full font-bold")}
              >
                Review Request
              </Link>
            </div>

            {request.status === "Open" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="w-full text-destructive border-destructive/20 hover:bg-destructive/5 text-[10px] h-7"
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
