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
  filterHasInitializedAtom,
} from "@/state/requests/store";
import { useQuery } from "convex/react";
import { useAtom } from "jotai";
import { FilterIcon } from "lucide-react";

export function Filter() {
  const [filterBloodType, setFilterBloodType] = useAtom(filterBloodTypeAtom);
  const [filterDivision, setFilterDivision] = useAtom(filterDivisionAtom);
  const [filterDistrict, setFilterDistrict] = useAtom(filterDistrictAtom);
  const [filterSubDistrict, setFilterSubDistrict] = useAtom(
    filterSubDistrictAtom,
  );

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

  return (
    <>
      <FilterIcon className="h-4 w-4 text-muted-foreground shrink-0" />

      {/* Blood type */}
      <Select
        value={filterBloodType ?? "ALL"}
        onValueChange={(val) => setFilterBloodType(val as string)}
      >
        <SelectTrigger className="w-[140px] bg-background">
          <SelectValue placeholder="All Blood Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Blood Types</SelectItem>
          {bloodTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Division */}
      <Select
        value={filterDivision ?? "ALL"}
        onValueChange={(val) => {
          setFilterDivision(val as string);
          setFilterDistrict(undefined);
          setFilterSubDistrict(undefined);
        }}
      >
        <SelectTrigger className="w-[160px] bg-background">
          <SelectValue placeholder="All Divisions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Divisions</SelectItem>
          {getAllDivisions().map((div) => (
            <SelectItem key={div} value={div}>
              {div}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* District — only shown when division picked */}
      {filterDivision && filterDivision !== "ALL" && (
        <Select
          value={filterDistrict ?? "ALL"}
          onValueChange={(val) => {
            setFilterDistrict(val as string);
            setFilterSubDistrict(undefined);
          }}
        >
          <SelectTrigger className="w-[160px] bg-background">
            <SelectValue placeholder="All Districts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Districts</SelectItem>
            {getDistrictsByDivision({ division: filterDivision }).map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Sub-district — only shown when district picked */}
      {filterDistrict &&
        filterDistrict !== "ALL" &&
        filterDivision &&
        filterDivision !== "ALL" && (
          <Select
            value={filterSubDistrict ?? "ALL"}
            onValueChange={(val) => {
              setFilterSubDistrict(val as string);
            }}
          >
            <SelectTrigger className="w-[160px] bg-background">
              <SelectValue placeholder="All Sub-Districts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Sub-Districts</SelectItem>
              {getSubDistrictsByDistrict({
                division: filterDivision,
                district: filterDistrict,
              }).map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

      {/* Clear filters */}
      {(filterBloodType ||
        filterDivision ||
        filterDistrict ||
        filterSubDistrict) && (
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto text-muted-foreground h-8 px-2 text-xs"
          onClick={() => {
            setFilterBloodType(undefined);
            setFilterDivision(undefined);
            setFilterDistrict(undefined);
            setFilterSubDistrict(undefined);
          }}
        >
          Clear filters
        </Button>
      )}
    </>
  );
}
