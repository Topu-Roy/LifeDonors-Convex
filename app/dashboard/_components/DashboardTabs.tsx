"use client";

import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Droplet,
  ExternalLink,
  Heart,
  History,
  MessageSquare,
  Plus,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { RequestCard } from "@/components/RequestCard";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DashboardTabs() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") ?? "requests";

  const myRequests = useQuery(api.requests.getMyRequests);
  const myDonations = useQuery(api.donations.getMyDonations);
  const updateDonationStatus = useMutation(api.donations.updateDonationStatus);
  const withdrawDonation = useMutation(api.donations.withdrawDonation);

  const handleUpdateStatus = async (donationId: Id<"donations">, status: "Donated" | "No Show") => {
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
      toast.error(error instanceof Error ? error.message : "Failed to withdraw");
    }
  };

  return (
    <Tabs defaultValue={defaultTab} className="w-full space-y-8">
      <TabsList className="bg-background h-12 w-full max-w-md rounded-full border p-1 shadow-sm md:h-14">
        <TabsTrigger
          value="requests"
          className="data-[state=active]:bg-primary h-full gap-2 rounded-full px-4 text-xs font-bold transition-all data-[state=active]:text-white md:px-8 md:text-sm"
        >
          <MessageSquare className="h-4 w-4" />
          My Requests
        </TabsTrigger>
        <TabsTrigger
          value="donations"
          className="data-[state=active]:bg-primary h-full gap-2 rounded-full px-4 text-xs font-bold transition-all data-[state=active]:text-white md:px-8 md:text-sm"
        >
          <History className="h-4 w-4" />
          My Donations
        </TabsTrigger>
      </TabsList>

      <TabsContent value="requests" className="space-y-6 focus-visible:outline-none">
        <div className="flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 text-xl font-black tracking-tight md:text-2xl">
            Active Requests
            {myRequests && (
              <Badge variant="secondary" className="rounded-full px-2 py-0 text-[10px]">
                {myRequests.length}
              </Badge>
            )}
          </h2>
          <Link
            href="/requests"
            className={cn(
              buttonVariants({ size: "sm" }),
              "shadow-primary/20 h-10 shrink-0 gap-2 rounded-xl px-4 font-bold shadow-lg"
            )}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Request</span>
            <span className="sm:hidden">New</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myRequests === undefined ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-muted h-64 animate-pulse rounded-3xl border" />
            ))
          ) : (
            <>
              {myRequests.map(request => (
                <RequestCard key={request._id} request={request} isOwner />
              ))}
              {/* Create New Placeholder Card */}
              <Link
                href="/requests"
                className="group border-border hover:border-primary hover:bg-primary/5 flex min-h-[250px] flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed bg-transparent p-6 text-center transition-all"
              >
                <div className="bg-primary/10 text-primary flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110">
                  <Plus className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Create New Request</h3>
                  <p className="text-muted-foreground mt-1 px-4 text-sm">
                    Need blood for a patient? Post a new request here.
                  </p>
                </div>
              </Link>
            </>
          )}
        </div>
      </TabsContent>

      <TabsContent value="donations" className="space-y-6 focus-visible:outline-none">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight">
            My Commitments
            {myDonations && (
              <Badge variant="secondary" className="rounded-full px-2 py-0">
                {myDonations.length}
              </Badge>
            )}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {myDonations === undefined ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-muted h-32 animate-pulse rounded-3xl border" />
            ))
          ) : myDonations.length > 0 ? (
            myDonations.map(donation => (
              <DonationTrackingCard
                key={donation._id}
                donation={donation}
                onMarkDonated={id => handleUpdateStatus(id, "Donated")}
                onWithdraw={handleWithdraw}
              />
            ))
          ) : (
            <Card className="col-span-full rounded-3xl border-dashed p-12 text-center">
              <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
                <Droplet className="text-muted-foreground h-8 w-8" />
              </div>
              <CardTitle className="text-xl font-bold">No donations yet</CardTitle>
              <CardDescription className="mx-auto mt-2 max-w-xs text-base">
                When you volunteer for a blood request, it will appear here for you to track.
              </CardDescription>
              <Link
                href="/requests"
                className={cn(buttonVariants({ variant: "outline" }), "mt-6 rounded-xl font-bold")}
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
    status: "Accepted" | "Rejected" | "Offered" | "Donated" | "No Show" | "Withdrawn" | "Cancelled";
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
