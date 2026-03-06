"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const Page = () => {
  return (
    <div className="bg-muted/30 flex min-h-screen flex-col items-center justify-center">
      <div className="shadow-primary/5 w-full max-w-md space-y-8 rounded-3xl border bg-white px-6 py-12 text-center shadow-xl dark:bg-slate-900">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground font-medium">Sign in to manage your donations and requests.</p>
        </div>
        <Button
          className="h-14 w-full gap-2 rounded-2xl text-lg font-black"
          onClick={async () => {
            await authClient.signIn.social({
              provider: "github",
              callbackURL: "/profile/setup",
            });
          }}
        >
          Sign in with GitHub
        </Button>
      </div>
    </div>
  );
};

export default Page;
