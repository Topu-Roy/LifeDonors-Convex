"use client";

import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { AlertCircle, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Container } from "@/components/Container";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function DangerZone({ requestId }: { requestId: Id<"requests"> }) {
  const request = useQuery(api.requests.getRequestById, { requestId });
  const cancelRequest = useMutation(api.requests.cancelRequest);
  const router = useRouter();

  if (request === undefined) {
    return (
      <Container className="space-y-8 py-12">
        <Skeleton className="h-10 w-48 rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Skeleton className="h-96 rounded-3xl md:col-span-2" />
          <Skeleton className="h-96 rounded-3xl" />
        </Skeleton>
      </Container>
    );
  }

  if (request === null) {
    return (
      <Container className="max-w-md space-y-6 py-24 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-red-100 dark:bg-red-900/20">
          <AlertCircle className="h-12 w-12 text-red-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Request Not Found</h1>
          <p className="leading-relaxed font-medium text-slate-500 dark:text-slate-400">
            This request doesn&apos;t exist or you don&apos;t have permission to view it.
          </p>
        </div>
        <Link
          href="/requests"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "border-primary/20 h-12 rounded-2xl px-8 font-bold"
          )}
        >
          Back to All Requests
        </Link>
      </Container>
    );
  }

  const handleCancelRequest = async () => {
    try {
      await cancelRequest({ requestId: request._id });
      toast.success("Request cancelled");
      router.push("/requests");
    } catch {
      toast.error("Failed to cancel request");
    }
  };

  return (
    <>
      {request.isOwner && request.status !== "Cancelled" && request.status !== "Completed" ? (
        <section className="border-t border-red-100 pt-10 dark:border-red-900/20">
          <div className="flex flex-col items-center justify-between gap-8 rounded-3xl border-2 border-dashed border-red-200 bg-red-50/50 p-8 md:flex-row md:p-10 dark:border-red-900/40 dark:bg-red-950/10">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <ShieldAlert className="h-6 w-6 text-red-600" />
                <h3 className="text-xl font-black tracking-tighter text-red-600 uppercase italic">Danger Zone</h3>
              </div>
              <p className="max-w-sm text-sm font-bold text-slate-500 dark:text-slate-400">
                Cancel this blood request. This will notify all volunteers and mark request as inactive.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger
                render={props => (
                  <Button
                    {...props}
                    variant="destructive"
                    className="h-14 rounded-2xl px-10 text-base font-black shadow-xl shadow-red-500/20 transition-all active:scale-95"
                  >
                    Cancel Entire Request
                  </Button>
                )}
              />

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will cancel the entire request. It will notify all volunteers and mark the request as
                    inactive. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Request</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancelRequest}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Cancel Request
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>
      ) : null}
    </>
  );
}
