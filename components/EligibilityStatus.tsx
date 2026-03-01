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
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

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
      <Card className="border-dashed border-red-200 bg-red-50/30">
        <CardHeader>
          <CardTitle className="text-lg">Become a Donor</CardTitle>
          <CardDescription>
            Complete your profile to check if you&apos;re eligible to donate
            life.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full bg-red-600 hover:bg-red-700">
            <Link href="/profile">Complete Profile</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={
        eligibility.eligible
          ? "border-emerald-200 bg-emerald-50/30"
          : "border-amber-200 bg-amber-50/30"
      }
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {eligibility.eligible ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-600" />
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
          <Button
            variant="outline"
            className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50"
          >
            <Link href="/requests">View Urgent Requests</Link>
          </Button>
        ) : (
          <Button variant="link" className="w-full text-amber-700">
            <Link href="/profile">Update Profile Info</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
