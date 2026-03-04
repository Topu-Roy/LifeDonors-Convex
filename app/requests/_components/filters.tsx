"use client";
import { useEffect } from "react";

import { bloodTypes } from "@/app/profile/_components/profileForm";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllDivisions,
  getDistrictsByDivision,
  getSubDistrictsByDistrict,
} from "@/constants/bangladeshAdministrativeAreas";
import { api } from "@/convex/_generated/api";
import {
  filterBloodTypeAtom,
  filterDivisionAtom,
  filterDistrictAtom,
  filterSubDistrictAtom,
  filterUrgencyAtom,
  filterHasInitializedAtom,
} from "@/state/requests/store";
import { useQuery } from "convex/react";
import { useAtom } from "jotai";
import { RotateCcw } from "lucide-react";

const urgencyLevels = ["Low", "Medium", "High", "Critical"];

export function Filter() {
  const [filterBloodType, setFilterBloodType] = useAtom(filterBloodTypeAtom);
  const [filterDivision, setFilterDivision] = useAtom(filterDivisionAtom);
  const [filterDistrict, setFilterDistrict] = useAtom(filterDistrictAtom);
  const [filterSubDistrict, setFilterSubDistrict] = useAtom(
    filterSubDistrictAtom,
  );
  const [filterUrgency, setFilterUrgency] = useAtom(filterUrgencyAtom);

  const profile = useQuery(api.users.getMyProfile);
  const [hasInitialized, setHasInitialized] = useAtom(filterHasInitializedAtom);

  useEffect(() => {
    if (profile && !hasInitialized) {
      if (profile.division) setFilterDivision(profile.division);
      if (profile.district) setFilterDistrict(profile.district);
      if (profile.subDistrict) setFilterSubDistrict(profile.subDistrict);
      setHasInitialized(true);
    }
  }, [
    profile,
    hasInitialized,
    setFilterDivision,
    setFilterDistrict,
    setFilterSubDistrict,
    setHasInitialized,
  ]);

  const resetFilters = () => {
    setFilterBloodType(undefined);
    setFilterDivision(undefined);
    setFilterDistrict(undefined);
    setFilterSubDistrict(undefined);
    setFilterUrgency(undefined);
  };

  const hasActiveFilters =
    (filterBloodType && filterBloodType !== "ALL") ||
    (filterDivision && filterDivision !== "ALL") ||
    (filterDistrict && filterDistrict !== "ALL") ||
    (filterSubDistrict && filterSubDistrict !== "ALL") ||
    (filterUrgency && filterUrgency !== "ALL");

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-4">
        {/* Blood Type */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Blood Type
          </label>
          <Select
            value={filterBloodType ?? "ALL"}
            onValueChange={(val) =>
              setFilterBloodType(val === "ALL" ? undefined : (val as string))
            }
          >
            <SelectTrigger className="w-full h-10 md:h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-primary/10 transition-all focus:ring-primary/20 text-sm md:text-base">
              <SelectValue placeholder="All Blood Types" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-primary/10">
              <SelectItem value="ALL">All Blood Types</SelectItem>
              {bloodTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Urgency */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Urgency Level
          </label>
          <Select
            value={filterUrgency ?? "ALL"}
            onValueChange={(val) =>
              setFilterUrgency(val === "ALL" ? undefined : (val as string))
            }
          >
            <SelectTrigger className="w-full h-10 md:h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-primary/10 transition-all focus:ring-primary/20 text-sm md:text-base">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-primary/10">
              <SelectItem value="ALL">All Levels</SelectItem>
              {urgencyLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location Section */}
        <div className="pt-4 border-t border-primary/5 space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Location
          </label>

          <div className="space-y-3">
            {/* Division */}
            <Select
              value={filterDivision ?? "ALL"}
              onValueChange={(val) => {
                setFilterDivision(val === "ALL" ? undefined : (val as string));
                setFilterDistrict(undefined);
                setFilterSubDistrict(undefined);
              }}
            >
              <SelectTrigger className="w-full h-10 md:h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-primary/10 transition-all focus:ring-primary/20 text-xs md:text-sm">
                <SelectValue placeholder="All Divisions" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-primary/10">
                <SelectItem value="ALL">All Divisions</SelectItem>
                {getAllDivisions().map((div) => (
                  <SelectItem key={div} value={div}>
                    {div}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* District */}
            <Select
              value={filterDistrict ?? "ALL"}
              onValueChange={(val) => {
                setFilterDistrict(val === "ALL" ? undefined : (val as string));
                setFilterSubDistrict(undefined);
              }}
              disabled={!filterDivision || filterDivision === "ALL"}
            >
              <SelectTrigger className="w-full h-10 md:h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-primary/10 transition-all focus:ring-primary/20 text-xs md:text-sm disabled:opacity-50">
                <SelectValue placeholder="All Districts" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-primary/10">
                <SelectItem value="ALL">All Districts</SelectItem>
                {filterDivision &&
                  filterDivision !== "ALL" &&
                  getDistrictsByDivision({ division: filterDivision }).map(
                    (d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ),
                  )}
              </SelectContent>
            </Select>

            {/* Sub-district */}
            <Select
              value={filterSubDistrict ?? "ALL"}
              onValueChange={(val) =>
                setFilterSubDistrict(
                  val === "ALL" ? undefined : (val as string),
                )
              }
              disabled={!filterDistrict || filterDistrict === "ALL"}
            >
              <SelectTrigger className="w-full h-10 md:h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-primary/10 transition-all focus:ring-primary/20 text-xs md:text-sm disabled:opacity-50">
                <SelectValue placeholder="All Sub-Districts" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-primary/10">
                <SelectItem value="ALL">All Sub-Districts</SelectItem>
                {filterDistrict &&
                  filterDistrict !== "ALL" &&
                  filterDivision &&
                  filterDivision !== "ALL" &&
                  getSubDistrictsByDistrict({
                    division: filterDivision,
                    district: filterDistrict,
                  }).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full h-11 md:h-12 rounded-2xl font-bold border-primary/20 text-primary hover:bg-primary/5 transition-all gap-2 text-sm"
        onClick={resetFilters}
        disabled={!hasActiveFilters}
      >
        <RotateCcw className="h-4 w-4" />
        Reset Filters
      </Button>
    </div>
  );
}
