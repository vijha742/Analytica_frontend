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
  Server
} from "lucide-react";

import Header from '@/components/ui/Header';
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1">
                <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Code className="h-16 w-16 text-blue-600" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-800"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Analytica</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              A comprehensive GitHub analytics platform designed to help developers track, analyze, and improve their coding journey through insightful data visualization and peer comparison.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* About Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Mission Card */}
              <Card className="p-8 backdrop-blur-sm bg-white/70 dark:bg-slate-800/70 border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center mr-4">
                    <Globe className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  We believe in empowering developers through data-driven insights. Analytica transforms raw GitHub activity into meaningful metrics that help you understand your coding patterns, identify areas for improvement, and celebrate your achievements.
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Whether you&apos;re a beginner looking to track your progress or an experienced developer wanting to optimize your workflow, Analytica provides the tools and insights you need to excel in your coding journey.
                </p>
              </Card>

              {/* Features Card */}
              <Card className="p-8 backdrop-blur-sm bg-white/70 dark:bg-slate-800/70 border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center mr-4">
                    <Database className="h-6 w-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Key Features</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">Activity Tracking</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Monitor commits, pull requests, and contributions</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">Code Quality Metrics</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Analyze code quality and best practices</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">Skill Progression</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Track your technology stack growth</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">Peer Comparison</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Compare with other developers</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">Interactive Dashboards</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Beautiful, responsive data visualization</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">Real-time Updates</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Stay updated with live GitHub data</p>
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
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Built With</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Next.js", "TypeScript", "Tailwind CSS", "React",
                    "GitHub API", "Recharts", "Radix UI", "Lucide Icons"
                  ].map((tech) => (
                    <Badge key={tech} variant="secondary" className="px-3 py-1">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>

            {/* Contact Sidebar */}
            <div className="space-y-6">
              {/* Contact Info Card */}
              <Card className="p-6 backdrop-blur-sm bg-white/70 dark:bg-slate-800/70 border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Get In Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                      <p className="text-slate-900 dark:text-white">contact@analytica.dev</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Phone</p>
                      <p className="text-slate-900 dark:text-white">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Location</p>
                      <p className="text-slate-900 dark:text-white">San Francisco, CA</p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Follow Us</p>
                  <div className="flex space-x-3">
                    <Button size="sm" variant="outline" className="w-10 h-10 p-0">
                      <Github className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="w-10 h-10 p-0">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="w-10 h-10 p-0">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Contact Form Card */}
              <Card className="p-6 backdrop-blur-sm bg-white/70 dark:bg-slate-800/70 border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Send a Message</h3>
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

          {/* Stats Section */}
          <Card className="p-8 backdrop-blur-sm bg-white/70 dark:bg-slate-800/70 border-slate-200/50 dark:border-slate-700/50 shadow-xl">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-slate-600 dark:text-slate-300">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
                <div className="text-slate-600 dark:text-slate-300">Repositories Analyzed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">1M+</div>
                <div className="text-slate-600 dark:text-slate-300">Commits Tracked</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">99.9%</div>
                <div className="text-slate-600 dark:text-slate-300">Uptime</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
