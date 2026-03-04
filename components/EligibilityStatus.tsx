"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function EligibilityStatus() {
  const eligibility = useQuery(api.users.checkEligibility);
  const profile = useQuery(api.users.getMyProfile);

  if (eligibility === undefined || profile === undefined) {
    return (
      <Card className="w-full animate-pulse bg-muted/50">
        <div className="h-32 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="border-dashed border-border bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Become a Donor</CardTitle>
          <CardDescription>
            Complete your profile to check if you&apos;re eligible to donate
            life.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/profile"
            className={cn(buttonVariants({ variant: "default" }), "w-full")}
          >
            Complete Profile
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "rounded-3xl",
        eligibility.eligible
          ? "border-primary/20 bg-primary/5"
          : "border-border bg-muted/30",
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {eligibility.eligible ? (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          ) : (
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
          )}
          {eligibility.eligible ? "You are Eligible!" : "Not Eligible Yet"}
        </CardTitle>
        <CardDescription>
          {eligibility.eligible
            ? "Your health profile meets the requirements for blood donation."
            : eligibility.reason}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {eligibility.eligible ? (
          <Link
            href="/requests"
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            View Urgent Requests
          </Link>
        ) : (
          <Link
            href="/profile"
            className={cn(
              buttonVariants({ variant: "link" }),
              "w-full text-muted-foreground",
            )}
          >
            Update Profile Info
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
