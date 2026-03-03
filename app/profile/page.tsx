"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import {
  User,
  Edit2,
  Calendar,
  Activity,
  Phone,
  Droplet,
  MapPin,
  Heart,
} from "lucide-react";
import { ProfileForm } from "./_components/profileForm";

export default function ProfilePage() {
  const profile = useQuery(api.users.getMyProfile);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex items-center gap-5">
          <div className="bg-primary/10 p-4 rounded-2xl">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Profile</h1>
            <p className="text-lg text-muted-foreground">
              Manage your health metrics and donor status.
            </p>
          </div>
        </div>
        {profile && (
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(true)}
            className="rounded-full px-6 shadow-sm hover:bg-muted transition-colors"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="space-y-12">
        {/* Core Stats Section */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex items-center gap-4 p-2">
              <div className="bg-primary/10 p-3 rounded-full">
                <Droplet className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Blood Type
                </p>
                <p className="text-3xl font-black text-primary">
                  {profile?.bloodType || "--"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-2">
              <div className="bg-muted p-3 rounded-full">
                <Activity className="h-7 w-7 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Current BMI
                </p>
                <p className="text-3xl font-black text-foreground">
                  {profile?.bmi || "--"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Detailed Info Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Heart className="h-5 w-5 text-primary/70" />
            <h2 className="text-xl font-bold">Health Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
            <InfoItem
              icon={<User className="h-5 w-5" />}
              label="Age"
              value={
                profile?.age ? `${profile.age} years old` : "Not specified"
              }
            />
            <InfoItem
              icon={<Activity className="h-5 w-5" />}
              label="Hemoglobin"
              value={
                profile?.hemoglobinLevel
                  ? `${profile.hemoglobinLevel} g/dL`
                  : "Not specified"
              }
            />
            <InfoItem
              icon={<Phone className="h-5 w-5" />}
              label="Phone Number"
              value={profile?.phoneNumber || "Not specified"}
            />
            <InfoItem
              icon={<MapPin className="h-5 w-5" />}
              label="Preferred Location"
              value={
                profile?.division
                  ? `${profile.subDistrict}, ${profile.district}, ${profile.division}`
                  : "Not specified"
              }
            />
            <InfoItem
              icon={<Calendar className="h-5 w-5" />}
              label="Last Donation"
              value={
                profile?.lastDonationDate
                  ? new Date(profile.lastDonationDate).toLocaleDateString(
                      undefined,
                      { dateStyle: "long" },
                    )
                  : "No prior donations recorded"
              }
            />
          </div>
        </section>

        {profile?.diseases && profile.diseases.length > 0 && (
          <>
            <Separator />
            <section>
              <h2 className="text-xl font-bold mb-4">Conditions & Remarks</h2>
              <div className="flex flex-wrap gap-2">
                {profile.diseases.map((disease) => (
                  <Badge
                    key={disease}
                    variant="secondary"
                    className="px-3 py-1 text-sm font-medium rounded-md"
                  >
                    {disease}
                  </Badge>
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Update Profile
            </DialogTitle>
            <DialogDescription>
              Accurate information helps us match you with urgent needs safely.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="text-muted-foreground mt-1 group-hover:text-primary transition-colors">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-tight">
          {label}
        </p>
        <p className="text-lg font-medium text-foreground tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}
