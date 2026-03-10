"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  Droplet,
  Heart,
  History,
  LayoutDashboard,
  LifeBuoy,
  LogIn,
  LogOut,
  MessageSquarePlus,
  PlusCircle,
  ShieldCheck,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  const profile = useQuery(api.users.getMyProfile);
  const pathname = usePathname();

  // If loading
  if (profile === undefined) {
    return <div className="bg-muted h-8 w-8 animate-pulse rounded-full" />;
  }

  // If not logged in
  if (profile === null) {
    return (
      <Link
        href="/sign-in"
        className={cn(
          "hover:text-primary flex items-center gap-1.5 text-sm font-medium transition-colors",
          pathname === "/sign-in" ? "text-primary" : "text-muted-foreground"
        )}
      >
        <LogIn className="h-4 w-4" />
        Sign In
      </Link>
    );
  }

  // Define a local type for the enriched profile
  type EnrichedProfile = Exclude<typeof profile, undefined | null> & {
    name?: string;
    imageUrl?: string;
    email?: string;
  };

  const user = profile as EnrichedProfile;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={props => (
          <Button
            {...props}
            variant="ghost"
            className="ring-offset-background hover:ring-primary/20 relative h-9 w-9 overflow-hidden rounded-full p-0 transition-all hover:ring-2"
          >
            <Avatar className="border-border/50 h-9 w-9 border">
              <AvatarImage src={user.imageUrl} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{initials}</AvatarFallback>
            </Avatar>
          </Button>
        )}
      />
      <DropdownMenuContent className="w-64 p-2" align="end">
        <div className="mb-1 flex items-center gap-2 p-3">
          <Avatar className="border-border/50 h-10 w-10 border">
            <AvatarImage src={user.imageUrl} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm leading-none font-bold">{user.name}</p>
            <p className="text-muted-foreground max-w-[150px] truncate text-[10px] leading-none">{user.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator className="-mx-2" />

        <DropdownMenuGroup className="py-1">
          <DropdownMenuLabel className="text-muted-foreground/70 px-2 py-1.5 text-[10px] font-bold tracking-wider uppercase">
            Account
          </DropdownMenuLabel>
          <DropdownMenuItem className="rounded-md">
            <Link href="/profile" className="flex w-full cursor-pointer items-center py-1">
              <UserCircle className="text-primary mr-2 h-4 w-4" />
              <span>My Profile</span>
            </Link>
          </DropdownMenuItem>
          {user.role === "admin" && (
            <DropdownMenuItem className="rounded-md">
              <Link href="/admin" className="flex w-full cursor-pointer items-center py-1">
                <ShieldCheck className="text-primary mr-2 h-4 w-4" />
                <span className="font-bold">Admin Panel</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="rounded-md">
            <Link href="/profile" className="flex w-full cursor-pointer items-center py-1">
              <Droplet className="text-primary mr-2 h-4 w-4" />
              <span className="flex-1">Donor Details</span>
              <Badge
                variant="outline"
                className="bg-primary/5 text-primary border-primary/20 ml-auto h-4 text-[10px]"
              >
                {user.bloodType}
              </Badge>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="-mx-2" />

        <DropdownMenuGroup className="py-1">
          <DropdownMenuLabel className="text-muted-foreground/70 px-2 py-1.5 text-[10px] font-bold tracking-wider uppercase">
            Activity
          </DropdownMenuLabel>
          <DropdownMenuItem className="rounded-md">
            <Link href="/dashboard" className="flex w-full cursor-pointer items-center py-1">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-foreground/80 rounded-md">
            <Link href="/requests/new" className="flex w-full cursor-pointer items-center py-1">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Create Request</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-md">
            <Link href="/dashboard?tab=requests" className="flex w-full cursor-pointer items-center py-1">
              <MessageSquarePlus className="mr-2 h-4 w-4" />
              <span>My Requests</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-md">
            <Link href="/dashboard?tab=donations" className="flex w-full cursor-pointer items-center py-1">
              <History className="mr-2 h-4 w-4" />
              <span>My Donations</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="-mx-2" />

        <DropdownMenuGroup className="py-1">
          <DropdownMenuLabel className="text-muted-foreground/70 px-2 py-1.5 text-[10px] font-bold tracking-wider uppercase">
            Support
          </DropdownMenuLabel>
          <DropdownMenuItem className="rounded-md">
            <Link href="/" className="flex w-full cursor-pointer items-center py-1">
              <Heart className="mr-2 h-4 w-4" />
              <span>How it works</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-md">
            <Link href="/" className="flex w-full cursor-pointer items-center py-1">
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>Help Center</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="-mx-2" />

        <DropdownMenuItem
          className="text-destructive focus:bg-destructive/10 focus:text-destructive mt-1 w-full cursor-pointer rounded-md"
          onClick={async () => {
            await authClient.signOut();
            window.location.href = "/";
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="font-medium">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
