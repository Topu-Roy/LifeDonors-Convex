"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { AlertCircle, History, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export function DetailedHealthInfo() {
  const profile = useQuery(api.users.getMyProfile);

  if (!profile) return <Spinner />;

  return (
    <>
      <div className="space-y-6 lg:col-span-2">
        <h3 className="flex items-center gap-2 text-xl font-black tracking-tight">
          <History className="text-primary h-5 w-5" />
          Health & Vital Details
        </h3>

        <Card className="border-border bg-background overflow-hidden rounded-3xl shadow-sm">
          <div className="grid grid-cols-1 divide-y border-b md:grid-cols-2 md:divide-x md:divide-y-0">
            <div className="p-6">
              <p className="text-muted-foreground mb-1 text-xs font-bold tracking-widest uppercase">
                Last Donation Date
              </p>
              <p className="text-lg font-bold">
                {profile.lastDonationDate
                  ? new Date(profile.lastDonationDate).toLocaleDateString(undefined, {
                      dateStyle: "long",
                    })
                  : "No record yet"}
              </p>
            </div>
            <div className="p-6">
              <p className="text-muted-foreground mb-1 text-xs font-bold tracking-widest uppercase">
                Contact Phone
              </p>
              <p className="text-lg font-bold">{profile.phoneNumber}</p>
            </div>
          </div>
          <div className="bg-muted/30 p-6">
            <div className="flex items-start gap-3">
              <div className="bg-background rounded-xl border p-2 shadow-sm">
                <Info className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="text-foreground text-sm font-bold">Donor Information Accuracy</p>
                <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                  Your information is used to match you with urgent needs safely. Keep it updated to ensure the
                  best care for patients and yourself.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <h3 className="flex items-center gap-2 text-xl font-black tracking-tight">
          <AlertCircle className="text-primary h-5 w-5" />
          Conditions
        </h3>
        <div className="flex flex-wrap gap-2">
          {profile.diseases && profile.diseases.length > 0 ? (
            profile.diseases.map((d: string) => (
              <Badge
                key={d}
                variant="secondary"
                className="bg-muted/80 border-border rounded-xl border px-4 py-2 text-sm font-bold"
              >
                {d}
              </Badge>
            ))
          ) : (
            <div className="w-full rounded-3xl border border-dashed p-6 text-center">
              <p className="text-muted-foreground text-sm font-medium italic">No medical conditions reported.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
