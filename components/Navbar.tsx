"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Droplet,
  LayoutDashboard,
  MessageSquarePlus,
  User,
  UserCircle,
  LogIn,
  Heart,
  History,
  LifeBuoy,
  PlusCircle,
  LogOut,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { Button } from "./ui/button";
import { Container } from "./Container";

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
      <Container className="flex justify-between h-14 items-center">
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
      </Container>
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
          <Button
            {...props}
            variant="ghost"
            className="relative h-9 w-9 rounded-full p-0 overflow-hidden ring-offset-background transition-all hover:ring-2 hover:ring-primary/20"
          >
            <Avatar className="h-9 w-9 border border-border/50">
              <AvatarImage src={user.imageUrl} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        )}
      />
      <DropdownMenuContent className="w-64 p-2" align="end">
        <div className="flex items-center gap-2 p-3 mb-1">
          <Avatar className="h-10 w-10 border border-border/50">
            <AvatarImage src={user.imageUrl} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-bold leading-none">{user.name}</p>
            <p className="text-[10px] leading-none text-muted-foreground truncate max-w-[150px]">
              {user.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className="-mx-2" />

        <DropdownMenuGroup className="py-1">
          <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
            Account
          </DropdownMenuLabel>
          <DropdownMenuItem className="rounded-md">
            <Link
              href="/profile"
              className="flex items-center w-full cursor-pointer py-1"
            >
              <UserCircle className="mr-2 h-4 w-4 text-primary" />
              <span>My Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-md">
            <Link
              href="/profile"
              className="flex items-center w-full cursor-pointer py-1"
            >
              <Droplet className="mr-2 h-4 w-4 text-primary" />
              <span className="flex-1">Donor Details</span>
              <Badge
                variant="outline"
                className="ml-auto text-[10px] h-4 bg-primary/5 text-primary border-primary/20"
              >
                {user.bloodType}
              </Badge>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="-mx-2" />

        <DropdownMenuGroup className="py-1">
          <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
            Activity
          </DropdownMenuLabel>
          <DropdownMenuItem className="rounded-md">
            <Link
              href="/dashboard"
              className="flex items-center w-full cursor-pointer py-1"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-md text-foreground/80">
            <Link
              href="/requests/_components/createRequest"
              className="flex items-center w-full cursor-pointer py-1"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Create Request</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-md">
            <Link
              href="/dashboard?tab=requests"
              className="flex items-center w-full cursor-pointer py-1"
            >
              <MessageSquarePlus className="mr-2 h-4 w-4" />
              <span>My Requests</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-md">
            <Link
              href="/dashboard?tab=donations"
              className="flex items-center w-full cursor-pointer py-1"
            >
              <History className="mr-2 h-4 w-4" />
              <span>My Donations</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="-mx-2" />

        <DropdownMenuGroup className="py-1">
          <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
            Support
          </DropdownMenuLabel>
          <DropdownMenuItem className="rounded-md">
            <Link
              href="/"
              className="flex items-center w-full cursor-pointer py-1"
            >
              <Heart className="mr-2 h-4 w-4" />
              <span>How it works</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-md">
            <Link
              href="/"
              className="flex items-center w-full cursor-pointer py-1"
            >
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>Help Center</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="-mx-2" />

        <DropdownMenuItem
          className="rounded-md text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer w-full mt-1"
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
