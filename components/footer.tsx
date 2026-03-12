import { Activity, Droplet, Users } from "lucide-react";
import Link from "next/link";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="bg-background border-border mt-auto w-full border-t py-12">
      <Container className="flex flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex items-center gap-3">
          <div className="bg-primary shadow-primary/20 flex h-10 w-10 items-center justify-center rounded-xl shadow-lg">
            <Droplet className="h-6 w-6 fill-current text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter italic">LifeDonors</span>
        </div>
        <p className="text-muted-foreground text-sm font-medium">
          © 2024 LifeDonors Platform. Saving lives together.
        </p>
        <div className="flex gap-6">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            <span className="sr-only">Help</span>
            <Activity className="h-5 w-5" />
          </Link>
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            <span className="sr-only">About</span>
            <Users className="h-5 w-5" />
          </Link>
        </div>
      </Container>
    </footer>
  );
}
