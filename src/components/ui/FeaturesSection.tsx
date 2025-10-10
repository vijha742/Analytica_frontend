"use client";

import { useEffect, useRef, useState } from "react";
import { Activity, Code, Database, Github, Shield, Users } from "lucide-react";
import gsap from "gsap";

const features = [
  {
    title: "Contribution & Activity Tracking",
    description:
      "Track daily, weekly, and monthly contributions across repositories with detailed metrics and visualizations.",
    icon: Activity,
  },
  {
    title: "Advanced Metrics",
    description:
      "Analyze code quality, community engagement levels, and impact across various projects and communities.",
    icon: Database,
  },
  {
    title: "Custom Achievements",
    description:
      "Earn badges and recognition for coding milestones, consistency, and domain expertise.",
    icon: Shield,
  },
  {
    title: "Tech Expertise Profiling",
    description:
      "Visualize language proficiency, library usage, and project domain specializations.",
    icon: Code,
  },
  {
    title: "GitHub Profile Analytics",
    description:
      "Get insights into collaboration patterns, contribution history, and community involvement.",
    icon: Github,
  },
  {
    title: "Collaboration Opportunities",
    description:
      "Connect with like-minded developers based on complementary skills and interests.",
    icon: Users,
  },
];

export default function FeaturesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // total scroll width
    const totalWidth = container.scrollWidth / 2;

    let tl: gsap.core.Tween | undefined;
    if (!isHovered) {
      tl = gsap.to(container, {
        x: `-=${totalWidth}`,
        duration: 20,
        ease: "linear",
        repeat: -1,
      });
    }

    return () => tl?.kill();
  }, [isHovered]);

  // Duplicate cards array for seamless scroll
  const duplicatedFeatures = [...features, ...features];

  return (
    <section
      style={{
        backgroundImage:
          "linear-gradient(180deg, #ffffff 0%, #443c8fff 50%, #051131ff 100%)",
      }}
      className="relative p-20 bg-secondary/50 overflow-hidden"
    >
      <div className="text-center text-black max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-4">Core Features</h2>
        <p className="text-muted-foreground">
          Comprehensive tools to analyze, visualize, and enhance your GitHub
          presence and collaboration.
        </p>
      </div>

      {/* Fade overlays */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg-secondary/100 pointer-events-none z-20" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg-secondary/100 pointer-events-none z-20" />

      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex items-end z-10 h-[50vh] overflow-hidden"
      >
        <div
          ref={scrollRef}
          className="flex gap-8 w-max cursor-grab select-none"
        >
          {duplicatedFeatures.map((feature, index) => (
            <div
              key={index}
              className="group bg-card-comp rounded-xl p-6 shadow-sm border border-transparent
                         hover:border-primary/50 hover:shadow-lg hover:-translate-y-2 hover:scale-[1.03]
                         transition-all duration-300 flex-shrink-0 w-80"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
