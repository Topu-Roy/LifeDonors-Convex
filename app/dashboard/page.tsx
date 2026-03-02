"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RequestCard } from "@/components/RequestCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  History,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { Doc, Id } from "@/convex/_generated/dataModel";

export default function DashboardPage() {
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
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update status");
      }
    }
  };

  const handleWithdraw = async (donationId: Id<"donations">) => {
    try {
      if (confirm("Are you sure you want to withdraw your commitment?")) {
        await withdrawDonation({ donationId });
        toast.success("Engagement withdrawn");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to withdraw",
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8 text-red-600" />
            My Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your blood requests and donation history.
          </p>
        </div>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="requests" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            My Requests
          </TabsTrigger>
          <TabsTrigger value="donations" className="gap-2">
            <History className="h-4 w-4" />
            My Donations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myRequests === undefined ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-muted animate-pulse rounded-xl"
                />
              ))
            ) : myRequests && myRequests.length > 0 ? (
              myRequests.map(
                (
                  request: Doc<"requests"> & {
                    volunteers?: (Doc<"donations"> & {
                      donor?: Doc<"profiles"> | null;
                    })[];
                  },
                ) => (
                  <RequestCard key={request._id} request={request} isOwner />
                ),
              )
            ) : (
              <Card className="col-span-full border-dashed">
                <CardHeader className="text-center py-12">
                  <CardTitle className="text-muted-foreground font-medium">
                    No requests yet
                  </CardTitle>
                  <CardDescription>
                    When you post a blood request, it will appear here.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="donations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myDonations === undefined ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-muted animate-pulse rounded-xl"
                />
              ))
            ) : myDonations.length > 0 ? (
              myDonations.map((donation) => (
                <Card
                  key={donation._id}
                  className={`overflow-hidden border-l-4 ${
                    donation.status === "Donated"
                      ? "border-l-emerald-500"
                      : donation.status === "Accepted"
                        ? "border-l-blue-500"
                        : donation.status === "Offered"
                          ? "border-l-amber-500"
                          : "border-l-slate-400 opacity-75"
                  } shadow-sm transition-all hover:shadow-md`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <span className="text-red-600">
                          {donation.request?.bloodTypeNeeded}
                        </span>{" "}
                        Donation
                      </CardTitle>
                      <Badge
                        variant={
                          donation.status === "Donated" ? "default" : "outline"
                        }
                        className={
                          donation.status === "Donated"
                            ? "bg-emerald-100 text-emerald-800"
                            : donation.status === "Accepted"
                              ? "bg-blue-100 text-blue-800"
                              : donation.status === "Offered"
                                ? "bg-amber-100 text-amber-800 animate-pulse"
                                : ""
                        }
                      >
                        {donation.status === "Rejected"
                          ? "Fulfilled"
                          : donation.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Patient:{" "}
                      <span className="text-foreground font-medium">
                        {donation.request?.patientName || "Unknown"}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Hospital:{" "}
                      <span className="text-foreground font-medium">
                        {donation.request?.hospitalName || "Unknown"}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                      <Clock className="h-3 w-3" />
                      Accepted on{" "}
                      {donation.acceptedAt
                        ? new Date(donation.acceptedAt).toLocaleDateString()
                        : "--"}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2 bg-slate-50/50 flex flex-col gap-2">
                    {(donation.status === "Offered" ||
                      donation.status === "Accepted") && (
                      <div className="flex gap-2 w-full">
                        {donation.status === "Accepted" && (
                          <Button
                            onClick={() =>
                              handleUpdateStatus(donation._id, "Donated")
                            }
                            size="sm"
                            className="flex-2 bg-emerald-600 hover:bg-emerald-700 font-bold"
                          >
                            I Have Donated
                          </Button>
                        )}
                        {donation.status === "Offered" && (
                          <div className="flex-1 text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-100 italic">
                            Waiting for requester to select you...
                          </div>
                        )}
                        <Button
                          onClick={() => handleWithdraw(donation._id)}
                          size="sm"
                          variant="outline"
                          className="flex-1 text-slate-600 border-slate-200"
                        >
                          Withdraw
                        </Button>
                      </div>
                    )}
                    {donation.status === "Donated" && (
                      <div className="w-full flex items-center justify-center gap-2 py-1 text-emerald-600 font-medium text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        Thank you for your life-saving gift!
                      </div>
                    )}
                    {donation.status === "Withdrawn" && (
                      <div className="w-full flex items-center justify-center gap-2 py-1 text-slate-500 font-medium text-sm italic">
                        Commitment Withdrawn
                      </div>
                    )}
                    {donation.status === "Rejected" && (
                      <div className="w-full text-center py-2 text-slate-500 text-xs italic px-4">
                        Thank you for your willingness to help! This request has
                        been fulfilled by other donors.
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card className="col-span-full border-dashed text-center py-12">
                <CardHeader>
                  <CardTitle className="text-muted-foreground font-medium">
                    No donations accepted yet
                  </CardTitle>
                  <CardDescription>
                    When you accept a blood request, it will appear here for you
                    to track.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper to avoid build component issues with CardFooter
function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center p-6 pt-0 ${className}`}>{children}</div>
  );
}
