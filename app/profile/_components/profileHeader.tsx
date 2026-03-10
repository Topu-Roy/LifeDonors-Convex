"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Droplet, Edit2, MapPin, Verified } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function ProfileHeader({ setIsDialogOpenState }: { setIsDialogOpenState: (state: boolean) => void }) {
  const profile = useQuery(api.users.getMyProfile);
  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  if (!profile) return <Spinner />;

  return (
    <>
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
        onClick={() => setIsDialogOpenState(true)}
        className="shadow-primary/20 relative z-10 h-12 w-full gap-2 rounded-2xl px-6 font-bold shadow-lg md:w-auto"
      >
        <Edit2 className="h-4 w-4" />
        Edit Profile
      </Button>
    </>
  );
}
