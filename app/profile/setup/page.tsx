"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProfileForm } from "../_components/profileForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

export default function ProfileSetupPage() {
  const profile = useQuery(api.users.getMyProfile);
  const router = useRouter();

  const isProfileComplete = (p: Doc<"profiles"> | null | undefined) => {
    return (
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
  };

  useEffect(() => {
    if (profile !== undefined && isProfileComplete(profile)) {
      router.push("/profile");
    }
  }, [profile, router]);

  if (profile === undefined) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          Complete Your Donor Profile
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          We need a few more details to help you start donating or requesting
          blood.
        </p>
      </div>

      <div className="bg-card border rounded-3xl p-8 shadow-sm">
        <ProfileForm onSuccess={() => router.push("/profile")} />
      </div>
    </div>
  );
}
