'use client';

import { Menu, ShieldCheck, LogOut, Settings, BookUser, FileText, User, BookText } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet";
import { useUser } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { signOut } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";

function UserNav() {
  const { user } = useUser();

  if (!user) {
    return (
      <Button asChild variant="ghost">
        <Link href="/login">Sign In</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
            <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
           <DropdownMenuItem asChild>
             <Link href="/account">
                <User className="mr-2 h-4 w-4" />
                <span>Account</span>
             </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SettingsNav() {
  return (
     <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>App & Legal</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/recommendations">
              <BookText className="mr-2 h-4 w-4" />
              <span>Recommendations</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/terms-of-service">
              <FileText className="mr-2 h-4 w-4" />
              <span>Terms of Service</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
             <Link href="/privacy-policy">
                <BookUser className="mr-2 h-4 w-4" />
                <span>Privacy Policy</span>
             </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


export function Header() {
  const navLinks = [
    { href: "/", label: "Matches" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Left Side: Desktop Nav and Mobile Menu */}
        <div className="flex items-center gap-6">
            {/* Desktop Logo & Nav */}
            <div className="hidden md:flex items-center gap-6">
                <Link href="/" className="flex items-center gap-2">
                <ShieldCheck className="h-7 w-7 text-primary" />
                <span className="text-xl font-bold tracking-tight text-primary font-headline">
                    Gry8bet
                </span>
                </Link>
                <nav className="flex items-center gap-4 text-sm font-medium">
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
            {/* Mobile Menu Trigger */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader>
                          <SheetTitle>
                            <Link href="/" className="flex items-center gap-2">
                                <ShieldCheck className="h-7 w-7 text-primary" />
                                <span className="text-xl font-bold tracking-tight text-primary font-headline">
                                Gry8bet
                                </span>
                            </Link>
                          </SheetTitle>
                          <SheetDescription className="sr-only">Main navigation menu.</SheetDescription>
                        </SheetHeader>
                        <div className="py-6">
                        <nav className="flex flex-col gap-4 text-lg font-medium">
                            {[...navLinks, { href: "/pricing", label: "Plans" }].map(link => (
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

        {/* Center Spacer */}
        <div className="flex-1" />

        {/* Right side: Actions */}
        <div className="flex items-center justify-end gap-1">
           <Button asChild>
                <Link href="/pricing">
                    Go Pro
                </Link>
            </Button>
            <UserNav />
            <ThemeToggle />
            <SettingsNav />
        </div>
      </div>
    </header>
  );
}
