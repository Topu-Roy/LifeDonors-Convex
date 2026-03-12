import { Suspense } from "react";
import { ProfileView } from "@/app/profile/_components/ProfileView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | LifeDonors",
  description: "View and manage your donor profile and health statistics.",
};

export default function ProfilePage() {
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
