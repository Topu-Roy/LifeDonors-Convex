"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RequestCard } from "@/components/RequestCard";
import { Filter } from "./filters";
import { useAtom } from "jotai";
import {
  filterBloodTypeAtom,
  filterDivisionAtom,
  filterDistrictAtom,
  filterSubDistrictAtom,
  filterUrgencyAtom,
} from "@/state/requests/store";
import { Search, X, Filter as FilterIcon, Plus } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function RequestsExplorer() {
  const [filterBloodType, setFilterBloodType] = useAtom(filterBloodTypeAtom);
  const [filterDivision, setFilterDivision] = useAtom(filterDivisionAtom);
  const [filterDistrict, setFilterDistrict] = useAtom(filterDistrictAtom);
  const [filterSubDistrict, setFilterSubDistrict] = useAtom(
    filterSubDistrictAtom,
  );
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
    (r) =>
      r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.bloodTypeNeeded.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activeFiltersCount = [
    filterBloodType,
    filterDivision,
    filterDistrict,
    filterSubDistrict,
    filterUrgency,
  ].filter((f) => f && f !== "ALL").length;

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      {/* Search and Mobile Filters Section */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto absolute top-[-90px] right-0">
        <div className="flex items-center gap-2">
          <div className="relative group flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 rounded-full border-primary/10 bg-white/50 dark:bg-white/5 focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-medium text-base"
            />
          </div>

          <Sheet>
            <SheetTrigger>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden h-12 w-12 rounded-full border-primary/10 bg-white/50 dark:bg-white/5 relative shrink-0"
              >
                <FilterIcon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                {activeFiltersCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-white text-[10px] border-2 border-background">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0">
              <SheetHeader className="p-6 border-b">
                <SheetTitle className="text-xl font-black flex items-center gap-2">
                  <FilterIcon className="h-5 w-5 text-primary" />
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
          <Button className="gap-2 shadow-sm w-full sm:w-auto h-12 rounded-full px-6">
            <Plus className="h-4 w-4" />
            Post a Request
          </Button>
        </Link>
      </div>

      {/* Sidebar Filters */}
      <aside className="hidden lg:block w-72 shrink-0 space-y-8">
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-primary/10 shadow-sm sticky top-24">
          <div className="flex items-center gap-2 mb-6">
            <FilterIcon className="h-5 w-5 text-primary" />
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
              className="px-3 py-1.5 rounded-full bg-primary/10 text-primary border-primary/20 gap-2 font-bold text-xs"
            >
              {filterBloodType}
              <button onClick={() => setFilterBloodType(undefined)}>
                <X className="h-3 w-3 hover:text-slate-900 transition-colors" />
              </button>
            </Badge>
          )}
          {filterUrgency && filterUrgency !== "ALL" && (
            <Badge
              variant="secondary"
              className="px-3 py-1.5 rounded-full bg-primary/10 text-primary border-primary/20 gap-2 font-bold text-xs"
            >
              {filterUrgency}
              <button onClick={() => setFilterUrgency(undefined)}>
                <X className="h-3 w-3 hover:text-slate-900 transition-colors" />
              </button>
            </Badge>
          )}
          {filterDivision && filterDivision !== "ALL" && (
            <Badge
              variant="secondary"
              className="px-3 py-1.5 rounded-full bg-primary/10 text-primary border-primary/20 gap-2 font-bold text-xs"
            >
              {filterDivision}
              <button
                onClick={() => {
                  setFilterDivision(undefined);
                  setFilterDistrict(undefined);
                  setFilterSubDistrict(undefined);
                }}
              >
                <X className="h-3 w-3 hover:text-slate-900 transition-colors" />
              </button>
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {requests === undefined ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[320px] bg-white dark:bg-white/5 animate-pulse rounded-[2rem] border border-primary/5"
              />
            ))
          ) : filteredRequests && filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <RequestCard key={request._id} request={request} />
            ))
          ) : (
            <div className="col-span-full py-24 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-primary/20">
              <div className="bg-primary/10 h-20 w-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-2">
                No Requests Found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">
                Try adjusting your filters or search query to find more results.
              </p>
              <Button
                variant="outline"
                className="mt-8 rounded-2xl font-bold border-primary/20"
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
