"use client";

import { Activity, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function EligibilityChecker() {
  return (
    <Card className="shadow-lg border-border relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Sparkles className="h-24 w-24 text-primary" />
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Can I Donate?
        </CardTitle>
        <CardDescription>
          Take a quick check to see if you are eligible to donate blood today.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Age
            </Label>
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
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Weight
            </Label>
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
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
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
        <Button className="w-full font-bold shadow-lg shadow-primary/20">
          Check Eligibility
        </Button>
      </CardContent>
    </Card>
  );
}
