import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { AlertCircle, Calendar, CheckCircle2, Link } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function Eligibility() {
  const eligibility = useQuery(api.users.checkEligibility);

  if (!eligibility) return <Spinner />;

  return (
    <section
      className={cn(
        "relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl border p-8 shadow-xl md:flex-row md:items-center",
        eligibility.eligible
          ? "bg-primary/5 border-primary/20 border-l-primary border-l-12"
          : "border-l-12 border-amber-500/20 border-l-amber-500 bg-amber-500/5"
      )}
    >
      <div className="relative z-10 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {eligibility.eligible ? (
            <CheckCircle2 className="text-primary h-6 w-6 shrink-0" />
          ) : (
            <AlertCircle className="h-6 w-6 shrink-0 text-amber-500" />
          )}
          <h3 className="text-xl font-black tracking-tight md:text-2xl">
            Eligibility: {eligibility.eligible ? "Eligible" : "Pending"}
          </h3>
        </div>
        <p className="text-muted-foreground max-w-2xl text-base leading-relaxed font-medium md:text-lg">
          {eligibility.eligible
            ? "Great news! You are currently eligible to make a life-saving blood donation today. Your community needs you."
            : (eligibility.reason ??
              "You are currently in a waiting period. Check back later to see when you can donate again.")}
        </p>
      </div>

      <Link
        href={eligibility.eligible ? "/requests" : "#"}
        className={cn(
          buttonVariants({
            variant: eligibility.eligible ? "default" : "outline",
          }),
          "h-12 w-full shrink-0 rounded-2xl px-8 font-black whitespace-nowrap shadow-lg transition-all md:w-auto",
          !eligibility.eligible && "bg-muted text-muted-foreground pointer-events-none shadow-none"
        )}
      >
        <Calendar className="mr-2 h-5 w-5" />
        {eligibility.eligible ? "Find Urgent Requests" : "Wait for Rest"}
      </Link>
    </section>
  );
}
