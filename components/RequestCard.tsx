"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  User,
  Clock,
  Hospital,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { type Doc } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

type RequestCardProps = {
  request: Doc<"requests"> & {
    volunteers?: (Doc<"donations"> & {
      donor?: Doc<"profiles"> | null;
    })[];
  };
  isOwner?: boolean;
};

function timeAgo(date: number) {
  const seconds = Math.floor((Date.now() - date) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function RequestCard({
  request,
  isOwner: isOwnerProp,
}: RequestCardProps) {
  const user = useQuery(api.users.getMyProfile);
  const acceptRequest = useMutation(api.users.acceptRequest);

  const isOwner = isOwnerProp ?? user?._id === request.requesterId;

  const handleAccept = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await acceptRequest({ requestId: request._id });
      toast.success("You have volunteered to help!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to volunteer");
    }
  };

  const urgencyStyles = {
    Low: "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
    Medium:
      "border-orange-200 dark:border-orange-900/50 bg-white dark:bg-slate-900",
    High: "border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-900",
    Critical:
      "border-red-400 dark:border-red-800 bg-red-50/30 dark:bg-red-950/20",
  };

  const urgencyBadgeStyles = {
    Low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    Medium:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
    High: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
    Critical: "bg-red-600 text-white animate-pulse",
  };

  return (
    <div
      className={cn(
        "flex flex-col rounded-3xl border-2 p-1 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden group",
        urgencyStyles[request.urgency],
      )}
    >
      <div className="p-6 flex flex-col h-full gap-6">
        {/* Card Top: Blood Type & Urgency */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-3xl font-black text-2xl shadow-inner",
                request.urgency === "Critical" || request.urgency === "High"
                  ? "bg-red-600 text-white shadow-red-900/20"
                  : "bg-primary text-slate-900 shadow-primary-900/10",
              )}
            >
              {request.bloodTypeNeeded}
            </div>
            <div>
              <Badge
                className={cn(
                  "rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border-none mb-1.5",
                  urgencyBadgeStyles[request.urgency],
                )}
              >
                {request.urgency}
              </Badge>
              <p className="font-bold text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-primary" />
                {request.numberOfBags}{" "}
                {request.numberOfBags > 1 ? "Bags" : "Bag"} Needed
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/50 px-3 py-1 rounded-full uppercase tracking-tighter">
            {timeAgo(request.createdAt)}
          </span>
        </div>

        {/* Card Body: Details */}
        <div className="flex-1 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 shrink-0">
              <Hospital className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-black text-slate-900 dark:text-slate-100 truncate text-lg tracking-tight">
                {request.hospitalName}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium truncate flex items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0" />
                {request.hospitalLocation}, {request.district}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <User className="h-4 w-4 text-primary shrink-0" />
              <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 truncate">
                {request.patientName}
              </p>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <Clock className="h-4 w-4 text-primary shrink-0" />
              <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 truncate">
                By{" "}
                {new Date(request.createdAt + 86400000).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Card Action */}
        <div className="pt-2">
          {isOwner ? (
            <Link
              href={`/requests/${request._id}`}
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full h-14 rounded-2xl font-black text-base shadow-lg shadow-primary/20 gap-2 transition-all hover:scale-[1.02] active:scale-95 bg-primary text-slate-900 group",
              )}
            >
              Review Request
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <div className="flex gap-2">
              <Link
                href={`/requests/${request._id}`}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "flex-1 h-14 rounded-2xl font-bold border-primary/20 hover:bg-primary/5 text-slate-600 dark:text-slate-300",
                )}
              >
                Details
              </Link>
              <Button
                onClick={handleAccept}
                className={cn(
                  "flex-2 h-14 rounded-2xl font-black text-base shadow-lg shadow-primary/20 gap-2 transition-all hover:scale-[1.02] active:scale-95 bg-primary text-slate-900",
                )}
              >
                Volunteer Now
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
