"use client";

import { useState } from "react";
import { ProfileForm } from "@/app/profile/_components/profileForm";
import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { Container } from "@/components/Container";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DetailedHealthInfo } from "./detailedHealthInfo";
import { Eligibility } from "./eligibility";
import { MetricGrid } from "./metricGrid";
import { ProfileHeader } from "./profileHeader";

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

export function ProfileView() {
  const profile = useQuery(api.users.getMyProfile);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (profile === undefined) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  function setIsDialogOpenState(state: boolean) {
    setIsDialogOpen(state);
  }

  return (
    <Container as="main" className="flex flex-1 flex-col gap-8 py-12">
      {/* Profile Header */}
      <section className="bg-background border-primary/10 relative flex flex-col gap-6 overflow-hidden rounded-3xl border p-8 shadow-xl md:flex-row md:items-center md:justify-between">
        <ProfileHeader setIsDialogOpenState={setIsDialogOpenState} />
      </section>

      {/* Eligibility Banner */}
      <Eligibility />

      {/* Donor Metrics Grid */}
      <section>
        <MetricGrid />
      </section>

      {/* Detailed Health Info */}
      <section className="border-border grid grid-cols-1 gap-8 border-t pt-4 lg:grid-cols-3">
        <DetailedHealthInfo />
      </section>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-primary/20 max-h-[90vh] overflow-y-auto rounded-4xl shadow-2xl sm:max-w-2xl">
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
