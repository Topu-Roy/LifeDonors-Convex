"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RequestCard } from "@/components/RequestCard";
import { EligibilityStatus } from "@/components/EligibilityStatus";
import { Button } from "@/components/ui/button";
import { Droplet, Heart, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const requests = useQuery(api.users.getAllRequests, {});

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Hero Section */}
      <section className="relative bg-red-600 text-white py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              Give Blood, <br />
              <span className="text-red-200">Save a Life Today.</span>
            </h1>
            <p className="text-lg md:text-xl text-red-50 mb-8 leading-relaxed">
              Every drop counts. Join our community of life-savers and help
              those in urgent need of blood across the city.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-white text-red-600 hover:bg-red-50 font-bold border-none"
              >
                <Link href="/requests">View Urgent Requests</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-bold"
              >
                <Link href="/profile">Become a Donor</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Abstract background shape */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-red-700/50 -skew-x-12 translate-x-1/4" />
      </section>

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Eligibility and Stats */}
        <div className="lg:col-span-1 space-y-8">
          <EligibilityStatus />

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-6">
            <h3 className="font-bold text-slate-900 border-b pb-2">
              Why Donate?
            </h3>
            <div className="flex gap-4">
              <div className="bg-red-100 p-2 rounded-lg shrink-0">
                <Heart className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Save Lives</h4>
                <p className="text-xs text-muted-foreground">
                  One donation can save up to three people.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-emerald-100 p-2 rounded-lg shrink-0">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Free Health Check</h4>
                <p className="text-xs text-muted-foreground">
                  Every donation includes a basic health screening.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Community</h4>
                <p className="text-xs text-muted-foreground">
                  Join a network of thousands of local heroes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Urgent Requests */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Droplet className="h-6 w-6 text-red-600" />
              Urgent Requests
            </h2>
            <Link
              href="/requests"
              className="text-sm font-medium text-red-600 hover:underline"
            >
              See All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests === undefined ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-muted animate-pulse rounded-xl"
                />
              ))
            ) : requests.length > 0 ? (
              requests
                .slice(0, 4)
                .map((request) => (
                  <RequestCard key={request._id} request={request} />
                ))
            ) : (
              <div className="col-span-2 py-12 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                <p className="text-muted-foreground">
                  No open blood requests at the moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
