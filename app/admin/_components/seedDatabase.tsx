"use client";

import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Database, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function SeedDatabase() {
  const seedDatabase = useMutation(api.seed.seedDatabase);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    if (!confirm("Are you sure you want to seed the database? This can only be done when the database is empty."))
      return;
    setIsSeeding(true);
    try {
      const result = await seedDatabase();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to seed database");
    } finally {
      setIsSeeding(false);
    }
  };
  return (
    <div className="mt-auto space-y-4">
      <div className="border-primary/20 bg-background/50 rounded-2xl border border-dashed p-4">
        <p className="text-primary mb-2 text-xs font-bold tracking-wider uppercase">Data Seeding</p>
        <p className="text-muted-foreground mb-4 text-[10px] font-medium">
          Populate the database with demo entries from the asset library. This is only possible if the database is
          currently empty.
        </p>
        <Button
          onClick={handleSeed}
          disabled={isSeeding}
          className="shadow-primary/20 h-12 w-full gap-2 rounded-2xl font-bold shadow-lg"
        >
          {isSeeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
          Seed Database
        </Button>
      </div>
    </div>
  );
}
