"use client";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { RequestCard } from "@/components/RequestCard";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";

export function RequestTab() {
  const {
    results: myRequests,
    status: myRequestsStatus,
    loadMore: loadMoreRequests,
  } = usePaginatedQuery(api.requests.getPaginatedMyRequests, {}, { initialNumItems: 6 });

  return (
    <>
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
          href="/requests/new"
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
        {myRequestsStatus === "LoadingFirstPage" ? (
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
              href="/requests/new"
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

      {myRequestsStatus === "CanLoadMore" && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => loadMoreRequests(6)}
            variant="outline"
            className="border-primary/20 hover:bg-primary/5 h-12 rounded-full px-10 font-bold transition-all"
          >
            Load More Requests
          </Button>
        </div>
      )}
    </>
  );
}
