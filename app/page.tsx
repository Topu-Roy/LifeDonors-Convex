import { Container } from "@/components/Container";
import {
  Search,
  HandHeart,
  ShieldCheck,
  Users,
  Activity,
  Droplet,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { HomeRequests } from "./_components/HomeRequests";
import { EligibilityChecker } from "./_components/EligibilityChecker";
import { FeatureItem } from "./_components/HomeFeatureItem";

export default function Home() {
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

        {/* Live Impact Stats & Urgent Needs (Client Side) */}
        <Container as="section" className="-mt-16 z-20 relative">
          <HomeRequests />
        </Container>

        {/* Main Content Area */}
        <Container className="py-12 flex flex-col lg:flex-row gap-12">
          {/* Right Column: Features & Eligibility */}
          <div className="w-full lg:w-1/3 flex flex-col gap-8 ml-auto">
            <EligibilityChecker />

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
