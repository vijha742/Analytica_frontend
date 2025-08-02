'use client';

import HeroSection from '@/components/ui/HeroSection';
import FeaturesSection from '@/components/ui/FeaturesSection';
import AchievementsSection from '@/components/ui/AchievementsSection';
import HowItWorksSection from '@/components/ui/HowItWorksSection';
import TechStackSection from '@/components/ui/TechStackSection';
import RoadmapSection from '@/components/ui/RoadmapSection';
import PreviewSection from '@/components/ui/PreviewSection';
import Footer from '@/components/ui/Footer';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useEffect, useState } from 'react';
import { Github } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* <Header /> */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur flex items-center gap-2 justify-between w-full py-2 px-4">
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="/image2vector(1).svg"
            className="max-h-12 w-auto"
            style={isDark ? { filter: 'invert(1)' } : {}}
          />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/test" className="text-sm font-medium hover:text-primary transition-colors">
            Test Auth
          </Link>
          <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link href="/home" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <ThemeToggle />
        </div>
      </div>

      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <AchievementsSection />
        <HowItWorksSection />
        <TechStackSection />
        <RoadmapSection />
        <PreviewSection />
      </main>
      <Footer />
    </div>
  );
}
