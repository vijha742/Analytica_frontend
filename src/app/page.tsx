import Header from '@/components/ui/Header';
import HeroSection from '@/components/ui/HeroSection';
import FeaturesSection from '@/components/ui/FeaturesSection';
import AchievementsSection from '@/components/ui/AchievementsSection';
import HowItWorksSection from '@/components/ui/HowItWorksSection';
import TechStackSection from '@/components/ui/TechStackSection';
import RoadmapSection from '@/components/ui/RoadmapSection';
import PreviewSection from '@/components/ui/PreviewSection';
import Footer from '@/components/ui/Footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
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
