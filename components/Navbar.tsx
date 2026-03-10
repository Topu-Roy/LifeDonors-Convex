"use client";

import { type UrlObject } from "url";
import { type ForwardRefExoticComponent, type RefAttributes } from "react";
import { Droplet, LayoutDashboard, Menu, MessageSquarePlus, User, type LucideProps } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { UserMenu } from "./userMenu";

export function Navbar() {
  const pathname = usePathname();

  const routes: {
    href: UrlObject | __next_route_internal_types__.RouteImpl<"/">;
    label: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  }[] = [
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
              key={route.href as string}
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
                    key={route.href as string}
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
