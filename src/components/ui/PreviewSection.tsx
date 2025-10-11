"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Github, MoonIcon, SunIcon } from "lucide-react";
import Link from "next/link";

export default function PreviewSection() {
  const [activeMode, setActiveMode] = useState<"light" | "dark">("light");

  return (
    <section
      className="py-20"
      style={{
        backgroundImage:
          "linear-gradient(180deg, #051131ff 0%, #443c8fff 50%, #ffffff 100%)",
      }}
    >
      <div className="container mx-auto flex flex-col items-center text-center lg:items-center lg:text-center">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Light & Dark Mode</h2>
          <p className="text-muted-foreground">
            Experience Analytica GitHub in your preferred theme, optimized for
            all times of day.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-muted rounded-full p-1">
              <Button
                variant={activeMode === "light" ? "default" : "ghost"}
                size="sm"
                className="rounded-full gap-2"
                onClick={() => setActiveMode("light")}
              >
                <SunIcon className="h-4 w-4" />
                Light Mode
              </Button>
              <Button
                variant={activeMode === "dark" ? "default" : "ghost"}
                size="sm"
                className="rounded-full gap-2"
                onClick={() => setActiveMode("dark")}
              >
                <MoonIcon className="h-4 w-4" />
                Dark Mode
              </Button>
            </div>
          </div>

          {/* Preview image */}
          <div className="relative mx-auto rounded-xl overflow-hidden shadow-lg border">
            <div
              className={`${
                activeMode === "dark" ? "bg-gray-900" : "bg-white"
              } p-4`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Github
                    className={`h-6 w-6 ${
                      activeMode === "dark" ? "text-white" : "text-black"
                    }`}
                  />
                  <span
                    className={`font-bold ${
                      activeMode === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Analytica GitHub
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Stats panel */}
                <div
                  className={`rounded-lg p-4 ${
                    activeMode === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <h4 className="font-medium mb-3">Repository Stats</h4>
                  <div className="space-y-2">
                    {[
                      { label: "Commits", value: "1,024" },
                      { label: "Pull Requests", value: "58" },
                      { label: "Issues", value: "27" },
                    ].map((stat, i) => (
                      <div key={i} className="flex justify-between">
                        <span
                          className={
                            activeMode === "dark"
                              ? "text-gray-400"
                              : "text-gray-600"
                          }
                        >
                          {stat.label}
                        </span>
                        <span className="font-medium">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart */}
                <div
                  className={`rounded-lg p-4 col-span-2 ${
                    activeMode === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <h4 className="font-medium mb-3">Activity Overview</h4>
                  <div className="h-32 flex items-end gap-1 pt-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm"
                        style={{
                          height: `${Math.random() * 70 + 10}%`,
                          background:
                            activeMode === "dark"
                              ? `rgba(59, 130, 246, ${
                                  0.3 + Math.random() * 0.7
                                })`
                              : `rgba(37, 99, 235, ${
                                  0.3 + Math.random() * 0.7
                                })`,
                        }}
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs">
                    <span
                      className={
                        activeMode === "dark"
                          ? "text-gray-400"
                          : "text-gray-600"
                      }
                    >
                      Jan
                    </span>
                    <span
                      className={
                        activeMode === "dark"
                          ? "text-gray-400"
                          : "text-gray-600"
                      }
                    >
                      Dec
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/auth/signin">
              <Button size="lg" className="gap-2">
                <Github className="h-5 w-5" />
                Connect with GitHub
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
