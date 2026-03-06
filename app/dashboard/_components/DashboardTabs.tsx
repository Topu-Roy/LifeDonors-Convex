"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RequestCard } from "@/components/RequestCard";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Plus,
  History,
  MessageSquare,
  Droplet,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import { type Id } from "@/convex/_generated/dataModel";
import Link from "next/link";

export function DashboardTabs() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") ?? "requests";

  const myRequests = useQuery(api.users.getMyRequests);
  const myDonations = useQuery(api.users.getMyDonations);
  const updateDonationStatus = useMutation(api.users.updateDonationStatus);
  const withdrawDonation = useMutation(api.users.withdrawDonation);

  const handleUpdateStatus = async (
    donationId: Id<"donations">,
    status: "Donated" | "No Show",
  ) => {
    try {
      await updateDonationStatus({ donationId, status });
      toast.success(`Donation marked as ${status}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update");
    }
  };

  const handleWithdraw = async (donationId: Id<"donations">) => {
    try {
      if (confirm("Are you sure you want to withdraw your commitment?")) {
        await withdrawDonation({ donationId });
        toast.success("Commitment withdrawn");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to withdraw",
      );
    }
  };

  return (
    <Tabs defaultValue={defaultTab} className="w-full space-y-8">
      <TabsList className="bg-background border p-1 h-12 md:h-14 rounded-full w-full max-w-md shadow-sm">
        <TabsTrigger
          value="requests"
          className="rounded-full px-4 md:px-8 h-full font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2 text-xs md:text-sm"
        >
          <MessageSquare className="h-4 w-4" />
          My Requests
        </TabsTrigger>
        <TabsTrigger
          value="donations"
          className="rounded-full px-4 md:px-8 h-full font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2 text-xs md:text-sm"
        >
          <History className="h-4 w-4" />
          My Donations
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="requests"
        className="space-y-6 focus-visible:outline-none"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
            Active Requests
            {myRequests && (
              <Badge
                variant="secondary"
                className="rounded-full px-2 py-0 text-[10px]"
              >
                {myRequests.length}
              </Badge>
            )}
          </h2>
          <Link
            href="/requests"
            className={cn(
              buttonVariants({ size: "sm" }),
              "font-bold rounded-xl shadow-lg shadow-primary/20 gap-2 shrink-0 h-10 px-4",
            )}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Request</span>
            <span className="sm:hidden">New</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myRequests === undefined ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-64 bg-muted animate-pulse rounded-3xl border"
              />
            ))
          ) : (
            <>
              {myRequests.map((request) => (
                <RequestCard key={request._id} request={request} isOwner />
              ))}
              {/* Create New Placeholder Card */}
              <Link
                href="/requests"
                className="group flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-border bg-transparent p-6 hover:border-primary hover:bg-primary/5 transition-all text-center min-h-[250px]"
              >
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Plus className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Create New Request</h3>
                  <p className="text-sm text-muted-foreground mt-1 px-4">
                    Need blood for a patient? Post a new request here.
                  </p>
                </div>
              </Link>
            </>
          )}
        </div>
      </TabsContent>

      <TabsContent
        value="donations"
        className="space-y-6 focus-visible:outline-none"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            My Commitments
            {myDonations && (
              <Badge variant="secondary" className="rounded-full px-2 py-0">
                {myDonations.length}
              </Badge>
            )}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {myDonations === undefined ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-32 bg-muted animate-pulse rounded-3xl border"
              />
            ))
          ) : myDonations.length > 0 ? (
            myDonations.map((donation) => (
              <DonationTrackingCard
                key={donation._id}
                donation={donation}
                onMarkDonated={(id) => handleUpdateStatus(id, "Donated")}
                onWithdraw={handleWithdraw}
              />
            ))
          ) : (
            <Card className="col-span-full border-dashed p-12 text-center rounded-3xl">
              <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Droplet className="h-8 w-8 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl font-bold">
                No donations yet
              </CardTitle>
              <CardDescription className="max-w-xs mx-auto mt-2 text-base">
                When you volunteer for a blood request, it will appear here for
                you to track.
              </CardDescription>
              <Link
                href="/requests"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "mt-6 font-bold rounded-xl",
                )}
              >
                Find Requests
              </Link>
            </Card>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}

function DonationTrackingCard({
  donation,
  onMarkDonated,
  onWithdraw,
}: {
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
    status:
      | "Accepted"
      | "Rejected"
      | "Offered"
      | "Donated"
      | "No Show"
      | "Withdrawn"
      | "Cancelled";
    donorId: string;
    requestId: Id<"requests">;
  };
  onMarkDonated: (id: Id<"donations">) => void;
  onWithdraw: (id: Id<"donations">) => void;
}) {
  const statusConfig = {
    Offered: { color: "bg-blue-100 text-blue-700", icon: Clock },
    Accepted: { color: "bg-green-100 text-green-700", icon: CheckCircle2 },
    Donated: { color: "bg-primary/20 text-primary", icon: Heart },
    Rejected: { color: "bg-muted text-muted-foreground", icon: XCircle },
    Withdrawn: { color: "bg-destructive/10 text-destructive", icon: XCircle },
    "No Show": { color: "bg-destructive/10 text-destructive", icon: XCircle },
  };

  const config =
    statusConfig[donation.status as keyof typeof statusConfig] ||
    statusConfig.Offered;
  const StatusIcon = config.icon;

  return (
    <Card className="overflow-hidden border group hover:shadow-md transition-all rounded-3xl">
      <CardContent className="p-0">
        <div className="flex items-center p-5 gap-4">
          <div
            className={cn(
              "size-14 rounded-2xl flex items-center justify-center shrink-0",
              config.color,
            )}
          >
            <StatusIcon className="h-7 w-7" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 overflow-hidden">
              <h4 className="font-black truncate text-lg">
                {donation.request?.bloodTypeNeeded} for{" "}
                {donation.request?.patientName}
              </h4>
              <Badge
                variant="secondary"
                className={cn(
                  "rounded-full font-bold text-[10px] uppercase tracking-wider shrink-0 px-2 py-0",
                  config.color,
                )}
              >
                {donation.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground font-medium truncate">
              {donation.request?.hospitalName}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 font-medium">
                <Calendar className="h-3 w-3" />
                {donation.acceptedAt
                  ? new Date(donation.acceptedAt).toLocaleDateString()
                  : "Pending"}
              </span>
              <Link
                href={`/requests/${donation.requestId}`}
                className="flex items-center gap-1 text-primary hover:underline font-bold"
              >
                <ExternalLink className="h-3 w-3" />
                View Request
              </Link>
            </div>
          </div>
        </div>
        {(donation.status === "Offered" || donation.status === "Accepted") && (
          <div className="flex items-center gap-2 p-3 bg-muted/50 border-t">
            {donation.status === "Accepted" && (
              <Button
                size="sm"
                onClick={() => onMarkDonated(donation._id)}
                className="flex-1 font-bold rounded-xl shadow-lg shadow-primary/20"
              >
                I Have Donated
              </Button>
            )}
            {donation.status === "Offered" && (
              <div className="flex-1 text-xs text-muted-foreground font-medium italic bg-background p-2 rounded-xl border border-dashed flex items-center justify-center gap-2">
                <Clock className="h-3 w-3 animate-spin duration-3000" />
                Waiting for requester to select you...
              </div>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => onWithdraw(donation._id)}
              className="px-4 font-bold border-destructive/20 text-destructive hover:bg-destructive/5 rounded-xl transition-colors"
            >
              Withdraw
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
