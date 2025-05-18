import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FiGithub, FiUsers, FiAward, FiActivity } from 'react-icons/fi';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 dark:from-blue-400 dark:via-blue-300 dark:to-blue-200 bg-clip-text text-transparent">
            Analytica Github
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover, track, and analyze GitHub activity of your peers. Find experts, track contributions, and unlock collaboration opportunities.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/home">
              <Button size="lg" className="text-lg px-8 bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-lg px-8 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950">
                <FiGithub className="mr-2 h-5 w-5" />
                GitHub
              </Button>
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <FiUsers className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">User Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">Track contributions and activity metrics of your peers in real-time.</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <FiAward className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Achievements</h3>
              <p className="text-gray-600 dark:text-gray-300">Earn badges for your contributions and showcase your expertise.</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <FiActivity className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300">Get detailed insights into coding patterns and collaboration metrics.</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <FiGithub className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Integration</h3>
              <p className="text-gray-600 dark:text-gray-300">Seamlessly connect with GitHub and track your open source journey.</p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
            <CardContent className="p-6 text-center">
              <h3 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">10K+</h3>
              <p className="text-gray-600 dark:text-gray-300">Active Users</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
            <CardContent className="p-6 text-center">
              <h3 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">50K+</h3>
              <p className="text-gray-600 dark:text-gray-300">Contributions Tracked</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
            <CardContent className="p-6 text-center">
              <h3 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">100+</h3>
              <p className="text-gray-600 dark:text-gray-300">Daily Collaborations</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Ready to Get Started?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already using Analytica Github to enhance their GitHub experience.
          </p>
          <Link href="/home">
            <Button size="lg" className="text-lg px-8 bg-blue-600 hover:bg-blue-700">
              Start Tracking Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
