"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  User,
  Edit2,
  Calendar,
  Activity,
  Phone,
  Droplet,
  MapPin,
} from "lucide-react";
import { ProfileForm } from "./_components/profileForm";

export default function ProfilePage() {
  const profile = useQuery(api.users.getMyProfile);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-primary/10 p-3 rounded-full">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Donor Profile</h1>
          <p className="text-muted-foreground">
            Keep your health metrics updated for eligibility.
          </p>
        </div>
      </div>

      <Card className="border-t-4 border-t-primary shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-xl font-bold">
              Health Information
            </CardTitle>
            <CardDescription>
              Your current donor profile and eligibility metrics.
            </CardDescription>
          </div>
          {profile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
              className="gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-muted/50 p-4 rounded-xl border border-border flex flex-col items-center justify-center text-center">
                <div className="bg-primary/10 p-2 rounded-full mb-2">
                  <Droplet className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Blood Type
                </span>
                <span className="text-2xl font-bold text-primary">
                  {profile?.bloodType || "--"}
                </span>
              </div>
              <div className="bg-muted/50 p-4 rounded-xl border border-border flex flex-col items-center justify-center text-center">
                <div className="bg-muted p-2 rounded-full mb-2">
                  <Activity className="h-6 w-6 text-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">BMI</span>
                <span className="text-2xl font-bold text-foreground">
                  {profile?.bmi || "--"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-sm border-b pb-1">
                Donor Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Age</p>
                    <p className="font-medium">
                      {profile?.age ? `${profile.age} years` : "Not set"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Hemoglobin</p>
                    <p className="font-medium">
                      {profile?.hemoglobinLevel
                        ? `${profile.hemoglobinLevel} g/dL`
                        : "Not set"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">
                      {profile?.phoneNumber || "Not set"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium text-sm">
                      {profile?.division
                        ? `${profile.subDistrict}, ${profile.district}, ${profile.division}`
                        : "Not set"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Last Donation
                    </p>
                    <p className="font-medium">
                      {profile?.lastDonationDate
                        ? new Date(
                            profile.lastDonationDate,
                          ).toLocaleDateString()
                        : "None recorded"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {profile?.diseases && profile.diseases.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm border-b pb-1">
                  Conditions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.diseases.map((disease) => (
                    <Badge key={disease} variant="secondary">
                      {disease}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Health Profile</DialogTitle>
            <DialogDescription>
              Please provide accurate health information for blood donation
              eligibility.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
