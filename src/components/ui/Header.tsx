"use client";
import Image from "next/image";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

import { Menu, X, User, LogOut, Home as HomeIcon, LayoutDashboard, Users, Trophy, ListOrdered, Info } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
    }
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Close user menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (userMenuOpen && !target.closest(".user-menu-container")) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      observer.disconnect();
      document.removeEventListener("click", handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/home" className="flex items-center space-x-2">
            <Image
              src="/image2vector(1).svg"
              alt="Analytica Logo"
              className="max-h-12 w-auto"
              style={isDark ? { filter: "invert(1)" } : {}}
              width={48}
              height={48}
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/home"
            className={`flex flex-col items-center justify-center transition-colors ${isActiveLink('/home')
              ? 'text-primary border-b-2 border-primary pb-2 scale-110 shadow-sm'
              : 'hover:text-primary'
              }`}
            style={isActiveLink('/home') ? { marginBottom: '2px' } : {}}
          >
            <HomeIcon className={isActiveLink('/home') ? "h-5 w-5 mb-1" : "h-4 w-4 mb-1"} />
            <span className={isActiveLink('/home') ? "text-sm font-semibold text-center" : "text-xs font-medium text-center"}>Home</span>
          </Link>
          <Link
            href="/dashboard"
            className={`flex flex-col items-center justify-center transition-colors ${isActiveLink('/dashboard')
              ? 'text-primary border-b-2 border-primary pb-2 scale-110 shadow-sm'
              : 'hover:text-primary'
              }`}
            style={isActiveLink('/dashboard') ? { marginBottom: '2px' } : {}}
          >
            <LayoutDashboard className={isActiveLink('/dashboard') ? "h-5 w-5 mb-1" : "h-4 w-4 mb-1"} />
            <span className={isActiveLink('/dashboard') ? "text-sm font-semibold text-center" : "text-xs font-medium text-center"}>Dashboard</span>
          </Link>
          <Link
            href="/tech-matches"
            className={`flex flex-col items-center justify-center transition-colors ${isActiveLink('/tech-matches')
              ? 'text-primary border-b-2 border-primary pb-2 scale-110 shadow-sm'
              : 'hover:text-primary'
              }`}
            style={isActiveLink('/tech-matches') ? { marginBottom: '2px' } : {}}
          >
            <Users className={isActiveLink('/tech-matches') ? "h-5 w-5 mb-1" : "h-4 w-4 mb-1"} />
            <span className={isActiveLink('/tech-matches') ? "text-sm font-semibold text-center" : "text-xs font-medium text-center"}>Tech Matches</span>
          </Link>
          <Link
            href="/leaderboard"
            className={`flex flex-col items-center justify-center transition-colors ${isActiveLink('/leaderboard')
              ? 'text-primary border-b-2 border-primary pb-2 scale-110 shadow-sm'
              : 'hover:text-primary'
              }`}
            style={isActiveLink('/leaderboard') ? { marginBottom: '2px' } : {}}
          >
            <Trophy className={isActiveLink('/leaderboard') ? "h-5 w-5 mb-1" : "h-4 w-4 mb-1"} />
            <span className={isActiveLink('/leaderboard') ? "text-sm font-semibold text-center" : "text-xs font-medium text-center"}>Leaderboard</span>
          </Link>
          <Link
            href="/compare"
            className={`flex flex-col items-center justify-center transition-colors ${isActiveLink('/compare')
              ? 'text-primary border-b-2 border-primary pb-2 scale-110 shadow-sm'
              : 'hover:text-primary'
              }`}
            style={isActiveLink('/compare') ? { marginBottom: '2px' } : {}}
          >
            <ListOrdered className={isActiveLink('/compare') ? "h-5 w-5 mb-1" : "h-4 w-4 mb-1"} />
            <span className={isActiveLink('/compare') ? "text-sm font-semibold text-center" : "text-xs font-medium text-center"}>Compare</span>
          </Link>
          <Link
            href="/about"
            className={`flex flex-col items-center justify-center transition-colors ${isActiveLink('/about')
              ? 'text-primary border-b-2 border-primary pb-2 scale-110 shadow-sm'
              : 'hover:text-primary'
              }`}
            style={isActiveLink('/about') ? { marginBottom: '2px' } : {}}
          >
            <Info className={isActiveLink('/about') ? "h-5 w-5 mb-1" : "h-4 w-4 mb-1"} />
            <span className={isActiveLink('/about') ? "text-sm font-semibold text-center" : "text-xs font-medium text-center"}>About</span>
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {session?.user?.image ? (
            <div className="relative user-menu-container">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center"
              >
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full hover:opacity-80 transition-opacity"
                />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm hover:bg-accent"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/signin">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          )}


          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3 flex flex-col items-center justify-center">
            <Link
              href="/home"
              className={`py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 w-full rounded-md ${isActiveLink('/home')
                ? 'text-primary font-semibold bg-gray-900/90'
                : 'hover:text-primary'
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <HomeIcon className="h-4 w-4" /> Home
            </Link>
            <Link
              href="/dashboard"
              className={`py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 w-full rounded-md ${isActiveLink('/dashboard')
                ? 'text-primary font-semibold bg-gray-900/90'
                : 'hover:text-primary'
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
            <Link
              href="/tech-matches"
              className={`py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 w-full rounded-md ${isActiveLink('/tech-matches')
                ? 'text-primary font-semibold bg-gray-900/90'
                : 'hover:text-primary'
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Users className="h-4 w-4" /> Tech Matches
            </Link>
            <Link
              href="/leaderboard"
              className={`py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 w-full rounded-md ${isActiveLink('/leaderboard')
                ? 'text-primary font-semibold bg-gray-900/90'
                : 'hover:text-primary'
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Trophy className="h-4 w-4" /> Leaderboard
            </Link>
            <Link
              href="/compare"
              className={`py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 w-full rounded-md ${isActiveLink('/compare')
                ? 'text-primary font-semibold bg-gray-900/90'
                : 'hover:text-primary'
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <ListOrdered className="h-4 w-4" /> Compare
            </Link>
            <Link
              href="/about"
              className={`py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 w-full rounded-md ${isActiveLink('/about')
                ? 'text-primary font-semibold bg-gray-900/90'
                : 'hover:text-primary'
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Info className="h-4 w-4" /> About
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
