import { Container } from "@/components/Container";
import { Droplet } from "lucide-react";
import { SetupWizard } from "./_components/SetupWizard";
import { Suspense } from "react";

export default function ProfileSetupPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <Container as="main" className="flex-1 py-12 flex flex-col gap-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 shadow-sm border border-primary/20 shrink-0">
                <Droplet className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                Profile Setup
              </h1>
            </div>
          </div>
        </header>

        <Suspense
          fallback={
            <div className="h-96 w-full animate-pulse bg-muted/50 rounded-3xl" />
          }
        >
          <SetupWizard />
        </Suspense>

        {/* Motivation Footer */}
        <footer className="text-center py-4">
          <p className="text-muted-foreground font-medium italic text-sm">
            &quot;Your 15 minutes can save 3 lives. Thank you for being a
            hero.&quot;
          </p>
        </footer>
      </Container>
    </div>
  );
}
