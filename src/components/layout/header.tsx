import { Menu, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

export function Header() {
  const navLinks = [
    { href: "/", label: "Matches" },
    { href: "/recommendations", label: "Recommendations" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold tracking-tight text-primary font-headline hidden sm:inline-block">
                FootyForecast
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
                {navLinks.map(link => (
                    <Link key={link.href} href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                        {link.label}
                    </Link>
                ))}
            </nav>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
           <Button asChild>
                <Link href="/pricing">
                    Go Pro
                </Link>
            </Button>
            <Sheet>
                <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <div className="py-6">
                    <Link href="/" className="flex items-center gap-2 mb-6">
                        <ShieldCheck className="h-7 w-7 text-primary" />
                        <span className="text-xl font-bold tracking-tight text-primary font-headline">
                        FootyForecast
                        </span>
                    </Link>
                    <nav className="flex flex-col gap-4 text-lg font-medium">
                        {[...navLinks, { href: "/pricing", label: "Pricing" }].map(link => (
                            <Link key={link.href} href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
