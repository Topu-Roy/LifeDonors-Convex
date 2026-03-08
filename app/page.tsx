import { EligibilityChecker } from "@/app/_components/EligibilityChecker";
import { FeatureItem } from "@/app/_components/HomeFeatureItem";
import { HomeRequests } from "@/app/_components/HomeRequests";
import BloodDonationImage from "@/assets/images/blood-donation.jpg";
import { Activity, Droplet, HandHeart, Search, ShieldCheck, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex w-full flex-1 flex-col items-center">
        {/* Hero Section */}
        <Container as="section" className="relative overflow-hidden py-8">
          <div className="relative z-10 flex min-h-[500px] flex-col items-center justify-center gap-8 overflow-hidden rounded-4xl border border-white/10 p-8 shadow-2xl">
            <Image
              src={BloodDonationImage}
              alt="Blood Donation"
              className="absolute inset-0 object-cover brightness-50"
            />
            <div className="relative z-20 flex max-w-3xl flex-col gap-4 text-center">
              <h1 className="animate-in fade-in slide-in-from-top-4 text-4xl leading-[1.1] font-black tracking-tighter text-white duration-1000 sm:text-5xl md:text-7xl">
                Give Blood.
                <br />
                <span className="text-primary italic">Save a Life.</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed font-medium text-balance text-white opacity-90 text-shadow-md md:text-xl">
                Find nearby blood requests, donate safely, and help save lives in your community.
              </p>
            </div>
            <div className="relative z-20 mt-4 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
              <Button
                className={"h-14 w-full px-6 text-lg font-bold shadow-xl transition-all hover:scale-105 sm:w-auto"}
              >
                <Link href="/requests" className="flex items-center justify-center gap-4">
                  <Search strokeWidth={3} size={20} className="size-4.5" />
                  Find Requests
                </Link>
              </Button>
              <Button
                className={
                  "h-14 w-full bg-white px-6 text-lg font-bold text-slate-900 shadow-xl transition-all hover:scale-105 hover:bg-slate-100 sm:w-auto"
                }
              >
                <Link href="/profile" className="flex items-center justify-center gap-4">
                  <HandHeart strokeWidth={2.5} size={20} className="size-4.5" />
                  Become a Donor
                </Link>
              </Button>
            </div>
          </div>
        </Container>

        {/* Live Impact Stats & Urgent Needs (Client Side) */}
        <Container as="section" className="relative z-20 -mt-16">
          <HomeRequests />
        </Container>

        {/* Main Content Area */}
        <Container className="flex flex-col gap-12 py-20 lg:flex-row">
          {/* Right Column: Features & Eligibility */}
          <div className="grid w-full grid-cols-1 gap-20">
            <div className="">
              <EligibilityChecker />
            </div>

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
