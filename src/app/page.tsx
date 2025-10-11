"use client";
import Image from "next/image";

import HeroSection from "@/components/ui/HeroSection";
import FeaturesSection from "@/components/ui/FeaturesSection";
import AchievementsSection from "@/components/ui/AchievementsSection";
import HowItWorksSection from "@/components/ui/HowItWorksSection";
import TechStackSection from "@/components/ui/TechStackSection";
import RoadmapSection from "@/components/ui/RoadmapSection";
import PreviewSection from "@/components/ui/PreviewSection";
import Footer from "@/components/ui/Footer";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [isDark, setIsDark] = useState(false);

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
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* <Header /> */}
      <div className="fixed top-0 left-0 w-full flex items-center justify-between bg-black p-1 z-99 ">
        <div>
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/image2vector(1).svg"
              alt="Analytica Logo"
              width={48}
              height={48}
              className="max-h-12 w-auto"
              style={isDark ? { filter: "invert(1)" } : {}}
              priority
            />
          </Link>
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
