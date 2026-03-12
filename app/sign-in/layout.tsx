import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In to LifeDonors",
  description: "Sign in to LifeDonors to manage your profile and donations.",
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
