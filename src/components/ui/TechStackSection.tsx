import { Database } from "lucide-react";
import Image from "next/image";

export default function TechStackSection() {
  const technologies = [
    { name: "Next.js", logo: "https://img.icons8.com/color/48/nextjs.png" },
    {
      name: "Tailwind CSS",
      logo: "https://img.icons8.com/color/48/tailwindcss.png",
    },
    {
      name: "Spring Boot",
      logo: "https://img.icons8.com/color/48/spring-logo.png",
    },
    {
      name: "Neon",
      logo: "https://logosandtypes.com/wp-content/uploads/2024/07/Neon-Tech.png",
    },
    {
      name: "GitHub GraphQL API",
      logo: "https://img.icons8.com/fluency/48/github.png",
    },
  ];

  return (
    <section
      id="tech"
      className="py-20"
      style={{
        backgroundImage:
          "linear-gradient(180deg, #051131ff 0%, #443c8fff 50%, #ffffff 100%)",
      }}
    >
      <div className="container mx-auto text-center ">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-5xl font-bold mb-4">Tech Stack</h2>
          <p className="text-muted-foreground text-xl">
            Built with modern technologies for optimal performance, security,
            and developer experience.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Database className="h-5 w-5 text-primary" />
              <h3 className="text-2xl font-semibold">Core Technologies</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-8">
              {technologies.map((tech, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <div className="h-16 w-16 flex items-center justify-center mb-3 relative">
                    <Image
                      src={tech.logo}
                      alt={tech.name}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
