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

  const isActiveLink = (href: string) => pathname === href;

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
    <header className="sticky top-0 z-50 w-full pt-4 pb-2">
      {/* Floating container with shadow */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="rounded-full bg-background/30 backdrop-blur-md border border-border shadow-2xl dark:shadow-primary/10">
          <div className="px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/home" className="flex items-center space-x-2">
                <Image
                  src="/image2vector(1).svg"
                  alt="Analytica Logo"
                  className="max-h-10 w-auto transition-transform hover:scale-110"
                  style={isDark ? { filter: "invert(1)" } : {}}
                  width={40}
                  height={40}
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { href: "/home", icon: HomeIcon, label: "Home" },
                {
                  href: "/dashboard",
                  icon: LayoutDashboard,
                  label: "Dashboard",
                },
                { href: "/tech-matches", icon: Users, label: "Tech Matches" },
                { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
                { href: "/compare", icon: ListOrdered, label: "Compare" },
                { href: "/about", icon: Info, label: "About" },
              ].map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    isActiveLink(href)
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-accent"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {session?.user?.image ? (
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center ring-2 ring-border rounded-full hover:ring-primary transition-all"
                  >
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-background border border-border rounded-2xl shadow-xl overflow-hidden">
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-3 text-sm hover:bg-accent transition-colors"
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
                          className="flex items-center w-full px-4 py-3 text-sm hover:bg-accent transition-colors"
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
                  <Button variant="outline" size="sm" className="rounded-full">
                    Sign In
                  </Button>
                </Link>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full"
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
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-6xl mx-auto px-4 mt-2">
          <div className="rounded-2xl bg-background border border-border shadow-xl overflow-hidden">
            <div className="px-4 py-4 space-y-1">
              {[
                { href: "/home", icon: HomeIcon, label: "Home" },
                {
                  href: "/dashboard",
                  icon: LayoutDashboard,
                  label: "Dashboard",
                },
                { href: "/tech-matches", icon: Users, label: "Tech Matches" },
                { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
                { href: "/compare", icon: ListOrdered, label: "Compare" },
                { href: "/about", icon: Info, label: "About" },
              ].map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActiveLink(href)
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "hover:bg-accent"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
