import { Activity, Droplet, HandHeart, Search, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/Container";
import { buttonVariants } from "@/components/ui/button";
import { EligibilityChecker } from "./_components/EligibilityChecker";
import { FeatureItem } from "./_components/HomeFeatureItem";
import { HomeRequests } from "./_components/HomeRequests";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex w-full flex-1 flex-col items-center pb-12">
        {/* Hero Section */}
        <Container as="section" className="py-8">
          <div
            className="relative flex min-h-[500px] flex-col items-center justify-center gap-8 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 p-8 shadow-2xl"
            style={{
              backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.8)), url("https://images.unsplash.com/photo-1542884748-2b87b36c6b90?auto=format&fit=crop&q=80")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative z-10 flex max-w-3xl flex-col gap-4 text-center">
              <h1 className="animate-in fade-in slide-in-from-top-4 text-4xl leading-[1.1] font-black tracking-tighter text-white duration-1000 sm:text-5xl md:text-7xl">
                Give Blood.
                <br />
                <span className="text-primary italic">Save a Life.</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed font-medium text-slate-200 opacity-90 md:text-xl">
                Join our community of lifesavers. Find urgent local blood requests, track your donations, and make
                a real difference in your community.
              </p>
            </div>
            <div className="relative z-10 mt-4 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
              <Link
                href="/requests"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-14 w-full gap-2 px-8 text-lg font-bold shadow-xl transition-all hover:scale-105 sm:w-auto"
                )}
              >
                <Search className="h-5 w-5" />
                Find Requests
              </Link>
              <Link
                href="/profile"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-14 w-full gap-2 bg-white px-8 text-lg font-bold text-slate-900 shadow-xl transition-all hover:scale-105 hover:bg-slate-100 sm:w-auto"
                )}
              >
                <HandHeart className="h-5 w-5" />
                Become a Donor
              </Link>
            </div>
          </div>
        </Container>

        {/* Live Impact Stats & Urgent Needs (Client Side) */}
        <Container as="section" className="relative z-20 -mt-16">
          <HomeRequests />
        </Container>

        {/* Main Content Area */}
        <Container className="flex flex-col gap-12 py-12 lg:flex-row">
          {/* Right Column: Features & Eligibility */}
          <div className="ml-auto flex w-full flex-col gap-8 lg:w-1/3">
            <EligibilityChecker />

            {/* Platform Features */}
            <div className="space-y-4">
              <h3 className="px-1 text-lg font-black tracking-tight">Why LifeDonors?</h3>
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
      <footer className="bg-background border-border mt-auto w-full border-t py-12">
        <Container className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="bg-primary shadow-primary/20 flex h-10 w-10 items-center justify-center rounded-xl shadow-lg">
              <Droplet className="h-6 w-6 fill-current text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter italic">LifeDonors</span>
          </div>
          <p className="text-muted-foreground text-sm font-medium">
            © 2024 LifeDonors Platform. Saving lives together.
          </p>
          <div className="flex gap-6">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              <span className="sr-only">Help</span>
              <Activity className="h-5 w-5" />
            </Link>
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              <span className="sr-only">About</span>
              <Users className="h-5 w-5" />
            </Link>
          </div>
        </Container>
      </footer>
    </div>
  );
}
