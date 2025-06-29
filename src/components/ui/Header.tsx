'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Github, Menu, X } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <Github className="h-6 w-6" />
            <span className="font-bold text-xl">Analytica GitHub</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="#achievements" className="text-sm font-medium hover:text-primary transition-colors">
            Achievements
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
            How It Works
          </Link>
          <Link href="#tech" className="text-sm font-medium hover:text-primary transition-colors">
            Tech Stack
          </Link>
          <Link href="#roadmap" className="text-sm font-medium hover:text-primary transition-colors">
            Roadmap
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/home" className="flex items-center">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 hidden md:flex">
              Get Started
            </Button>
          </Link>

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
          <div className="container py-4 space-y-3">
            <Link 
              href="#features" 
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="#achievements" 
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Achievements
            </Link>
            <Link 
              href="#how-it-works" 
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              href="#tech" 
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tech Stack
            </Link>
            <Link 
              href="#roadmap" 
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Roadmap
            </Link>
            <Button variant="default" className="w-full mt-4">
              Connect with GitHub
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
