import { Github, Search, Sparkles } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    title: "Connect your GitHub",
    description:
      "Securely link your GitHub account with just a few clicks to start the analysis process.",
    icon: Github,
  },
  {
    title: "Analyze your data",
    description:
      "Our algorithm processes your repositories, contributions, and collaboration patterns.",
    icon: Search,
  },
  {
    title: "Discover opportunities",
    description:
      "Uncover insights about your coding habits and find new collaboration possibilities.",
    icon: Sparkles,
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-20 bg-secondary/50 hero-section"
      style={{
        backgroundImage:
          "linear-gradient(180deg, #ffffff 0%, #443c8fff 50%, #051131ff 100%)",
      }}
    >
      <div className="container mx-auto text-center">
        <div className="max-w-2xl mx-auto mb-16">
          <h2 className="text-5xl text-black font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-xl text-black">
            From connecting your GitHub account to discovering new opportunities
            in just three simple steps.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="rounded-full bg-card-comp border h-20 w-20 flex items-center justify-center mb-5 shadow-sm">
                <step.icon className="h-8 w-8 text-primary" />
              </div>

              <div className="relative w-full">
                {index < steps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-border -mt-10"
                    style={{ width: "calc(100% - 5rem)" }}
                  ></div>
                )}
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm mr-2">
                    {index + 1}
                  </span>
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <div className="inline-block rounded-xl bg-card-comp p-8 border">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <div className="text-left">
                <h4 className="text-xl font-semibold mb-1">
                  Ready to get started?
                </h4>
                <p className="text-muted-foreground">
                  Connect your GitHub account and start exploring.
                </p>
              </div>
              <Link href="/auth/signin">
                <button className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:opacity-90 transition-opacity flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  Connect with GitHub
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
