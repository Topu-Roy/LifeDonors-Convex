import { Suspense } from "react";
import { ProfileView, type ProfileType } from "@/app/profile/_components/ProfileView";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";

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

export default async function ProfilePage() {
  const profile = await fetchQuery(api.users.getMyProfile);

  if (profile !== undefined && (!profile || !isProfileComplete(profile))) {
    redirect("/profile/setup");
  }

  return (
    <div className="bg-muted/30 flex min-h-screen flex-col">
      <Suspense
        fallback={<div className="bg-muted/50 flex h-screen w-full animate-pulse items-center justify-center" />}
      >
        <ProfileView />
      </Suspense>
    </div>
  );
}
