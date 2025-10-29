import { useEffect, useState } from "react";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();
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
    <footer
      className="border-border/40 bg-background py-12"
      style={{
        backgroundImage:
          "linear-gradient(180deg, #ffffff 0%, #443c8fff 50%, #051131ff 100%)",
      }}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left justify-center">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Image
                src="/image2vector(1).svg"
                alt="Analytica Logo"
                className="max-h-15 w-auto"
                style={isDark ? { filter: "invert(1)" } : {}}
                width={48}
                height={48}
                priority
              />
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Discover developer insights and uncover collaboration
              opportunities through GitHub data.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-lg text-white">Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  GitHub Repo
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contributing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  License (coming soon)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-lg text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  API Reference
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 flex flex-col md:flex-row justify-center items-center gap-4">
          <p className="text-sm text-gray-300 mb-4 md:mb-0 text-center">
            &copy; {currentYear} Analytica GitHub. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-300 justify-center">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
