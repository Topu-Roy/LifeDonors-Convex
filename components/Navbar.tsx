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
  Menu,
  MessageSquarePlus,
  PlusCircle,
  User,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Container } from "./Container";
import { Button } from "./ui/button";

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
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <Container className="flex h-14 items-center justify-between">
        <Link href="/" className="flex shrink-0 items-center space-x-2">
          <Droplet className="text-primary h-6 w-6" />
          <span className="font-bold sm:inline-block">LifeDonors</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          {routes.map(route => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "hover:text-foreground/80 transition-colors",
                pathname === route.href ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <UserMenu />

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger
              render={props => (
                <Button
                  {...props}
                  variant="ghost"
                  size="icon"
                  className="border-border/50 bg-background/50 hover:bg-background rounded-xl border md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              )}
            />
            <SheetContent
              side="right"
              className="border-border/50 bg-background/95 w-[300px] border-l p-0 backdrop-blur-xl"
            >
              <SheetHeader className="border-border/50 border-b p-6">
                <SheetTitle className="flex items-center gap-2">
                  <Droplet className="text-primary h-6 w-6" />
                  <span className="text-xl font-black tracking-tighter">LifeDonors</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 p-4">
                {routes.map(route => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-4 text-base font-bold transition-all hover:translate-x-1",
                      pathname === route.href
                        ? "bg-primary shadow-primary/20 text-white shadow-lg"
                        : "text-muted-foreground hover:bg-muted font-black"
                    )}
                  >
                    <route.icon
                      className={cn("h-5 w-5", pathname === route.href ? "text-white" : "text-primary")}
                    />
                    {route.label}
                  </Link>
                ))}
              </div>
              <div className="border-border/50 bg-muted/30 mt-auto border-t p-4">
                <p className="text-muted-foreground text-center text-[10px] font-black tracking-widest uppercase">
                  v1.0.4 • Giving Life Together
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}

function UserMenu() {
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
