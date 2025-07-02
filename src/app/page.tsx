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
import { Github } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Header /> */}
      <div className="flex items-center gap-2 justify-between">
        <Link href="/" className="flex items-center space-x-2 sticky top-4 right-4 z-50 w-fit self-end ml-4 mt-4">
          <Github className="h-6 w-6" />
          <span className="font-bold text-xl">Analytica GitHub</span>
        </Link>
        <div className="sticky top-4 right-4 z-50 w-fit self-end mr-4 mt-4">
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
