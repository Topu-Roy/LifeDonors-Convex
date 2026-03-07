"use client";

import { ImpactCard } from "@/app/_components/HomeImpactCard";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Activity, AlertCircle, ArrowRight, Droplet, Heart, Users } from "lucide-react";
import Link from "next/link";
import { RequestCard } from "@/components/RequestCard";

export function HomeRequests() {
  const requests = useQuery(api.requests.getAllRequests, {});

  return (
    <>
      {/* Live Impact Stats */}
      <div className="bg-background border-border grid grid-cols-1 gap-4 rounded-2xl border p-6 shadow-xl md:grid-cols-3">
        <ImpactCard
          icon={<Heart className="h-6 w-6" />}
          label="Lives Saved"
          value="12,450+"
          color="text-primary"
          bgColor="bg-primary/5"
          borderColor="border-primary/10"
        />
        <ImpactCard
          icon={<Users className="h-6 w-6" />}
          label="Active Donors"
          value="8,200+"
          color="text-blue-500"
          bgColor="bg-blue-500/5"
          borderColor="border-blue-100"
        />
        <ImpactCard
          icon={<Activity className="h-6 w-6" />}
          label="Urgent Requests"
          value={requests?.length.toString() ?? "34"}
          color="text-orange-500"
          bgColor="bg-orange-500/5"
          borderColor="border-orange-100"
        />
      </div>

      {/* Urgent Needs Section Content */}
      <div className="mt-12 flex w-full flex-col gap-6 lg:w-2/3">
        <div className="border-border flex flex-col justify-between gap-4 border-b pb-2 sm:flex-row sm:items-center">
          <h2 className="flex items-center gap-2 text-xl font-black tracking-tight md:text-2xl">
            <AlertCircle className="text-primary h-6 w-6" />
            Urgent Needs
          </h2>
          <Link
            href="/requests"
            className="text-primary flex w-fit items-center gap-1 text-sm font-bold hover:underline"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {requests === undefined ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-muted/50 h-40 animate-pulse rounded-2xl border" />
            ))
          ) : requests.length > 0 ? (
            requests.slice(0, 3).map(request => <RequestCard key={request._id} request={request} />)
          ) : (
            <div className="bg-muted/20 border-border rounded-2xl border border-dashed py-20 text-center opacity-60">
              <Droplet className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground font-medium">No open blood requests at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
