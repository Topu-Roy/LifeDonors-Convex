"use client";

import { Activity, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function EligibilityChecker() {
  return (
    <Card className="border-border group relative overflow-hidden shadow-lg">
      <div className="absolute top-0 right-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">
        <Sparkles className="text-primary h-24 w-24" />
      </div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Activity className="text-primary h-5 w-5" />
          Can I Donate?
        </CardTitle>
        <CardDescription>Take a quick check to see if you are eligible to donate blood today.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">Age</Label>
            <Select>
              <SelectTrigger className="bg-muted/50 border-border">
                <SelectValue placeholder="Select age range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16">16 - 17 (With consent)</SelectItem>
                <SelectItem value="18">18 - 65</SelectItem>
                <SelectItem value="65">65+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">Weight</Label>
            <Select>
              <SelectTrigger className="bg-muted/50 border-border">
                <SelectValue placeholder="Select weight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Under 110 lbs (50kg)</SelectItem>
                <SelectItem value="ok">110 lbs (50kg) or more</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Felt well today?
            </Label>
            <RadioGroup defaultValue="yes" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes" className="text-sm font-medium">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no" className="text-sm font-medium">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <Button className="shadow-primary/20 w-full font-bold shadow-lg">Check Eligibility</Button>
      </CardContent>
    </Card>
  );
}
