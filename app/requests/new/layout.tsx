import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Blood Request | LifeDonors",
  description: "Request blood for yourself or someone else in need.",
};

export default function CreateRequestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
