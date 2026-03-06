"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RequestCard } from "@/components/RequestCard";
import {
  Droplet,
  AlertCircle,
  ArrowRight,
  Heart,
  Users,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { ImpactCard } from "./HomeImpactCard";

export function HomeRequests() {
  const requests = useQuery(api.requests.getAllRequests, {});

  return (
    <>
      {/* Live Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-background rounded-2xl shadow-xl border border-border">
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
      <div className="flex flex-col gap-6 mt-12 w-full lg:w-2/3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
          <h2 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-primary" />
            Urgent Needs
          </h2>
          <Link
            href="/requests"
            className="text-sm font-bold text-primary hover:underline flex items-center gap-1 w-fit"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {requests === undefined ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-40 bg-muted/50 animate-pulse rounded-2xl border"
              />
            ))
          ) : requests.length > 0 ? (
            requests
              .slice(0, 3)
              .map((request) => (
                <RequestCard key={request._id} request={request} />
              ))
          ) : (
            <div className="py-20 text-center bg-muted/20 rounded-2xl border border-dashed border-border opacity-60">
              <Droplet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-medium">
                No open blood requests at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
