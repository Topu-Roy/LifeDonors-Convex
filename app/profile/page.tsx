"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Edit2,
  Calendar,
  Activity,
  Phone,
  Droplet,
  MapPin,
  Heart,
  Loader2,
  User,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProfileForm } from "./_components/profileForm";
import { Doc } from "@/convex/_generated/dataModel";

const isProfileComplete = (p: Doc<"profiles"> | null | undefined) =>
  !!(
    p &&
    p.age > 0 &&
    p.bmi > 0 &&
    p.bloodType &&
    p.hemoglobinLevel > 0 &&
    p.phoneNumber &&
    p.division &&
    p.district &&
    p.subDistrict
  );

export default function ProfilePage() {
  const profile = useQuery(api.users.getMyProfile);
  const eligibility = useQuery(api.users.checkEligibility);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (
      profile === null ||
      (profile !== undefined && !isProfileComplete(profile))
    ) {
      router.push("/profile/setup");
    }
  }, [profile, router]);

  if (profile === undefined) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) return null;

  const rows: {
    icon: React.ReactNode;
    label: string;
    value: string;
    highlight?: boolean;
  }[] = [
    {
      icon: <Droplet className="h-4 w-4" />,
      label: "Blood Type",
      value: profile.bloodType,
      highlight: true,
    },
    {
      icon: <User className="h-4 w-4" />,
      label: "Age",
      value: `${profile.age} years`,
    },
    {
      icon: <Activity className="h-4 w-4" />,
      label: "BMI",
      value: String(profile.bmi),
    },
    {
      icon: <Heart className="h-4 w-4" />,
      label: "Hemoglobin",
      value: `${profile.hemoglobinLevel} g/dL`,
    },
    {
      icon: <Phone className="h-4 w-4" />,
      label: "Phone",
      value: profile.phoneNumber,
    },
    {
      icon: <MapPin className="h-4 w-4" />,
      label: "Location",
      value: `${profile.subDistrict}, ${profile.district}, ${profile.division}`,
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: "Last Donation",
      value: profile.lastDonationDate
        ? new Date(profile.lastDonationDate).toLocaleDateString(undefined, {
            dateStyle: "long",
          })
        : "No record",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10 max-w-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your donor health details
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsDialogOpen(true)}
          className="gap-1.5"
        >
          <Edit2 className="h-3.5 w-3.5" />
          Edit
        </Button>
      </div>

      {/* Eligibility Alert */}
      {eligibility && (
        <div className="mb-8">
          {eligibility.eligible ? (
            <Alert className="bg-primary/5 border-primary/20">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary font-bold">
                You are eligible!
              </AlertTitle>
              <AlertDescription className="text-primary/80 text-sm italic font-medium">
                You are ready to save lives. Check for urgent requests near you.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert
              variant="destructive"
              className="bg-destructive/5 border-destructive/20 text-destructive"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-bold">Not Eligible Yet</AlertTitle>
              <AlertDescription className="text-sm font-medium">
                {eligibility.reason ??
                  "You do not meet the health criteria at this moment."}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Info rows */}
      <div className="space-y-5">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between border-b pb-5 last:border-0 last:pb-0"
          >
            <div className="flex items-center gap-2.5 text-muted-foreground">
              {row.icon}
              <span className="text-sm text-foreground font-medium">
                {row.label}
              </span>
            </div>
            <span
              className={
                row.highlight
                  ? "text-sm font-bold text-primary"
                  : "text-sm text-foreground"
              }
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Conditions */}
      {profile.diseases && profile.diseases.length > 0 && (
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Conditions
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.diseases.map((d) => (
              <Badge key={d} variant="secondary" className="text-xs">
                {d}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Edit Dialog — pass profile for pre-fill, remount on open via key */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Edit Profile
            </DialogTitle>
            <DialogDescription>
              Accurate info helps match you with urgent needs safely.
            </DialogDescription>
          </DialogHeader>
          {isDialogOpen && (
            <ProfileForm
              profile={profile}
              onSuccess={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
