"use client";

import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function FulfillmentStatus({ requestId }: { requestId: Id<"requests"> }) {
  const request = useQuery(api.requests.getRequestById, { requestId });

  if (request === undefined || request === null) return null;

  const securedBags = request.volunteers.filter(v => v.status === "Accepted" || v.status === "Donated").length;
  const donatedBags = request.volunteers.filter(v => v.status === "Donated").length;
  const progressPercent = Math.min((securedBags / request.numberOfBags) * 100, 100);

  return (
    <Card className="border-primary/10 shadow-primary/5 rounded-3xl border-2 bg-white p-8 shadow-xl dark:bg-slate-900">
      <div className="space-y-8">
        <div className="space-y-2">
          <h3 className="text-xl font-black tracking-tight">Fulfillment Status</h3>
          <p className="text-xs font-bold tracking-widest text-slate-400 uppercase italic">
            Live Progress Tracking
          </p>
        </div>

        <div className="space-y-5">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <p className="text-primary text-4xl font-black">{securedBags}</p>
              <p className="text-[10px] font-black tracking-tighter text-slate-400 uppercase">Bags Secured</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-2xl font-black text-slate-300 dark:text-slate-700">/ {request.numberOfBags}</p>
              <p className="text-[10px] font-black tracking-tighter text-slate-400 uppercase">Target</p>
            </div>
          </div>

          <div className="h-6 w-full overflow-hidden rounded-full border-2 border-slate-50 bg-slate-100 p-1.5 shadow-inner dark:border-slate-800 dark:bg-slate-800">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000 ease-out",
                donatedBags === request.numberOfBags
                  ? "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                  : "bg-primary shadow-[0_0_20px_rgba(43,238,108,0.3)]"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] font-black tracking-widest uppercase">
            <span className="text-green-600">{donatedBags} Donated</span>
            <span className="text-primary">{securedBags - donatedBags} Committed</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
