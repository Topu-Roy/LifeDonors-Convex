"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/30">
      <div className="max-w-md w-full px-6 py-12 text-center space-y-8 bg-white dark:bg-slate-900 rounded-3xl border shadow-xl shadow-primary/5">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground font-medium">
            Sign in to manage your donations and requests.
          </p>
        </div>
        <Button
          className="w-full h-14 rounded-2xl font-black text-lg gap-2"
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
