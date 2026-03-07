"use client";

import { useEffect, useState } from "react";
import { ProfileForm } from "@/app/profile/_components/profileForm";
import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Database,
  Droplet,
  Edit2,
  History,
  Info,
  Loader2,
  MapPin,
  Scale,
  Settings,
  Verified,
  Waves,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Container } from "@/components/Container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export type ProfileType =
  | {
      name: string;
      imageUrl: string | null | undefined;
      email: string;
      role: string | null | undefined;
      _id?: Id<"profiles"> | undefined;
      _creationTime?: number | undefined;
      division?: string | undefined;
      district?: string | undefined;
      subDistrict?: string | undefined;
      userId?: string | undefined;
      age?: number | undefined;
      bmi?: number | undefined;
      bloodType?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | undefined;
      hemoglobinLevel?: number | undefined;
      diseases?: string[] | undefined;
      phoneNumber?: string | undefined;
      lastDonationDate?: number | undefined;
    }
  | null
  | undefined;

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

export function ProfileView() {
  const profile = useQuery(api.users.getMyProfile);
  const eligibility = useQuery(api.users.checkEligibility);
  const seedDatabase = useMutation(api.seed.seedDatabase);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (profile !== undefined && (!profile || !isProfileComplete(profile))) {
      router.push("/profile/setup");
    }
  }, [profile, router]);

  if (profile === undefined) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const handleSeed = async () => {
    if (!confirm("Are you sure you want to seed the database? This can only be done when the database is empty."))
      return;
    setIsSeeding(true);
    try {
      const result = await seedDatabase();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to seed database");
    } finally {
      setIsSeeding(false);
    }
  };

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <Container as="main" className="flex flex-1 flex-col gap-8 py-12">
      {/* Profile Header */}
      <section className="bg-background border-primary/10 relative flex flex-col gap-6 overflow-hidden rounded-3xl border p-8 shadow-xl md:flex-row md:items-center md:justify-between">
        <div className="pointer-events-none absolute top-0 right-0 p-8 opacity-[0.03]">
          <Droplet className="text-primary h-64 w-64" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
          <Avatar className="border-primary/20 h-24 w-24 shrink-0 border-4 shadow-lg">
            <AvatarImage src={profile.imageUrl ?? ""} alt={profile.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center">
            <h1 className="text-foreground line-clamp-2 text-3xl font-black tracking-tight md:text-4xl">
              {profile.name}
            </h1>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 gap-1 px-2 py-0.5 transition-colors"
              >
                <Verified className="h-3 w-3" />
                <span className="text-[10px] sm:text-xs">Dedicated Blood Donor</span>
              </Badge>
            </div>
            <p className="text-muted-foreground mt-3 flex items-center justify-center gap-1.5 text-sm font-medium sm:justify-start">
              <MapPin className="text-primary h-4 w-4 shrink-0" />
              <span className="truncate">
                {profile.subDistrict}, {profile.district}
              </span>
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsDialogOpen(true)}
          className="shadow-primary/20 relative z-10 h-12 w-full gap-2 rounded-2xl px-6 font-bold shadow-lg md:w-auto"
        >
          <Edit2 className="h-4 w-4" />
          Edit Profile
        </Button>
      </section>

      {/* Eligibility Banner */}
      {eligibility && (
        <section
          className={cn(
            "relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl border p-8 shadow-xl md:flex-row md:items-center",
            eligibility.eligible
              ? "bg-primary/5 border-primary/20 border-l-primary border-l-12"
              : "border-l-12 border-amber-500/20 border-l-amber-500 bg-amber-500/5"
          )}
        >
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {eligibility.eligible ? (
                <CheckCircle2 className="text-primary h-6 w-6 shrink-0" />
              ) : (
                <AlertCircle className="h-6 w-6 shrink-0 text-amber-500" />
              )}
              <h3 className="text-xl font-black tracking-tight md:text-2xl">
                Eligibility: {eligibility.eligible ? "Eligible" : "Pending"}
              </h3>
            </div>
            <p className="text-muted-foreground max-w-2xl text-base leading-relaxed font-medium md:text-lg">
              {eligibility.eligible
                ? "Great news! You are currently eligible to make a life-saving blood donation today. Your community needs you."
                : (eligibility.reason ??
                  "You are currently in a waiting period. Check back later to see when you can donate again.")}
            </p>
          </div>

          <Link
            href={eligibility.eligible ? "/requests" : "#"}
            className={cn(
              buttonVariants({
                variant: eligibility.eligible ? "default" : "outline",
              }),
              "h-12 w-full shrink-0 rounded-2xl px-8 font-black whitespace-nowrap shadow-lg transition-all md:w-auto",
              !eligibility.eligible && "bg-muted text-muted-foreground pointer-events-none shadow-none"
            )}
          >
            <Calendar className="mr-2 h-5 w-5" />
            {eligibility.eligible ? "Find Urgent Requests" : "Wait for Rest"}
          </Link>
        </section>
      )}

      {/* Donor Metrics Grid */}
      <section>
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-black tracking-tight">
          <Activity className="text-primary h-6 w-6" />
          Donor Health Metrics
        </h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <MetricCard
            icon={<Droplet className="h-5 w-5" />}
            label="Blood Type"
            value={profile.bloodType ?? "--"}
            color="text-primary"
            bgColor="bg-primary/5"
          />
          <MetricCard icon={<Calendar className="h-5 w-5" />} label="Age" value={`${profile.age} yrs`} />
          <MetricCard icon={<Scale className="h-5 w-5" />} label="BMI Index" value={String(profile.bmi)} />
          <MetricCard
            icon={<Waves className="h-5 w-5" />}
            label="Hemoglobin"
            value={`${profile.hemoglobinLevel}`}
            unit="g/dL"
          />
        </div>
      </section>

      {/* Detailed Health Info */}
      <section className="border-border grid grid-cols-1 gap-8 border-t pt-4 lg:grid-cols-3">
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
      </section>

      {/* Admin Actions */}
      {profile.role === "admin" && (
        <section className="bg-primary/5 border-primary/20 mt-8 space-y-6 rounded-3xl border border-dashed p-8 shadow-inner">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-xl font-black tracking-tight">
                <Settings className="text-primary h-5 w-5" />
                Admin Controls
              </h3>
              <p className="text-muted-foreground text-sm font-medium">
                Manage system data and administrative tasks. Use with caution.
              </p>
            </div>

            <Button
              variant="default"
              onClick={handleSeed}
              disabled={isSeeding}
              className="shadow-primary/20 h-12 gap-2 rounded-2xl px-8 font-bold shadow-lg"
            >
              {isSeeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
              Seed Database from Assets
            </Button>
          </div>
        </section>
      )}

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-primary/20 max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black tracking-tight">Edit Health Profile</DialogTitle>
            <DialogDescription className="text-base font-medium">
              Update your health details to stay eligible and help those in need.
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
    </Container>
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
        "border-primary/10 group relative flex flex-col gap-2 overflow-hidden rounded-3xl border p-6 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md",
        bgColor
      )}
    >
      <div className="pointer-events-none absolute -right-4 -bottom-4 opacity-[0.03] transition-opacity group-hover:opacity-[0.08]">
        <div className="h-24 w-24">{icon}</div>
      </div>
      <p className="text-muted-foreground relative z-10 flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
        <span className={cn(color)}>{icon}</span>
        {label}
      </p>
      <div className="relative z-10 flex items-end gap-1">
        <p className={cn("text-3xl font-black tracking-tight", color)}>{value}</p>
        {unit && (
          <span className="text-muted-foreground mb-1.5 text-xs font-bold tracking-wider uppercase">{unit}</span>
        )}
      </div>
    </div>
  );
}
