"use client";

import {
  filterBloodTypeAtom,
  filterDistrictAtom,
  filterDivisionAtom,
  filterSubDistrictAtom,
  filterUrgencyAtom,
} from "@/state/requests/store";
import { useAtom, useSetAtom } from "jotai";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ActiveFilters() {
  const [filterBloodType, setFilterBloodType] = useAtom(filterBloodTypeAtom);
  const [filterDivision, setFilterDivision] = useAtom(filterDivisionAtom);
  const setFilterDistrict = useSetAtom(filterDistrictAtom);
  const setFilterSubDistrict = useSetAtom(filterSubDistrictAtom);
  const [filterUrgency, setFilterUrgency] = useAtom(filterUrgencyAtom);

  return (
    <>
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
    </>
  );
}

export function ClearFiltersButton({ setSearchQuery }: { setSearchQuery: (string: string) => void }) {
  const setFilterBloodType = useSetAtom(filterBloodTypeAtom);
  const setFilterDivision = useSetAtom(filterDivisionAtom);
  const setFilterUrgency = useSetAtom(filterUrgencyAtom);

  return (
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
  );
}
