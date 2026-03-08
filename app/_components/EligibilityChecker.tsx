"use client";

import { useState } from "react";
import { Activity, AlertCircle, Calendar, CheckCircle2, Pill, RotateCcw, Sparkles, Syringe } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Status = "idle" | "eligible" | "not-eligible" | "error";

export function EligibilityChecker() {
  const [age, setAge] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [feltWell, setFeltWell] = useState<string>("yes");
  const [lastDonation, setLastDonation] = useState<string>("never"); // "yes" (8+ wks), "no" (<8 wks), "never"
  const [recentTattoo, setRecentTattoo] = useState<string>("no"); // within 4 months
  const [antibiotics, setAntibiotics] = useState<string>("no");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  const handleCheck = () => {
    if (!age || !weight || !height) {
      setStatus("error");
      setMessage("Please complete all fields.");
      return;
    }

    if (weight === "low") {
      setStatus("not-eligible");
      setMessage("You must weigh at least 110 lbs (50kg) to safely donate blood.");
      return;
    }

    if (height === "short") {
      setStatus("not-eligible");
      setMessage("For safety reasons related to blood volume, you must be at least 4'10\" (147cm) tall.");
      return;
    }

    if (feltWell === "no") {
      setStatus("not-eligible");
      setMessage("You must be feeling well and healthy today to donate.");
      return;
    }

    if (lastDonation === "no") {
      setStatus("not-eligible");
      setMessage("Standard spacing between donations is 56 days (8 weeks). Please wait a bit longer.");
      return;
    }

    if (recentTattoo === "yes") {
      setStatus("not-eligible");
      setMessage("There is a 4-month deferral period for new tattoos, piercings, or cosmetic injectables.");
      return;
    }

    if (antibiotics === "yes") {
      setStatus("not-eligible");
      setMessage("You must finish your course of antibiotics and be symptom-free for at least 7 days.");
      return;
    }

    setStatus("eligible");
  };

  const handleReset = () => {
    setAge("");
    setWeight("");
    setHeight("");
    setFeltWell("yes");
    setLastDonation("never");
    setRecentTattoo("no");
    setAntibiotics("no");
    setStatus("idle");
    setMessage("");
  };

  return (
    <Card className="border-border group relative overflow-hidden shadow-lg transition-all duration-300">
      <div className="pointer-events-none absolute top-0 right-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">
        <Sparkles className="text-primary h-24 w-24" />
      </div>
      <CardHeader className="pb-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
              <Activity className="text-primary h-6 w-6" />
              Can I Donate Today?
            </CardTitle>
            <CardDescription className="text-muted-foreground/80 text-base">
              Complete this brief health check to verify your eligibility for blood donation.
            </CardDescription>
          </div>
          <div className="bg-primary/5 border-primary/10 flex items-center gap-2 rounded-full border px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
              <span className="bg-primary relative inline-flex h-2 w-2 rounded-full"></span>
            </span>
            <span className="text-primary text-xs font-semibold tracking-wider uppercase">Live Health Check</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {status === "idle" || status === "error" ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-2">
              {/* Left Column: Physical Attributes */}
              <div className="space-y-6">
                <div className="border-border/50 flex items-center gap-2 border-b pb-2">
                  <div className="bg-primary/10 rounded-md p-1.5">
                    <Activity className="text-primary h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold tracking-tight uppercase">Physical Attributes</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                      Age Group
                    </Label>
                    <Select value={age} onValueChange={val => setAge(val ?? "")}>
                      <SelectTrigger className="bg-muted/30 border-border h-10 w-full">
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16">16 - 17 Years</SelectItem>
                        <SelectItem value="18">18 - 65 Years</SelectItem>
                        <SelectItem value="65">Over 65 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                      Current Weight
                    </Label>
                    <Select value={weight} onValueChange={val => setWeight(val ?? "")}>
                      <SelectTrigger className="bg-muted/30 border-border h-10 w-full">
                        <SelectValue placeholder="Select weight" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Under 110 lbs (50kg)</SelectItem>
                        <SelectItem value="ok">110 lbs (50kg) or more</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                      Height Range
                    </Label>
                    <Select value={height} onValueChange={val => setHeight(val ?? "")}>
                      <SelectTrigger className="bg-muted/30 border-border h-10 w-full">
                        <SelectValue placeholder="Select height" />
                      </SelectTrigger>
                      <SelectContent className={"p-2"}>
                        <SelectItem value="short">4&apos;10&quot; (147cm) or below</SelectItem>
                        <SelectItem value="ok">4&apos;10&quot; (147cm) or above</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="bg-muted/20 border-border/40 flex flex-col gap-3 rounded-xl border p-4">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="text-primary h-3.5 w-3.5" />
                          <Label className="text-sm font-bold">Last Donation</Label>
                        </div>
                        <p className="text-muted-foreground text-[11px] leading-relaxed">
                          Standard gap is 56 days. Was your last donation over 8 weeks ago?
                        </p>
                      </div>
                      <RadioGroup value={lastDonation} onValueChange={setLastDonation} className="flex gap-3">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="last-yes" />
                          <Label htmlFor="last-yes" className="cursor-pointer text-xs font-medium">
                            Yes
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="last-no" />
                          <Label htmlFor="last-no" className="cursor-pointer text-xs font-medium">
                            No
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="never" id="last-never" />
                          <Label htmlFor="last-never" className="cursor-pointer text-xs font-medium">
                            First Time
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Health Screening */}
              <div className="space-y-6">
                <div className="border-border/50 flex items-center gap-2 border-b pb-2">
                  <div className="bg-primary/10 rounded-md p-1.5">
                    <Sparkles className="text-primary h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold tracking-tight uppercase">Health Screening</h3>
                </div>

                <div className="space-y-5">
                  <div className="bg-muted/20 border-border/40 group/item hover:border-primary/20 flex flex-col justify-between gap-4 rounded-xl border p-4 transition-colors sm:flex-row sm:items-center">
                    <div className="w-full space-y-1">
                      <Label className="text-sm font-bold">General Wellness</Label>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        Are you feeling healthy, well, and symptom-free today?
                      </p>
                    </div>
                    <RadioGroup value={feltWell} onValueChange={setFeltWell} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="felt-yes" />
                        <Label htmlFor="felt-yes" className="cursor-pointer text-xs font-medium">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="felt-no" />
                        <Label htmlFor="felt-no" className="cursor-pointer text-xs font-medium">
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="bg-muted/20 border-border/40 group/item hover:border-primary/20 flex flex-col justify-between gap-4 rounded-xl border p-4 transition-colors sm:flex-row sm:items-center">
                    <div className="w-full space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Syringe className="text-primary h-3.5 w-3.5" />
                        <Label className="text-sm font-bold">Tattoos & Piercings</Label>
                      </div>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        Any new ink or piercings in the last 4 months?
                      </p>
                    </div>
                    <RadioGroup value={recentTattoo} onValueChange={setRecentTattoo} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="ink-yes" />
                        <Label htmlFor="ink-yes" className="cursor-pointer text-xs font-medium">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="ink-no" />
                        <Label htmlFor="ink-no" className="cursor-pointer text-xs font-medium">
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="bg-muted/20 border-border/40 group/item hover:border-primary/20 flex flex-col justify-between gap-4 rounded-xl border p-4 transition-colors sm:flex-row sm:items-center">
                    <div className="w-full space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Pill className="text-primary h-3.5 w-3.5" />
                        <Label className="text-sm font-bold">Medication Check</Label>
                      </div>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        Are you currently taking any antibiotics?
                      </p>
                    </div>
                    <RadioGroup value={antibiotics} onValueChange={setAntibiotics} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="meds-yes" />
                        <Label htmlFor="meds-yes" className="cursor-pointer text-xs font-medium">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="meds-no" />
                        <Label htmlFor="meds-no" className="cursor-pointer text-xs font-medium">
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              {status === "error" && (
                <div className="bg-destructive/10 text-destructive animate-in fade-in zoom-in-95 border-destructive/20 flex items-center gap-2 rounded-lg border p-4 text-sm duration-200">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span className="font-semibold">{message}</span>
                </div>
              )}

              <Button
                onClick={handleCheck}
                className="shadow-primary/20 group h-12 w-full text-base font-bold shadow-xl md:mx-auto md:w-auto md:min-w-[240px]"
              >
                Check Eligibility Status
                <Sparkles className="ml-2 h-4 w-4 transition-transform group-hover:rotate-12" />
              </Button>
            </div>
          </div>
        ) : status === "eligible" ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto flex max-w-2xl flex-col items-center justify-center space-y-6 py-12 text-center">
            <div className="bg-primary/10 ring-primary/5 rounded-full p-6 ring-12">
              <CheckCircle2 className="text-primary h-16 w-16" />
            </div>
            <div className="space-y-3">
              <h3 className="text-foreground text-3xl font-black tracking-tight">
                You{"'"}re Ready to Save Lives!
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Excellent! Based on your screening, you meet the primary criteria for blood donation today.
                {age === "16" && " Please remember to bring signed parental consent."}
                {age === "65" && " A brief medical consultation may be required at the site."}
              </p>
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-4 pt-6 sm:flex-row">
              <Link href="/requests">
                <Button className="shadow-primary/30 h-12 w-full px-4 text-base font-bold shadow-2xl sm:flex-1">
                  Find Donation Centers
                </Button>
              </Link>
              <Button
                onClick={handleReset}
                variant="outline"
                className="text-muted-foreground hover:text-foreground h-12 w-full gap-2 px-8 sm:w-auto"
              >
                <RotateCcw className="h-4 w-4" />
                Start Fresh
              </Button>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto flex max-w-2xl flex-col items-center justify-center space-y-6 py-12 text-center">
            <div className="bg-destructive/10 ring-destructive/5 rounded-full p-6 ring-12">
              <AlertCircle className="text-destructive h-16 w-16" />
            </div>
            <div className="space-y-3">
              <h3 className="text-destructive text-3xl font-black tracking-tight">Not for Today</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">{message}</p>
            </div>
            <div className="w-full pt-6">
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-destructive/20 hover:bg-destructive/5 hover:text-destructive h-12 w-full gap-2 px-12 text-base font-bold transition-all sm:w-auto"
              >
                <RotateCcw className="h-4 w-4" />
                Try Re-checking
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
