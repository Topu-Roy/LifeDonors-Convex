"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Droplet,
  LayoutDashboard,
  MessageSquarePlus,
  User,
} from "lucide-react";

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
      <div className="container flex h-14 items-center mx-auto px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
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
        <div className="ml-auto flex items-center space-x-2">
          {/* Add user menu or login/logout here later */}
        </div>
      </div>
    </header>
  );
}
