import { Button } from "@/components/ui/button";
import { Activity, Code, Github } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="overflow-hidden py-20 md:py-32 relative">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#3b82f6] to-[#10b981] opacity-30 dark:opacity-20"></div>
        </div>
      </div>

      <div className="container mx-auto flex flex-col items-center text-center lg:items-center lg:text-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-6 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Analyze GitHub like never before
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="gradient-text">Track.</span> <span className="gradient-text">Analyze.</span> <span className="gradient-text">Collaborate.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-xl">
              Discover developer insights and uncover collaboration opportunities through GitHub data.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button size="lg" className="gap-2">
                <Github className="h-5 w-5" />
                Get Started with GitHub
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="relative flex justify-center lg:justify-end animate-fade-in">
            <div className="max-w-lg w-full rounded-xl border bg-card p-4 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2 items-center">
                  <Activity className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Developer Dashboard</h3>
                </div>
                <div className="flex gap-1">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="space-y-4">
                {/* Chart */}
                <div className="h-48 bg-muted/50 rounded-lg flex flex-col items-center justify-center p-4">
                  <div className="flex w-full justify-between mb-2">
                    {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                      <div key={day} className="flex flex-col items-center">
                        <div className="h-24 w-8 flex flex-col-reverse">
                          <div 
                            className="w-full bg-primary rounded-sm" 
                            style={{ height: `${Math.random() * 70 + 10}%` }}
                          ></div>
                        </div>
                        <span className="text-xs mt-1 text-muted-foreground">
                          {day === 0 ? 'Mon' : day === 1 ? 'Tue' : day === 2 ? 'Wed' : day === 3 ? 'Thu' : day === 4 ? 'Fri' : day === 5 ? 'Sat' : 'Sun'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Weekly Contribution Activity
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-2xl font-bold">24</div>
                    <div className="text-xs text-muted-foreground">Repos</div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-2xl font-bold">156</div>
                    <div className="text-xs text-muted-foreground">Commits</div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-xs text-muted-foreground">PRs</div>
                  </div>
                </div>

                {/* Code preview */}
                <div className="bg-card dark:bg-github-dark rounded-lg border p-3 text-xs font-mono text-muted-foreground overflow-hidden">
                  <Code className="h-4 w-4 mb-1" />
                  <pre className="overflow-x-auto">
                    <span className="text-blue-500">import</span> &#123; analyzeRepo &#125; <span className="text-blue-500">from</span> <span className="text-green-500">'@analytica/github'</span>;
                    <br />
                    <br />
                    <span className="text-blue-500">const</span> <span className="text-yellow-500">data</span> = <span className="text-blue-500">await</span> analyzeRepo(<span className="text-green-500">'username/repo'</span>);
                    <br />
                    <span className="text-blue-500">const</span> &#123; commits, activity, contributors &#125; = data;
                    <br />
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
