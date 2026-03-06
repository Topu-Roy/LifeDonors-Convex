import { Suspense } from "react";
import { ProfileView } from "./_components/ProfileView";

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
