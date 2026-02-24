import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-4">
          <ShieldCheck className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold tracking-tight text-primary font-headline">
            FootyForecast
          </span>
        </Link>
      </div>
    </header>
  );
}
