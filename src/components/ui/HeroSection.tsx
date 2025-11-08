import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Github, Clock } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const heroRef = useRef(null);
  const dashboardRef = useRef(null);
  const parentRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const dashboard = dashboardRef.current;

    // Hero text shrink & move up
    gsap.to(hero, {
      scale: 0.7,
      opacity: 0,
      transformOrigin: "center center",
      scrollTrigger: {
        trigger: parentRef.current,
        start: "top top",
        end: "50%",
        scrub: true,
      },
    });

    // Dashboard scale up over text
    gsap.fromTo(
      dashboard,
      { scale: 1, y: "100vh" },
      {
        scale: 1.3,
        y: 50,
        transformOrigin: "center center",
        scrollTrigger: {
          trigger: parentRef.current,
          start: "top top",
          end: "40%",
          scrub: true,
        },
      },
    );
  }, []);

  return (
    <section
      style={{
        backgroundImage:
          "linear-gradient(180deg, #051131ff 0%, #443c8fff 50%, #ffffff 100%)",
      }}
      ref={parentRef}
      className="relative overflow-hidden h-[160vh]"
    >
      {/* Hero Text */}
      <div
        ref={heroRef}
        className="h-screen overflow-hidden text-white flex flex-col justify-center items-center text-center px-6 z-10 relative"
      >
        <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-6">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
          Analyze GitHub like never before
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 z-10">
          <span className="gradient-text">Track.</span>{" "}
          <span className="gradient-text">Analyze.</span>{" "}
          <span className="gradient-text">Collaborate.</span>
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-xl z-10">
          Discover developer insights and uncover collaboration opportunities
          through GitHub data.
        </p>

        <div className="flex flex-wrap gap-4 justify-center z-10">
          <a href="/auth/signin" className="flex items-center">
            <Button size="lg" className="gap-2">
              <Github className="h-5 w-5" />
              Get Started
            </Button>
          </a>
          <Button size="lg" variant="outline" className="gap-2">
            Learn More
          </Button>
        </div>

        {/* First Sign-up Notice */}
        <div className="mt-6 flex items-center gap-2 text-sm text-white/80 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 max-w-md z-10">
          <Clock className="h-4 w-4 flex-shrink-0" />
          <span>
            First sign-up may take 2-3 minutes due to free-tier backend hosting
          </span>
        </div>
      </div>

      {/* Dashboard Overlay */}
      <div
        ref={dashboardRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
             rounded-xl border border-white/30 p-6 z-50
             bg-white/15 backdrop-blur-md shadow-[0_0_40px_10px_rgba(255,255,255,0.3),_0_0_80px_20px_rgba(255,255,255,0.2)]"
        style={{
          boxShadow:
            "0 0 40px 10px rgba(255,255,255,0.3), 0 0 80px 20px rgba(255,255,255,0.2)",
        }}
      >
        <Image
          src="/analytica_home.png"
          alt="Analytica Logo"
          className="rounded-md overflow:hidden"
          width={10000}
          height={10000}
        />
        {/* Dashboard content */}
        {/*<div className="space-y-4 relative z-10">*/}
        {/* Header */}
        {/*<div className="flex gap-2 items-center mb-4">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Developer Dashboard</h3>
          </div>*/}

        {/* Chart */}
        {/*<div className="h-48 bg-muted rounded-lg flex flex-col items-center justify-center p-4">
            <div className="flex w-full justify-between mb-2">
              {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                <div key={day} className="flex flex-col items-center">
                  <div className="h-24 w-8 flex flex-col-reverse">
                    <div
                      className="w-full bg-blue-500 rounded-sm"
                      style={{ height: `${Math.random() * 70 + 10}%` }}
                    ></div>
                  </div>
                  <span className="text-xs mt-1 text-muted-foreground">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][day]}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Weekly Contribution Activity
            </div>
          </div>*/}

        {/* Stats */}
        {/*<div className="grid grid-cols-3 gap-2">
            <div className="bg-muted p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">24</div>
              <div className="text-xs text-muted-foreground">Repos</div>
            </div>
            <div className="bg-muted p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">156</div>
              <div className="text-xs text-muted-foreground">Commits</div>
            </div>
            <div className="bg-muted p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">12</div>
              <div className="text-xs text-muted-foreground">PRs</div>
            </div>
          </div>*/}

        {/* Code preview */}
        {/*<div className="rounded-lg border p-3 text-xs font-mono text-muted-foreground overflow-hidden">
            <Code className="h-4 w-4 mb-1" />
            <pre className="overflow-x-auto">
              <span className="text-blue-500">import</span> &#123; analyzeRepo
              &#125; <span className="text-blue-500">from</span>{" "}
              <span className="text-green-500">
                &apos;@analytica/github&apos;
              </span>
              ;
              <br />
              <br />
              <span className="text-blue-500">const</span>{" "}
              <span className="text-yellow-500">data</span> ={" "}
              <span className="text-blue-500">await</span> analyzeRepo(
              <span className="text-green-500">&apos;username/repo&apos;</span>
              );
              <br />
              <span className="text-blue-500">const</span> &#123; commits,
              activity, contributors &#125; = data;
              <br />
            </pre>
          </div>*/}
        {/*</div>*/}
      </div>
    </section>
  );
}
