import { atom } from "jotai";

export type SetupFormData = {
  // Step 1: Basic Info
  age: number;
  phoneNumber: string;
  division: string;
  district: string;
  subDistrict: string;

  // Step 2: Health Details
  bloodType: string;
  weight: number;
  height: number;
  hemoglobinLevel: number;

  // Step 3: Eligibility & Commitments
  diseases: string[];
  lastDonationDate: number;
};

export const currentStepAtom = atom(1);

export const setupFormAtom = atom<Partial<SetupFormData>>({
  age: 0,
  phoneNumber: "",
  division: "",
  district: "",
  subDistrict: "",
  bloodType: "",
  weight: 0,
  height: 0,
  hemoglobinLevel: 12.5,
  diseases: [],
  lastDonationDate: 0,
});
