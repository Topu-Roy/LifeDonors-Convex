"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RequestCard } from "@/components/RequestCard";
import { EligibilityStatus } from "@/components/EligibilityStatus";
import { buttonVariants } from "@/components/ui/button";
import {
  Droplet,
  ShieldCheck,
  Users,
  ArrowRight,
  Search,
  HandHeart,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Home() {
  const requests = useQuery(api.users.getAllRequests, {});

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Dynamic Background */}
      <section className="relative overflow-hidden bg-background py-20 lg:py-32">
        {/* Subtle Background Blobs */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top-4 duration-1000">
                <Activity className="h-3 w-3" />
                <span>Urgent Needs in Your Area</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95] text-foreground">
                Give Blood. <br />
                <span className="text-primary italic">Save a Life.</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Connect with those in urgent need of life-saving donations.
                Every drop counts, and every donor is a hero.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                <Link
                  href="/requests"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-14 px-8 text-lg font-bold group",
                  )}
                >
                  Find Requests
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/profile"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "h-14 px-8 text-lg font-bold",
                  )}
                >
                  Become a Donor
                </Link>
              </div>
            </div>

            {/* Featured Impact Card (Glassmorphism) */}
            <div className="flex-1 w-full max-w-md animate-in fade-in zoom-in duration-1000">
              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-secondary/20 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000" />
                <div className="relative bg-background/60 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center">
                      <Droplet className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs border-primary/20 text-primary"
                    >
                      Live Impact
                    </Badge>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-end border-b pb-4 border-border/50">
                      <span className="text-muted-foreground font-medium">
                        Lives Saved
                      </span>
                      <span className="text-3xl font-black text-foreground tracking-tighter">
                        1,284
                      </span>
                    </div>
                    <div className="flex justify-between items-end border-b pb-4 border-border/50">
                      <span className="text-muted-foreground font-medium">
                        Active Donors
                      </span>
                      <span className="text-3xl font-black text-foreground tracking-tighter">
                        4,502
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-muted-foreground font-medium">
                        Health Camps
                      </span>
                      <span className="text-3xl font-black text-foreground tracking-tighter">
                        12
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-border/50">
                    <div className="flex -space-x-3 overflow-hidden">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-10 w-10 rounded-full ring-4 ring-background bg-secondary flex items-center justify-center font-bold text-xs"
                        >
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                      <div className="flex items-center justify-center h-10 w-10 rounded-full border-2 border-dashed border-muted-foreground/30 text-[10px] text-muted-foreground font-bold">
                        +50
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 font-medium">
                      Join 5k+ local heroes helping today.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-12 space-y-24">
        {/* Urgent Requests Block */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-3xl font-black tracking-tight flex items-center justify-center md:justify-start gap-2">
                <Activity className="h-8 w-8 text-primary" />
                Urgent Blood Needs
              </h2>
              <p className="text-muted-foreground">
                These patients need your help immediately.
              </p>
            </div>
            <Link
              href="/requests"
              className="group inline-flex items-center text-sm font-bold text-primary hover:opacity-80 transition-all mx-auto md:mx-0"
            >
              Exlpore all requests
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests === undefined ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[280px] bg-muted/50 animate-pulse rounded-2xl border"
                />
              ))
            ) : requests.length > 0 ? (
              requests
                .slice(0, 3)
                .map((request) => (
                  <RequestCard key={request._id} request={request} />
                ))
            ) : (
              <div className="col-span-full py-20 text-center bg-muted/20 rounded-2xl border-2 border-dashed border-border">
                <Droplet className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground font-medium">
                  No open blood requests at the moment.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Features Split Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tight leading-none">
                More Than Just <br />A Donation Platform.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We&apos;ve built a mission-critical infrastructure to ensure
                that blood reaches those in need, exactly when it matters most.
              </p>
            </div>

            <div className="grid gap-6">
              <FeatureItem
                icon={<ShieldCheck className="h-6 w-6 text-primary" />}
                title="Strict Privacy"
                description="Your contact data is only shared with verified patients who need your help."
              />
              <FeatureItem
                icon={<Users className="h-6 w-6 text-primary" />}
                title="Community Driven"
                description="Our platform is powered by thousands of volunteers and dedicated donors."
              />
              <FeatureItem
                icon={<Activity className="h-6 w-6 text-primary" />}
                title="Live Tracking"
                description="Keep track of your donated bags and see the real impact you're making."
              />
            </div>
          </div>

          <div className="relative">
            <EligibilityStatus />
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary/20 rounded-full blur-3xl -z-10" />
          </div>
        </section>

        {/* Action Blocks */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group relative bg-primary text-primary-foreground rounded-3xl p-10 overflow-hidden shadow-xl hover:shadow-2xl transition-all h-[320px] flex flex-col justify-end">
            <div className="absolute top-0 right-0 p-8 opacity-20 transform group-hover:scale-110 transition-transform">
              <HandHeart className="h-40 w-40" />
            </div>
            <div className="relative z-10 space-y-4">
              <h3 className="text-3xl font-black leading-tight">
                Ready to <br />
                Help Out?
              </h3>
              <p className="opacity-80 text-sm max-w-[240px]">
                Setup your donor profile in minutes and start saving lives
                today.
              </p>
              <Link
                href="/profile"
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "font-bold text-primary px-8",
                )}
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="group relative bg-secondary rounded-3xl p-10 overflow-hidden shadow-lg border border-border/50 hover:shadow-xl transition-all h-[320px] flex flex-col justify-end">
            <div className="absolute top-0 right-0 p-8 opacity-20 transform group-hover:scale-110 transition-transform">
              <Search className="h-40 w-40 text-secondary-foreground" />
            </div>
            <div className="relative z-10 space-y-4">
              <h3 className="text-3xl font-black leading-tight text-secondary-foreground">
                Need Blood <br />
                Urgently?
              </h3>
              <p className="text-muted-foreground text-sm max-w-[240px]">
                Create an urgent request and reach our entire community
                instantly.
              </p>
              <Link
                href="/requests"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "font-bold bg-background/50 backdrop-blur border-border/50 px-8",
                )}
              >
                Create Request
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Footer CTA */}
      <footer className="bg-muted/30 border-t py-12 mt-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 font-black text-xl italic tracking-tighter">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Droplet className="h-5 w-5 text-primary-foreground fill-current" />
            </div>
            <span className="text-foreground">BLOOD</span>
            <span className="text-primary">LINE</span>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Design with love for the life-saving community.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="font-bold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground italic leading-snug">
          {description}
        </p>
      </div>
    </div>
  );
}

function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide",
        variant === "default" && "bg-primary text-primary-foreground",
        variant === "outline" && "border border-border text-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
