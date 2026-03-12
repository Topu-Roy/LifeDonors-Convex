"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const profile = useQuery(api.users.getMyProfile);

  if (profile === undefined) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (profile?.role !== "admin") {
    notFound();
  }

  return <>{children}</>;
}
