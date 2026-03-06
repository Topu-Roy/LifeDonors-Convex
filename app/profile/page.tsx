import { ProfileView } from "./_components/ProfileView";
import { Suspense } from "react";

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <Suspense
        fallback={
          <div className="h-screen w-full flex items-center justify-center animate-pulse bg-muted/50" />
        }
      >
        <ProfileView />
      </Suspense>
    </div>
  );
}
