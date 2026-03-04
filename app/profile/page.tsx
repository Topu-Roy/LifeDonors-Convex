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
  Droplet,
  MapPin,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Verified,
  Scale,
  Waves,
  History,
  Info,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileForm } from "./_components/profileForm";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export type ProfileType = {
  name: string | undefined;
  imageUrl: string | undefined;
  email: string | undefined;
  _id?: Id<"profiles"> | undefined;
  _creationTime?: number | undefined;
  division?: string | undefined;
  district?: string | undefined;
  subDistrict?: string | undefined;
  userId?: string | undefined;
  age?: number | undefined;
  bmi?: number | undefined;
  bloodType?:
    | "A+"
    | "A-"
    | "B+"
    | "B-"
    | "AB+"
    | "AB-"
    | "O+"
    | "O-"
    | undefined;
  hemoglobinLevel?: number | undefined;
  diseases?: string[] | undefined;
  phoneNumber?: string | undefined;
  lastDonationDate?: number | undefined;
} | null;

const isProfileComplete = (p: ProfileType) => {
  if (!p) return false;

  return (
    p.age !== undefined &&
    p.bmi !== undefined &&
    p.bloodType !== undefined &&
    p.hemoglobinLevel !== undefined &&
    p.phoneNumber !== undefined &&
    p.division !== undefined &&
    p.district !== undefined &&
    p.subDistrict !== undefined
  );
};

export default function ProfilePage() {
  const profile = useQuery(api.users.getMyProfile);
  const eligibility = useQuery(api.users.checkEligibility);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!profile || !isProfileComplete(profile)) {
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

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 flex flex-col gap-8">
        {/* Profile Header */}
        <section className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 p-8 bg-background rounded-3xl shadow-xl border border-primary/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <Droplet className="h-64 w-64 text-primary" />
          </div>

          <div className="flex items-center gap-6 relative z-10">
            <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-lg">
              <AvatarImage src={profile.imageUrl} alt={profile.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-black tracking-tight text-foreground">
                {profile.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors gap-1 px-2 py-0.5"
                >
                  <Verified className="h-3 w-3" />
                  Dedicated Blood Donor
                </Badge>
              </div>
              <p className="text-muted-foreground font-medium mt-2 flex items-center gap-1.5 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                {profile.subDistrict}, {profile.district}, {profile.division}
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsDialogOpen(true)}
            className="rounded-2xl h-12 px-6 font-bold shadow-lg shadow-primary/20 gap-2 relative z-10"
          >
            <Edit2 className="h-4 w-4" />
            Edit Profile
          </Button>
        </section>

        {/* Eligibility Banner */}
        {eligibility && (
          <section
            className={cn(
              "flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-3xl p-8 border shadow-xl relative overflow-hidden",
              eligibility.eligible
                ? "bg-primary/5 border-primary/20 border-l-12 border-l-primary"
                : "bg-amber-500/5 border-amber-500/20 border-l-12 border-l-amber-500",
            )}
          >
            <div className="flex flex-col gap-2 relative z-10">
              <div className="flex items-center gap-2">
                {eligibility.eligible ? (
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-amber-500" />
                )}
                <h3 className="text-2xl font-black tracking-tight">
                  Eligibility Status:{" "}
                  {eligibility.eligible ? "Eligible" : "Pending"}
                </h3>
              </div>
              <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-2xl">
                {eligibility.eligible
                  ? "Great news! You are currently eligible to make a life-saving blood donation today. Your community needs you."
                  : (eligibility.reason ??
                    "You are currently in a waiting period. Check back later to see when you can donate again.")}
              </p>
            </div>

            <Button
              disabled={!eligibility.eligible}
              className={cn(
                "rounded-2xl h-12 px-8 font-black shadow-lg transition-all whitespace-nowrap w-full md:w-auto shrink-0",
                eligibility.eligible
                  ? "bg-primary text-white shadow-primary/20 hover:scale-105"
                  : "bg-muted text-muted-foreground shadow-none",
              )}
            >
              <a href={eligibility.eligible ? "/requests" : "#"}>
                <Calendar className="mr-2 h-5 w-5" />
                {eligibility.eligible
                  ? "Find Urgent Requests"
                  : "Wait for Rest"}
              </a>
            </Button>
          </section>
        )}

        {/* Donor Metrics Grid */}
        <section>
          <h2 className="text-2xl font-black tracking-tight mb-6 flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            Donor Health Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <MetricCard
              icon={<Droplet className="h-5 w-5" />}
              label="Blood Type"
              value={profile.bloodType ?? "--"}
              color="text-primary"
              bgColor="bg-primary/5"
            />
            <MetricCard
              icon={<Calendar className="h-5 w-5" />}
              label="Age"
              value={`${profile.age} yrs`}
            />
            <MetricCard
              icon={<Scale className="h-5 w-5" />}
              label="BMI Index"
              value={String(profile.bmi)}
            />
            <MetricCard
              icon={<Waves className="h-5 w-5" />}
              label="Hemoglobin"
              value={`${profile.hemoglobinLevel}`}
              unit="g/dL"
            />
          </div>
        </section>

        {/* Detailed Health Info */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4 border-t border-border">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Health & Vital Details
            </h3>

            <Card className="rounded-3xl border-border bg-background shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-b">
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Last Donation Date
                  </p>
                  <p className="text-lg font-bold">
                    {profile.lastDonationDate
                      ? new Date(profile.lastDonationDate).toLocaleDateString(
                          undefined,
                          {
                            dateStyle: "long",
                          },
                        )
                      : "No record yet"}
                  </p>
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Contact Phone
                  </p>
                  <p className="text-lg font-bold">{profile.phoneNumber}</p>
                </div>
              </div>
              <div className="p-6 bg-muted/30">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-background border shadow-sm">
                    <Info className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      Donor Information Accuracy
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Your information is used to match you with urgent needs
                      safely. Keep it updated to ensure the best care for
                      patients and yourself.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Conditions
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.diseases && profile.diseases.length > 0 ? (
                profile.diseases.map((d) => (
                  <Badge
                    key={d}
                    variant="secondary"
                    className="rounded-xl px-4 py-2 text-sm font-bold bg-muted/80 border border-border"
                  >
                    {d}
                  </Badge>
                ))
              ) : (
                <div className="p-6 w-full rounded-3xl border border-dashed text-center">
                  <p className="text-sm text-muted-foreground font-medium italic">
                    No medical conditions reported.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] border-primary/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black tracking-tight">
              Edit Health Profile
            </DialogTitle>
            <DialogDescription className="text-base font-medium">
              Update your health details to stay eligible and help those in
              need.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {isDialogOpen && (
              <ProfileForm
                profile={profile}
                onSuccess={() => {
                  setIsDialogOpen(false);
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  unit,
  color = "text-foreground",
  bgColor = "bg-background",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  color?: string;
  bgColor?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-3xl p-6 border border-primary/10 shadow-sm relative overflow-hidden group transition-all hover:shadow-md hover:scale-[1.02]",
        bgColor,
      )}
    >
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
        <div className="h-24 w-24">{icon}</div>
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 relative z-10">
        <span className={cn(color)}>{icon}</span>
        {label}
      </p>
      <div className="flex items-end gap-1 relative z-10">
        <p className={cn("text-3xl font-black tracking-tight", color)}>
          {value}
        </p>
        {unit && (
          <span className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
