"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RequestCard } from "@/components/RequestCard";
import { Container } from "@/components/Container";
import {
  Droplet,
  Search,
  HandHeart,
  Activity,
  ShieldCheck,
  Users,
  ArrowRight,
  Heart,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Home() {
  const requests = useQuery(api.users.getAllRequests, {});

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center w-full pb-12">
        {/* Hero Section */}
        <Container as="section" className="py-8">
          <div
            className="relative flex min-h-[500px] flex-col gap-8 rounded-[2rem] items-center justify-center p-8 overflow-hidden bg-slate-900 shadow-2xl border border-white/10"
            style={{
              backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.8)), url("https://images.unsplash.com/photo-1542884748-2b87b36c6b90?auto=format&fit=crop&q=80")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative z-10 flex flex-col gap-4 text-center max-w-3xl">
              <h1 className="text-white text-4xl sm:text-5xl md:text-7xl font-black leading-[1.1] tracking-tighter animate-in fade-in slide-in-from-top-4 duration-1000">
                Give Blood.
                <br />
                <span className="text-primary italic">Save a Life.</span>
              </h1>
              <p className="text-slate-200 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto opacity-90">
                Join our community of lifesavers. Find urgent local blood
                requests, track your donations, and make a real difference in
                your community.
              </p>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center mt-4 w-full sm:w-auto">
              <Link
                href="/requests"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-14 px-8 text-lg font-bold shadow-xl hover:scale-105 transition-all gap-2 w-full sm:w-auto",
                )}
              >
                <Search className="h-5 w-5" />
                Find Requests
              </Link>
              <Link
                href="/profile"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-14 px-8 text-lg font-bold shadow-xl bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 transition-all gap-2 w-full sm:w-auto",
                )}
              >
                <HandHeart className="h-5 w-5" />
                Become a Donor
              </Link>
            </div>
          </div>
        </Container>

        {/* Live Impact Stats */}
        <Container as="section" className="-mt-16 z-20 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-background rounded-2xl shadow-xl border border-border">
            <ImpactCard
              icon={<Heart className="h-6 w-6" />}
              label="Lives Saved"
              value="12,450+"
              color="text-primary"
              bgColor="bg-primary/5"
              borderColor="border-primary/10"
            />
            <ImpactCard
              icon={<Users className="h-6 w-6" />}
              label="Active Donors"
              value="8,200+"
              color="text-blue-500"
              bgColor="bg-blue-500/5"
              borderColor="border-blue-100"
            />
            <ImpactCard
              icon={<Activity className="h-6 w-6" />}
              label="Urgent Requests"
              value={requests?.length.toString() ?? "34"}
              color="text-orange-500"
              bgColor="bg-orange-500/5"
              borderColor="border-orange-100"
            />
          </div>
        </Container>

        {/* Main Content Area */}
        <Container className="py-12 flex flex-col lg:flex-row gap-12">
          {/* Left Column: Urgent Needs */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
              <h2 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-primary" />
                Urgent Needs
              </h2>
              <Link
                href="/requests"
                className="text-sm font-bold text-primary hover:underline flex items-center gap-1 w-fit"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {requests === undefined ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-40 bg-muted/50 animate-pulse rounded-2xl border"
                  />
                ))
              ) : requests.length > 0 ? (
                requests
                  .slice(0, 3)
                  .map((request) => (
                    <RequestCard key={request._id} request={request} />
                  ))
              ) : (
                <div className="py-20 text-center bg-muted/20 rounded-2xl border border-dashed border-border opacity-60">
                  <Droplet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground font-medium">
                    No open blood requests at the moment.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Features & Eligibility */}
          <div className="w-full lg:w-1/3 flex flex-col gap-8">
            {/* Eligibility Module */}
            <Card className="shadow-lg border-border relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles className="h-24 w-24 text-primary" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Can I Donate?
                </CardTitle>
                <CardDescription>
                  Take a quick check to see if you are eligible to donate blood
                  today.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Age
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-muted/50 border-border">
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16">
                          16 - 17 (With consent)
                        </SelectItem>
                        <SelectItem value="18">18 - 65</SelectItem>
                        <SelectItem value="65">65+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Weight
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-muted/50 border-border">
                        <SelectValue placeholder="Select weight" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">
                          Under 110 lbs (50kg)
                        </SelectItem>
                        <SelectItem value="ok">
                          110 lbs (50kg) or more
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Felt well today?
                    </Label>
                    <RadioGroup defaultValue="yes" className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes" />
                        <Label htmlFor="yes" className="text-sm font-medium">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no" className="text-sm font-medium">
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <Button className="w-full font-bold shadow-lg shadow-primary/20">
                  Check Eligibility
                </Button>
              </CardContent>
            </Card>

            {/* Platform Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-black tracking-tight px-1">
                Why LifeDonors?
              </h3>
              <FeatureItem
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Privacy First"
                description="Your health data is encrypted and never shared without explicit consent."
                color="text-primary"
              />
              <FeatureItem
                icon={<Users className="h-5 w-5" />}
                title="Active Community"
                description="Connect with other donors and organize local blood drives easily."
                color="text-blue-500"
              />
              <FeatureItem
                icon={<Activity className="h-5 w-5" />}
                title="Live Tracking"
                description="Follow your donation's journey and see exactly when it helps someone."
                color="text-green-500"
              />
            </div>
          </div>
        </Container>
      </main>

      {/* Footer */}
      <footer className="w-full bg-background border-t border-border py-12 mt-auto">
        <Container className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Droplet className="h-6 w-6 text-white fill-current" />
            </div>
            <span className="font-black text-xl italic tracking-tighter">
              LifeDonors
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            © 2024 LifeDonors Platform. Saving lives together.
          </p>
          <div className="flex gap-6">
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="sr-only">Help</span>
              <Activity className="h-5 w-5" />
            </Link>
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="sr-only">About</span>
              <Users className="h-5 w-5" />
            </Link>
          </div>
        </Container>
      </footer>
    </div>
  );
}

function ImpactCard({
  icon,
  label,
  value,
  color,
  bgColor,
  borderColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  bgColor: string;
  borderColor: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-2xl p-6 border transition-all hover:shadow-md",
        bgColor,
        borderColor,
      )}
    >
      <div className={cn("flex items-center gap-2", color)}>
        {icon}
        <p className="text-xs font-bold uppercase tracking-widest opacity-80">
          {label}
        </p>
      </div>
      <p className="text-4xl font-black tracking-tighter">{value}</p>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/50 border border-transparent hover:border-border transition-all">
      <div
        className={cn(
          "p-2 rounded-xl bg-background shadow-sm border border-border",
          color,
        )}
      >
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
