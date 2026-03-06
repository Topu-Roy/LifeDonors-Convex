"use client";

import { useState } from "react";
import { api } from "@/convex/_generated/api";
import {
  filterBloodTypeAtom,
  filterDistrictAtom,
  filterDivisionAtom,
  filterSubDistrictAtom,
  filterUrgencyAtom,
} from "@/state/requests/store";
import { useQuery } from "convex/react";
import { useAtom } from "jotai";
import { Filter as FilterIcon, Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { RequestCard } from "@/components/RequestCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "./filters";

export function RequestsExplorer() {
  const [filterBloodType, setFilterBloodType] = useAtom(filterBloodTypeAtom);
  const [filterDivision, setFilterDivision] = useAtom(filterDivisionAtom);
  const [filterDistrict, setFilterDistrict] = useAtom(filterDistrictAtom);
  const [filterSubDistrict, setFilterSubDistrict] = useAtom(filterSubDistrictAtom);
  const [filterUrgency, setFilterUrgency] = useAtom(filterUrgencyAtom);
  const [searchQuery, setSearchQuery] = useState("");

  const requests = useQuery(api.requests.getAllRequests, {
    bloodType: filterBloodType === "ALL" ? undefined : filterBloodType,
    division: filterDivision === "ALL" ? undefined : filterDivision,
    district: filterDistrict === "ALL" ? undefined : filterDistrict,
    subDistrict: filterSubDistrict === "ALL" ? undefined : filterSubDistrict,
    urgency: filterUrgency === "ALL" ? undefined : filterUrgency,
  });

  const filteredRequests = requests?.filter(
    r =>
      r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.bloodTypeNeeded.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeFiltersCount = [
    filterBloodType,
    filterDivision,
    filterDistrict,
    filterSubDistrict,
    filterUrgency,
  ].filter(f => f && f !== "ALL").length;

  return (
    <div className="flex flex-col gap-10 lg:flex-row">
      {/* Search and Mobile Filters Section */}
      <div className="absolute top-[-90px] right-0 flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-center md:w-auto">
        <div className="flex items-center gap-2">
          <div className="group relative flex-1 md:w-80">
            <Search className="group-focus-within:text-primary absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="border-primary/10 focus-visible:ring-primary/20 focus-visible:border-primary h-12 rounded-full bg-white/50 pl-11 text-base font-medium transition-all dark:bg-white/5"
            />
          </div>

          <Sheet>
            <SheetTrigger>
              <Button
                variant="outline"
                size="icon"
                className="border-primary/10 relative h-12 w-12 shrink-0 rounded-full bg-white/50 lg:hidden dark:bg-white/5"
              >
                <FilterIcon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                {activeFiltersCount > 0 && (
                  <Badge className="bg-primary border-background absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 p-0 text-[10px] text-white">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] p-0 sm:w-[400px]">
              <SheetHeader className="border-b p-6">
                <SheetTitle className="flex items-center gap-2 text-xl font-black">
                  <FilterIcon className="text-primary h-5 w-5" />
                  Filter Requests
                </SheetTitle>
              </SheetHeader>
              <div className="p-6">
                <Filter />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <Link href="/requests/new">
          <Button className="h-12 w-full gap-2 rounded-full px-6 shadow-sm sm:w-auto">
            <Plus className="h-4 w-4" />
            Post a Request
          </Button>
        </Link>
      </div>

      {/* Sidebar Filters */}
      <aside className="hidden w-72 shrink-0 space-y-8 lg:block">
        <div className="border-primary/10 sticky top-24 rounded-[2rem] border bg-white p-8 shadow-sm dark:bg-slate-900">
          <div className="mb-6 flex items-center gap-2">
            <FilterIcon className="text-primary h-5 w-5" />
            <h2 className="text-xl font-black tracking-tight">Filters</h2>
          </div>
          <Filter />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 space-y-6">
        {/* Active Filter Tags */}
        <div className="flex flex-wrap gap-2">
          {filterBloodType && filterBloodType !== "ALL" && (
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20 gap-2 rounded-full px-3 py-1.5 text-xs font-bold"
            >
              {filterBloodType}
              <button onClick={() => setFilterBloodType(undefined)}>
                <X className="h-3 w-3 transition-colors hover:text-slate-900" />
              </button>
            </Badge>
          )}
          {filterUrgency && filterUrgency !== "ALL" && (
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20 gap-2 rounded-full px-3 py-1.5 text-xs font-bold"
            >
              {filterUrgency}
              <button onClick={() => setFilterUrgency(undefined)}>
                <X className="h-3 w-3 transition-colors hover:text-slate-900" />
              </button>
            </Badge>
          )}
          {filterDivision && filterDivision !== "ALL" && (
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20 gap-2 rounded-full px-3 py-1.5 text-xs font-bold"
            >
              {filterDivision}
              <button
                onClick={() => {
                  setFilterDivision(undefined);
                  setFilterDistrict(undefined);
                  setFilterSubDistrict(undefined);
                }}
              >
                <X className="h-3 w-3 transition-colors hover:text-slate-900" />
              </button>
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {requests === undefined ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="border-primary/5 h-[320px] animate-pulse rounded-[2rem] border bg-white dark:bg-white/5"
              />
            ))
          ) : filteredRequests && filteredRequests.length > 0 ? (
            filteredRequests.map(request => <RequestCard key={request._id} request={request} />)
          ) : (
            <div className="border-primary/20 col-span-full rounded-[3rem] border-2 border-dashed bg-white py-24 text-center dark:bg-slate-900">
              <div className="bg-primary/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl">
                <Search className="text-primary h-10 w-10" />
              </div>
              <h3 className="mb-2 text-2xl font-black tracking-tight">No Requests Found</h3>
              <p className="mx-auto max-w-xs font-medium text-slate-500 dark:text-slate-400">
                Try adjusting your filters or search query to find more results.
              </p>
              <Button
                variant="outline"
                className="border-primary/20 mt-8 rounded-2xl font-bold"
                onClick={() => {
                  setFilterBloodType(undefined);
                  setFilterDivision(undefined);
                  setFilterUrgency(undefined);
                  setSearchQuery("");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
