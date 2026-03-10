import { type Id } from "@/convex/_generated/dataModel";
import { Calendar, CheckCircle2, Clock, ExternalLink, Heart, XCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  donation: {
    request: {
      _id: Id<"requests">;
      _creationTime: number;
      division?: string | undefined;
      district?: string | undefined;
      subDistrict?: string | undefined;
      phoneNumber: string;
      requesterId: Id<"profiles">;
      patientName: string;
      hospitalName: string;
      hospitalLocation: string;
      bloodTypeNeeded: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
      urgency: "Low" | "Medium" | "High" | "Critical";
      status: "Open" | "Accepted" | "Completed" | "Cancelled";
      contactNumber: string;
      numberOfBags: number;
      createdAt: number;
    } | null;
    _id: Id<"donations">;
    _creationTime: number;
    acceptedAt?: number | undefined;
    status: "Accepted" | "Rejected" | "Offered" | "Donated" | "No Show" | "Withdrawn" | "Cancelled";
    donorId: string;
    requestId: Id<"requests">;
  };
  onMarkDonated: (id: Id<"donations">) => void;
  onWithdraw: (id: Id<"donations">) => void;
};

export function DonationTrackingCard({ donation, onMarkDonated, onWithdraw }: Props) {
  const statusConfig = {
    Offered: { color: "bg-blue-100 text-blue-700", icon: Clock },
    Accepted: { color: "bg-green-100 text-green-700", icon: CheckCircle2 },
    Donated: { color: "bg-primary/20 text-primary", icon: Heart },
    Rejected: { color: "bg-muted text-muted-foreground", icon: XCircle },
    Withdrawn: { color: "bg-destructive/10 text-destructive", icon: XCircle },
    "No Show": { color: "bg-destructive/10 text-destructive", icon: XCircle },
  };

  const config = statusConfig[donation.status as keyof typeof statusConfig] || statusConfig.Offered;
  const StatusIcon = config.icon;

  return (
    <Card className="group overflow-hidden rounded-3xl border transition-all hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex items-center gap-4 p-5">
          <div className={cn("flex size-14 shrink-0 items-center justify-center rounded-2xl", config.color)}>
            <StatusIcon className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2 overflow-hidden">
              <h4 className="truncate text-lg font-black">
                {donation.request?.bloodTypeNeeded} for {donation.request?.patientName}
              </h4>
              <Badge
                variant="secondary"
                className={cn(
                  "shrink-0 rounded-full px-2 py-0 text-[10px] font-bold tracking-wider uppercase",
                  config.color
                )}
              >
                {donation.status}
              </Badge>
            </div>
            <p className="text-muted-foreground truncate text-sm font-medium">{donation.request?.hospitalName}</p>
            <div className="text-muted-foreground mt-2 flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1 font-medium">
                <Calendar className="h-3 w-3" />
                {donation.acceptedAt ? new Date(donation.acceptedAt).toLocaleDateString() : "Pending"}
              </span>
              <Link
                href={`/requests/${donation.requestId}`}
                className="text-primary flex items-center gap-1 font-bold hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                View Request
              </Link>
            </div>
          </div>
        </div>
        {(donation.status === "Offered" || donation.status === "Accepted") && (
          <div className="bg-muted/50 flex items-center gap-2 border-t p-3">
            {donation.status === "Accepted" && (
              <Button
                size="sm"
                onClick={() => onMarkDonated(donation._id)}
                className="shadow-primary/20 flex-1 rounded-xl font-bold shadow-lg"
              >
                I Have Donated
              </Button>
            )}
            {donation.status === "Offered" && (
              <div className="text-muted-foreground bg-background flex flex-1 items-center justify-center gap-2 rounded-xl border border-dashed p-2 text-xs font-medium italic">
                <Clock className="h-3 w-3 animate-spin duration-3000" />
                Waiting for requester to select you...
              </div>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => onWithdraw(donation._id)}
              className="border-destructive/20 text-destructive hover:bg-destructive/5 rounded-xl px-4 font-bold transition-colors"
            >
              Withdraw
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
