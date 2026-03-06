"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function EligibilityStatus() {
  const eligibility = useQuery(api.users.checkEligibility);
  const profile = useQuery(api.users.getMyProfile);

  if (eligibility === undefined || profile === undefined) {
    return (
      <Card className="bg-muted/50 w-full animate-pulse">
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
        </div>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="border-border bg-muted/30 border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">Become a Donor</CardTitle>
          <CardDescription>Complete your profile to check if you&apos;re eligible to donate life.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/profile" className={cn(buttonVariants({ variant: "default" }), "w-full")}>
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
        eligibility.eligible ? "border-primary/20 bg-primary/5" : "border-border bg-muted/30"
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {eligibility.eligible ? (
            <CheckCircle2 className="text-primary h-5 w-5" />
          ) : (
            <AlertCircle className="text-muted-foreground h-5 w-5" />
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
          <Link href="/requests" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
            View Urgent Requests
          </Link>
        ) : (
          <Link
            href="/profile"
            className={cn(buttonVariants({ variant: "link" }), "text-muted-foreground w-full")}
          >
            Update Profile Info
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
