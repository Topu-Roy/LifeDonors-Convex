"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Droplet,
  LayoutDashboard,
  MessageSquarePlus,
  User,
  LogOut,
  UserCircle,
  LogIn,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: Droplet,
    },
    {
      href: "/requests",
      label: "Requests",
      icon: MessageSquarePlus,
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex justify-between h-14 items-center mx-auto px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Droplet className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block">LifeDonors</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === route.href
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>
        <UserMenu />
      </div>
    </header>
  );
}

function UserMenu() {
  const profile = useQuery(api.users.getMyProfile);
  const pathname = usePathname();

  // If loading
  if (profile === undefined) {
    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />;
  }

  // If not logged in
  if (profile === null) {
    return (
      <Link
        href="/sign-in"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5",
          pathname === "/sign-in" ? "text-primary" : "text-muted-foreground",
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
        render={(props) => (
          <Avatar {...props} className="h-8 w-8 border border-border/50">
            <AvatarImage src={user.imageUrl} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        )}
      />
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-bold leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground italic">
                {user.bloodType} Donor
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link
              href="/profile"
              className="flex items-center w-full cursor-pointer"
            >
              <UserCircle className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href="/dashboard"
              className="flex items-center w-full cursor-pointer"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer w-full"
            onClick={async () => {
              await authClient.signOut();
              window.location.href = "/";
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
