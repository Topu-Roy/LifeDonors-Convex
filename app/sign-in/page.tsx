"use client";

import { Github } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4 pt-20">
      <div className="shadow-primary/5 w-full max-w-md space-y-8 rounded-3xl border bg-white px-6 py-12 text-center shadow-xl dark:bg-slate-900">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground font-medium">Sign in to manage your donations and requests.</p>
        </div>
        <Button
          className="hover:bg-primary/80 flex h-14 w-full items-center justify-center gap-4 text-lg font-semibold"
          onClick={async () => {
            await authClient.signIn.social({
              provider: "github",
              callbackURL: "/profile/setup",
            });
          }}
        >
          <Github className="size-5" strokeWidth={2} />
          Sign in with GitHub
        </Button>
      </div>
    </div>
  );
}
