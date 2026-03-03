"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RequestCard } from "@/components/RequestCard";
import { Filter } from "./_components/filters";
import { CreateRequest } from "./_components/createRequest";
import { useAtomValue } from "jotai";
import {
  filterBloodTypeAtom,
  filterDivisionAtom,
  filterDistrictAtom,
  filterSubDistrictAtom,
} from "@/state/requests/store";

export default function RequestsPage() {
  const filterBloodType = useAtomValue(filterBloodTypeAtom);
  const filterDivision = useAtomValue(filterDivisionAtom);
  const filterDistrict = useAtomValue(filterDistrictAtom);
  const filterSubDistrict = useAtomValue(filterSubDistrictAtom);

  const requests = useQuery(api.users.getAllRequests, {
    bloodType: filterBloodType === "ALL" ? undefined : filterBloodType,
    division: filterDivision === "ALL" ? undefined : filterDivision,
    district: filterDistrict === "ALL" ? undefined : filterDistrict,
    subDistrict: filterSubDistrict === "ALL" ? undefined : filterSubDistrict,
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Blood Requests</h1>
          <p className="text-muted-foreground">
            Help people in need of life-saving blood donations.
          </p>
        </div>

        <CreateRequest />
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border bg-muted/30">
        <Filter />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests === undefined ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
          ))
        ) : requests.length > 0 ? (
          requests.map((request) => (
            <RequestCard key={request._id} request={request} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-muted/20 rounded-xl border-2 border-dashed border-border">
            <h3 className="text-xl font-semibold mb-2">No Requests Found</h3>
            <p className="text-muted-foreground">
              Try selecting a different blood type or check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
