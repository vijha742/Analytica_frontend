'use client';
import Image from "next/image";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

import { Menu, X, User, LogOut } from "lucide-react";
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
    if (typeof window !== 'undefined') {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Close user menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (userMenuOpen && !target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleClickOutside);
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
              style={isDark ? { filter: 'invert(1)' } : {}}
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
            className={`text-sm font-medium transition-colors ${isActiveLink('/home')
              ? 'text-primary border-b-2 border-primary pb-1'
              : 'hover:text-primary'
              }`}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors ${isActiveLink('/dashboard')
              ? 'text-primary border-b-2 border-primary pb-1'
              : 'hover:text-primary'
              }`}
          >
            Dashboard
          </Link>
          <Link
            href="/tech-matches"
            className={`text-sm font-medium transition-colors ${isActiveLink('/tech-matches')
              ? 'text-primary border-b-2 border-primary pb-1'
              : 'hover:text-primary'
              }`}
          >
            Tech Matches
          </Link>
          <Link
            href="/leaderboard"
            className={`text-sm font-medium transition-colors ${isActiveLink('/leaderboard')
              ? 'text-primary border-b-2 border-primary pb-1'
              : 'hover:text-primary'
              }`}
          >
            Leaderboard
          </Link>
          <Link
            href="/compare"
            className={`text-sm font-medium transition-colors ${isActiveLink('/compare')
              ? 'text-primary border-b-2 border-primary pb-1'
              : 'hover:text-primary'
              }`}
          >
            Compare
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors ${isActiveLink('/about')
              ? 'text-primary border-b-2 border-primary pb-1'
              : 'hover:text-primary'
              }`}
          >
            About
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
                <div className="absolute right-0 mt-2 w-48 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border rounded-md shadow-lg z-50">
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
                        signOut({ callbackUrl: '/' });
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
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
            <Link
              href="/home"
              className={`block py-2 text-sm font-medium transition-colors ${isActiveLink('/home')
                ? 'text-primary font-semibold'
                : 'hover:text-primary'
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className={`block py-2 text-sm font-medium transition-colors ${isActiveLink('/dashboard')
                ? 'text-primary font-semibold'
                : 'hover:text-primary'
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/tech-matches"
              className={`block py-2 text-sm font-medium transition-colors ${isActiveLink('/tech-matches')
                ? 'text-primary font-semibold'
                : 'hover:text-primary'
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Tech Matches
            </Link>
            <Link
              href="/leaderboard"
              className={`block py-2 text-sm font-medium transition-colors ${isActiveLink('/leaderboard')
                ? 'text-primary font-semibold'
                : 'hover:text-primary'
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Leaderboard
            </Link>
            <Link
              href="/compare"
              className={`block py-2 text-sm font-medium transition-colors ${isActiveLink('/compare')
                ? 'text-primary font-semibold'
                : 'hover:text-primary'
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Compare
            </Link>
            <Link
              href="/about"
              className={`block py-2 text-sm font-medium transition-colors ${isActiveLink('/about')
                ? 'text-primary font-semibold'
                : 'hover:text-primary'
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
