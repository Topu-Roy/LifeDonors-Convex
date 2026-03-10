"use client";

import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { useMutation, usePaginatedQuery } from "convex/react";
import { Droplet } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { DonationTrackingCard } from "./donationTrackingCard";

export function DonationTab() {
  const {
    results: myDonations,
    status: myDonationsStatus,
    loadMore: loadMoreDonations,
  } = usePaginatedQuery(api.donations.getPaginatedMyDonations, {}, { initialNumItems: 6 });
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
    <>
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
        {myDonationsStatus === "LoadingFirstPage" ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-muted h-32 animate-pulse rounded-3xl border" />
          ))
        ) : myDonations && myDonations.length > 0 ? (
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

      {myDonationsStatus === "CanLoadMore" && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => loadMoreDonations(6)}
            variant="outline"
            className="border-primary/20 hover:bg-primary/5 h-12 rounded-full px-10 font-bold transition-all"
          >
            Load More Commitments
          </Button>
        </div>
      )}
    </>
  );
}
