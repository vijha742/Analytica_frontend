import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Code,
  Database,
  Globe,
  Server,
} from "lucide-react";

import Header from "@/components/ui/Header";

export default function AboutPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1">
                <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Code className="h-16 w-16 text-blue-600" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-800"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              About{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Analytica
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Track the GitHub developers you want to learn from. See what they're building, what they're learning, and how they're growing - all in one place.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* About Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Mission Card */}
              <Card className="p-8 backdrop-blur-sm bg-white/70 dark:bg-slate-800/70 border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center mr-4">
                    <Globe className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Why Analytica Exists?
                  </h2>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  Learning from others is hard when their work is scattered across dozens of repositories, commits, and pull requests. I built Analytica because I wanted to follow the journey of developers I admire - classmates, seniors, and creators on Twitter - without manually checking their profiles every day.
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  Analytica transforms raw GitHub activity into meaningful insights. Instead of browsing through commit histories, you get a clear picture: What languages are they using? What projects are they contributing to? How active are they? What can you learn from their path?
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Whether you&apos;re tracking your study group&apos;s progress, finding collaborators with similar tech stacks, or simply learning from developers ahead of you, Analytica gives you the insights you need.
                </p>
              </Card>

              {/* Developer Profile Card */}
              <Card className="p-8 backdrop-blur-sm bg-white/70 dark:bg-slate-800/70 border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center mr-4">
                    <Code className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Built by a Developer, For Developers
                  </h2>
                </div>
                <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                  <div className="flex-shrink-0 mb-4 md:mb-0">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-0.5">
                      <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <span className="text-2xl font-bold text-indigo-600">VJ</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                      Hi, I'm Vikas Jha
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      A 3rd year B.Tech Computer Science student from Faridabad, India.
                      I have a lot of inertia when it comes to starting things, so I've learned to follow people who inspire me.
                      Over the years, I've gathered information about their journeys, studied their approaches, and tried to replicate what works.
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      But tracking GitHub activity manually was tedious. I wanted information, not just raw data.
                      So I built Analytica - initially just for myself, to monitor my classmates and developers I follow on Twitter.
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      What started as a personal tool became something others might find useful too.
                      If you've ever wondered <em>"What are the best developers in my network working on?"</em> or
                      <em>"How can I find people with similar tech interests?"</em> - Analytica is for you.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Features Card */}
              <Card className="p-8 backdrop-blur-sm bg-white/70 dark:bg-slate-800/70 border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center mr-4">
                    <Database className="h-6 w-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    What Analytica Does?
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          Activity Tracking
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Monitor commits, pull requests, issues, and contributions in real-time. See daily, weekly, and monthly patterns to understand how developers work.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          Tech Stack Analysis
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Discover what languages and technologies developers use, how they've evolved over time, and where they specialize. Track lines of code, project complexity, and versatility scores.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          Skill Progression
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Track your technology stack growth
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          Developer Comparison
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Compare any two developers side-by-side on contributions, repositories, language expertise, and activity patterns. Find out who's ahead and by how much.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          Interactive Dashboards
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Beautiful, responsive visualizations with dark/light mode support. See contribution graphs, language distributions, project timelines, and documentation quality scores at a glance.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-pink-500 mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          Team Organization
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Group developers into custom teams - classmates, friends, colleagues, or any category that makes sense for you. Track each team's collective progress.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          Tech Matches
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Find developers with similar tech stacks using similarity scoring. Discover potential collaborators or mentors who work with the same technologies you do.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Technology Stack */}
              <Card className="p-8 backdrop-blur-sm bg-white/70 dark:bg-slate-800/70 border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center mr-4">
                    <Server className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    The Tech Behind Analytica
                  </h2>
                </div>
                <div className="space-y-6">
                  {/* Frontend */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      Frontend
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Next.js 14",
                        "TypeScript",
                        "Tailwind CSS",
                        "Dark/Light Mode"
                      ].map((tech) => (
                        <Badge key={tech} variant="secondary" className="px-3 py-1">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Backend */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      Backend
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Spring Boot",
                        "Java 21",
                        "GraphQL",
                        "PostgreSQL",
                        "Neon Database"
                      ].map((tech) => (
                        <Badge key={tech} variant="secondary" className="px-3 py-1">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Integration */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      Integration
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "GitHub GraphQL API",
                        "Real-time Analytics",
                        "Automated Refresh"
                      ].map((tech) => (
                        <Badge key={tech} variant="secondary" className="px-3 py-1">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Deployment */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                      <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                      Deployment
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Vercel",
                        "Render",
                        "CI/CD Pipeline"
                      ].map((tech) => (
                        <Badge key={tech} variant="secondary" className="px-3 py-1">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            {/* Heading: Built by a Developer, For Developers
Content:
Hi, I'm Vikas Jha, a 3rd year B.Tech Computer Science student from Faridabad, India.
I have a lot of inertia when it comes to starting things, so I've learned to follow people who inspire me. Over the years, I've gathered information about their journeys, studied their approaches, and tried to replicate what works.
But tracking GitHub activity manually was tedious. I wanted information, not just raw data. So I built Analytica - initially just for myself, to monitor my classmates and developers I follow on Twitter.
What started as a personal tool became something others might find useful too. If you've ever wondered "What are the best developers in my network working on?" or "How can I find people with similar tech interests?" - Analytica is for you. */}
            {/* Contact Sidebar */}
            <div className="space-y-4">
              {/* Contact Info Card */}
              <Card className="p-6 backdrop-blur-sm bg-white/70 dark:bg-slate-800/70 border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  Get In Touch
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Email
                      </p>
                      <p className="text-slate-900 dark:text-white">
                        jhavikas2004@gmail.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Location
                      </p>
                      <p className="text-slate-900 dark:text-white">
                        Faridabad, India
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                    Connect with me:
                  </p>
                  <div className="flex space-x-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-10 h-10 p-0"
                      asChild
                    >
                      <a href="https://github.com/vijha742" target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-10 h-10 p-0"
                      asChild
                    >
                      <a href="https://www.linkedin.com/in/vijha742" target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-10 h-10 p-0"
                      asChild
                    >
                      <a href="mailto:jhavikas2004@gmail.com" target="_blank" rel="noopener noreferrer">
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Contact Form Card */}
              <Card className="p-6 backdrop-blur-sm bg-white/70 dark:bg-slate-800/70 border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  Send a Message
                </h3>
                <form className="space-y-4">
                  <div>
                    <Input
                      placeholder="Your Name"
                      className="bg-white/50 dark:bg-slate-700/50 border-slate-200/50 dark:border-slate-600/50"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      className="bg-white/50 dark:bg-slate-700/50 border-slate-200/50 dark:border-slate-600/50"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Subject"
                      className="bg-white/50 dark:bg-slate-700/50 border-slate-200/50 dark:border-slate-600/50"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Your Message"
                      rows={4}
                      className="w-full px-3 py-2 text-sm rounded-md border bg-white/50 dark:bg-slate-700/50 border-slate-200/50 dark:border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                    ></textarea>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>
          </div>

          {/* Current Status Section */}
          <Card className="p-8 backdrop-blur-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-slate-200/50 dark:border-slate-600/50 shadow-xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-blue-500 mb-4">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Current Status
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="text-center">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Live Beta
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Status</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Oct 2024
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Launch Date</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    v1.0
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Version</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mb-2">
                    💬 Open
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">For Feedback</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white/50 dark:bg-slate-700/50 rounded-lg border border-slate-200/50 dark:border-slate-600/50">
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  🚀 We want to hear from you! Your feedback helps make Analytica better for everyone.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
