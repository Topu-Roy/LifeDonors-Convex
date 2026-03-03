import { atom } from "jotai";

export const filterBloodTypeAtom = atom<string | undefined>(undefined);
export const filterDivisionAtom = atom<string | undefined>(undefined);
export const filterDistrictAtom = atom<string | undefined>(undefined);
export const filterSubDistrictAtom = atom<string | undefined>(undefined);
export const filterHasInitializedAtom = atom<boolean>(false);
