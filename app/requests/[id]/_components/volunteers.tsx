"use client";

import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { CheckCircle2, Heart, LogIn, MapPin, User, XCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  requestId: Id<"requests">;
  volunteers: {
    donor: {
      _id: Id<"profiles">;
      _creationTime: number;
      division?: string | undefined;
      district?: string | undefined;
      subDistrict?: string | undefined;
      userId: string;
      age: number;
      bmi: number;
      bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
      hemoglobinLevel: number;
      diseases: string[];
      phoneNumber: string;
      lastDonationDate: number;
    } | null;
    _id: Id<"donations">;
    _creationTime: number;
    acceptedAt?: number | undefined;
    status: "Accepted" | "Cancelled" | "Offered" | "Donated" | "No Show" | "Withdrawn" | "Rejected";
    donorId: string;
    requestId: Id<"requests">;
  }[];
  isOwner: boolean;
};

export function Volunteers({ volunteers, requestId, isOwner }: Props) {
  const { isAuthenticated } = useConvexAuth();
  const selectDonor = useMutation(api.donations.selectDonor);
  const rejectDonor = useMutation(api.donations.rejectDonor);
  const updateDonationStatus = useMutation(api.donations.updateDonationStatus);
  const offerDonation = useMutation(api.donations.offerDonation);

  const [isOffering, setIsOffering] = useState(false);

  const handleSelectDonor = async (donationId: Id<"donations">) => {
    try {
      await selectDonor({ donationId });
      toast.success("Donor selected!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to select donor");
    }
  };

  const handleRejectDonor = async (donationId: Id<"donations">) => {
    try {
      await rejectDonor({ donationId, requestId });
      toast.success("Donor rejected");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reject donor");
    }
  };

  const handleUpdateStatus = async (donationId: Id<"donations">, status: "Donated" | "No Show") => {
    try {
      await updateDonationStatus({ donationId, status });
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleOfferHelp = async () => {
    setIsOffering(true);
    try {
      await offerDonation({ requestId });
      toast.success("Thank you for volunteering! The requester will be notified.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to offer help");
    } finally {
      setIsOffering(false);
    }
  };

  // Check if current user has already volunteered
  // Note: Since we can't easily get the userId from useConvexAuth directly in a clean way
  // without another query, and we know `donorId` in donations is the Better Auth subject,
  // we can use the same logic as elsewhere or just check if any donation belongs to the user
  // if we had their ID. Let's use getMyProfile to be sure.
  const myProfile = useQuery(api.users.getMyProfile);
  const hasVolunteered = volunteers.some(v => v.donorId === myProfile?.userId);
  const myDonation = volunteers.find(v => v.donorId === myProfile?.userId);

  return (
    <div className="space-y-10 lg:col-span-2">
      {isOwner ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight">
              Potential Volunteers
              <span className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-black">
                {volunteers.length}
              </span>
            </h2>
          </div>

          {volunteers.length === 0 ? (
            <div className="border-primary/10 rounded-3xl border-2 border-dashed bg-white py-20 text-center dark:bg-slate-900">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 dark:bg-slate-800">
                <User className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="mb-2 text-xl font-black">No volunteers yet</h3>
              <p className="mx-auto max-w-xs font-medium text-slate-500 dark:text-slate-400">
                As soon as donors respond to this request, they will appear here for your review.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {volunteers.map(v => (
                <Card
                  key={v._id}
                  className={cn(
                    "group overflow-hidden rounded-3xl border-2 transition-all duration-300",
                    v.status === "Accepted" || v.status === "Donated"
                      ? "border-primary/40 shadow-primary/5 scale-100 shadow-lg"
                      : "border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900"
                  )}
                >
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                      <div className="flex items-center gap-6">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 sm:h-16 sm:w-16 dark:bg-slate-800">
                          <User className="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-black tracking-tight sm:text-xl">
                              {v.donor?.phoneNumber ?? "Private Donor"}
                            </span>
                            <Badge
                              className={cn(
                                "rounded-full border-none px-3 py-0.5 text-[9px] font-black tracking-widest uppercase",
                                v.status === "Donated" && "bg-green-500 text-white",
                                v.status === "Accepted" && "bg-primary text-slate-900",
                                v.status === "Offered" && "bg-slate-100 text-slate-500"
                              )}
                            >
                              {v.status}
                            </Badge>
                          </div>
                          {v.donor && (
                            <p className="flex items-center gap-1 text-xs font-bold text-slate-500">
                              <MapPin className="h-3 w-3" />
                              {v.donor.district && `${v.donor.subDistrict}, ${v.donor.district}`}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
                        {v.status === "Offered" && (
                          <>
                            <AlertDialog>
                              <AlertDialogTrigger
                                render={props => (
                                  <Button
                                    {...props}
                                    className="bg-primary h-12 w-full rounded-xl font-bold text-slate-900 transition-transform hover:scale-105 sm:w-auto"
                                  >
                                    Select Donor
                                  </Button>
                                )}
                              />

                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Select Donor</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to select this donor? Their contact info will become
                                    fully visible to you.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleSelectDonor(v._id)}>
                                    Confirm Selection
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                              <AlertDialogTrigger
                                render={props => (
                                  <Button
                                    {...props}
                                    variant="ghost"
                                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-red-500 hover:bg-red-50 sm:w-12 sm:gap-0 dark:hover:bg-red-950/20"
                                  >
                                    <XCircle className="h-6 w-6" />
                                    <span className="font-bold sm:hidden">Reject Donor</span>
                                  </Button>
                                )}
                              />
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Reject Donor</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to reject this volunteer? They will be notified and this
                                    cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 text-white hover:bg-red-700"
                                    onClick={() => handleRejectDonor(v._id)}
                                  >
                                    Reject
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                        {v.status === "Accepted" && (
                          <>
                            <AlertDialog>
                              <AlertDialogTrigger
                                render={props => (
                                  <Button
                                    {...props}
                                    className="h-12 w-full gap-2 rounded-xl bg-green-600 font-bold text-white transition-transform hover:scale-105 hover:bg-green-700 sm:w-auto"
                                  >
                                    <CheckCircle2 className="h-5 w-5" />
                                    Mark Donated
                                  </Button>
                                )}
                              />
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirm Donation</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure this donor has successfully completed the donation? This updates
                                    your fulfillment progress.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-green-600 text-white hover:bg-green-700"
                                    onClick={() => handleUpdateStatus(v._id, "Donated")}
                                  >
                                    Confirm
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                              <AlertDialogTrigger
                                render={props => (
                                  <Button
                                    {...props}
                                    variant="outline"
                                    className="h-12 w-full rounded-xl border-red-200 font-bold text-red-600 transition-all hover:bg-red-50 sm:w-auto"
                                  >
                                    No Show
                                  </Button>
                                )}
                              />

                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Report No Show</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure the donor failed to show up? This will mark their donation log
                                    negatively.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 text-white hover:bg-red-700"
                                    onClick={() => handleUpdateStatus(v._id, "No Show")}
                                  >
                                    Confirm No Show
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      ) : (
        <Card className="border-primary/10 shadow-primary/5 relative min-h-[450px] overflow-hidden rounded-[3rem] border-2 bg-white p-8 shadow-2xl md:p-12 dark:bg-slate-900">
          <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 opacity-5 dark:opacity-10">
            <Heart className="text-primary h-full w-full fill-current" />
          </div>

          <div className="relative z-10 flex h-full flex-col justify-center space-y-10">
            <div className="space-y-4 text-center">
              <div className="bg-primary/10 mx-auto flex h-24 w-24 items-center justify-center rounded-4xl">
                <Heart className="text-primary fill-primary/20 h-12 w-12" />
              </div>
              <h2 className="text-3xl font-black tracking-tighter md:text-4xl">Volunteer to Save a Life</h2>
              <p className="mx-auto max-w-md font-medium text-slate-500 dark:text-slate-400">
                Your donation can be the difference someone needs today. Join our network of heroes.
              </p>
            </div>

            <div className="flex justify-center">
              {!isAuthenticated ? (
                <div className="border-primary/10 w-full max-w-sm space-y-6 rounded-4xl border-2 border-dashed p-8 text-center">
                  <p className="text-sm font-bold text-slate-500">
                    Sign in to volunteer and connect with the requester.
                  </p>
                  <Link href="/sign-in" className="block">
                    <Button className="h-14 w-full gap-2 rounded-2xl text-lg font-black shadow-xl transition-transform hover:scale-105 active:scale-95">
                      <LogIn className="h-5 w-5" />
                      Sign In to Volunteer
                    </Button>
                  </Link>
                </div>
              ) : hasVolunteered ? (
                <div className="border-primary/20 bg-primary/5 w-full max-w-md space-y-6 rounded-[2.5rem] border-2 border-dashed p-10 text-center">
                  <div className="bg-primary shadow-primary/20 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg">
                    <CheckCircle2 className="h-10 w-10 text-slate-900" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black italic">You have Volunteered!</h3>
                    <p className="font-medium text-slate-600 dark:text-slate-300">
                      Thank you for your kindness. Current status:{" "}
                      <Badge className="bg-primary ml-1 text-[10px] font-black tracking-widest text-slate-900 uppercase">
                        {myDonation?.status}
                      </Badge>
                    </p>
                  </div>
                  <p className="mt-4 text-xs font-bold tracking-tighter text-slate-400 uppercase">
                    The requester will contact you if they select your offer.
                  </p>
                </div>
              ) : (
                <div className="flex w-full max-w-md flex-col items-center gap-6">
                  <Button
                    onClick={handleOfferHelp}
                    disabled={isOffering}
                    className="shadow-primary/30 h-20 w-full rounded-4xl text-2xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95"
                  >
                    {isOffering ? "Processing heroes..." : "I Want to Help"}
                  </Button>
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase italic">
                    By clicking, you commit to being available for this donation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
