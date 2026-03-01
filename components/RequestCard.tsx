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
  request: Doc<"requests">;
  isOwner?: boolean;
}

export function RequestCard({ request, isOwner }: RequestCardProps) {
  const acceptRequest = useMutation(api.users.acceptRequest);

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
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to accept request",
      );
    }
  };

  return (
    <Card className="overflow-hidden border-l-4 border-l-red-600 shadow-md hover:shadow-lg transition-shadow">
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
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
          <Clock className="h-3 w-3" />
          <span>
            Requested {new Date(request.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        {!isOwner && request.status === "Open" && (
          <Button
            onClick={handleAccept}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Accept Request
          </Button>
        )}
        {isOwner && (
          <Badge variant="outline" className="w-full justify-center py-1">
            Status: {request.status}
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
