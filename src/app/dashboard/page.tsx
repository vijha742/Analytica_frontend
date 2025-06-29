'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import ThemeToggle from '@/components/ui/ThemeToggle';
import {
  fetchUserData,
  fetchCodeAnalysis,
  fetchReadmeAnalysis,
  fetchTechAnalysis
} from '@/lib/api-client';
import {
  GithubUser,
  CodeAnalysis,
  ReadmeAnalysis,
  TechAnalysis
} from '@/types/github';
import {
  Search,
  Code,
  BookOpen,
  TrendingUp,
  Activity,
  Zap
} from 'lucide-react';
import { UserProfile } from '@/components/dashboard/UserProfile';
import { RepositoryOverview } from '@/components/dashboard/RepositoryOverview';
import { ContributionChart } from '@/components/dashboard/ContributionChart';
import { LanguageDistribution } from '@/components/dashboard/LanguageDistribution';
import { ReadmeQuality } from '@/components/dashboard/ReadmeQuality';
import { TechStack } from '@/components/dashboard/TechStack';
import { DemoDataLoader } from '@/components/dashboard/DemoDataLoader';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { ApiStatusIndicator } from '@/components/dashboard/ApiStatusIndicator';


export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<GithubUser | null>(null);
  const [codeAnalysis, setCodeAnalysis] = useState<CodeAnalysis[] | null>(null);
  const [readmeAnalysis, setReadmeAnalysis] = useState<ReadmeAnalysis[] | null>(null);
  const [techAnalysis, setTechAnalysis] = useState<TechAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [userApiStatus, setUserApiStatus] = useState<'connected' | 'fallback' | 'error'>('fallback');
  const [techApiStatus, setTechApiStatus] = useState<'connected' | 'fallback' | 'error'>('fallback');
  const [readmeApiStatus, setReadmeApiStatus] = useState<'connected' | 'fallback' | 'error'>('fallback');

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const usernameParam = searchParams.get('username');
    if (usernameParam) {
      setUsername(usernameParam);
      fetchAllData(usernameParam);
    }
  }, [searchParams]);

  const fetchAllData = async (user: string) => {
    setLoading(true);
    setError(null);

    try {
      const [userResult, codeResult, readmeResult, techResult] = await Promise.allSettled([
        fetchUserData(user),
        fetchCodeAnalysis(user),
        fetchReadmeAnalysis(user),
        fetchTechAnalysis(user)
      ]);

      if (userResult.status === 'fulfilled') {
        setUserData(userResult.value);
        setUserApiStatus('connected');
      } else {
        console.error('Failed to fetch user data:', userResult.reason);
        setUserApiStatus('error');
      }

      if (codeResult.status === 'fulfilled') {
        setCodeAnalysis(codeResult.value);
      } else {
        console.error('Failed to fetch code analysis:', codeResult.reason);
      }

      if (readmeResult.status === 'fulfilled') {
        setReadmeAnalysis(readmeResult.value);
        setReadmeApiStatus('connected');
      } else {
        console.error('Failed to fetch readme analysis:', readmeResult.reason);
        setReadmeApiStatus('error');
      }

      if (techResult.status === 'fulfilled') {
        setTechAnalysis(techResult.value);
        setTechApiStatus('connected');
      } else {
        console.error('Failed to fetch tech analysis:', techResult.reason);
        setTechApiStatus('error');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setUserApiStatus('error');
      setReadmeApiStatus('error');
      setTechApiStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Update: handleDemoDataLoad now takes a username argument
  const handleDemoDataLoad = (
    demoUserData: GithubUser,
    demoCodeAnalysis: CodeAnalysis[],
    demoReadmeAnalysis: ReadmeAnalysis[],
    demoTechAnalysis: TechAnalysis
  ) => {
    setUserData(demoUserData);
    setCodeAnalysis(demoCodeAnalysis);
    setReadmeAnalysis(demoReadmeAnalysis);
    setTechAnalysis(demoTechAnalysis);
    setUsername(demoUserData.githubUsername);
    setUserApiStatus('fallback');
    setReadmeApiStatus('fallback');
    setTechApiStatus('fallback');
    router.push(`/dashboard?username=${demoUserData.githubUsername}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/dashboard?username=${encodeURIComponent(username.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Analytica</h1>
            </div>
          </div>
          <form onSubmit={handleSearch} className="flex items-center space-x-2 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter GitHub username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </form>
          <ThemeToggle />
        </div>
      </header>
      {/* Main Content */}
      <main className="container mx-auto py-8 space-y-8">
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">Error: {error}</p>
            </CardContent>
          </Card>
        )}
        {loading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        {userData && !loading && (
          <div className="space-y-8">
            {/* API Status Indicator */}
            <ApiStatusIndicator
              userApiStatus={userApiStatus}
              techApiStatus={techApiStatus}
              readmeApiStatus={readmeApiStatus}
            />
            {/* User Profile Section */}
            <UserProfile user={userData} />
            {/* Stats Grid */}
            <StatsGrid
              user={userData}
              codeAnalysis={codeAnalysis}
              techAnalysis={techAnalysis}
            />
            {/* Main Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Repository Overview */}
              <RepositoryOverview repositories={userData.repositories} />
              {/* Contribution Chart */}
              <ContributionChart contributions={userData.contributions} />
              {/* Language Distribution */}
              {codeAnalysis && (
                <LanguageDistribution codeAnalysis={codeAnalysis} />
              )}
              {/* README Quality */}
              {readmeAnalysis && (
                <ReadmeQuality readmeAnalysis={readmeAnalysis} />
              )}
            </div>
            {/* Tech Stack Analysis */}
            {techAnalysis && (
              <TechStack techAnalysis={techAnalysis} />
            )}
          </div>
        )}
        {!userData && !loading && !error && (
          <div className="text-center py-12 space-y-8">
            <div className="max-w-md mx-auto">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Welcome to Analytica</h2>
              <p className="text-muted-foreground mb-6">
                Enter a GitHub username above to start analyzing their development activity,
                code quality, and technical skills.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary">
                  <Code className="w-3 h-3 mr-1" />
                  Code Analysis
                </Badge>
                <Badge variant="secondary">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Contribution Trends
                </Badge>
                <Badge variant="secondary">
                  <BookOpen className="w-3 h-3 mr-1" />
                  README Quality
                </Badge>
                <Badge variant="secondary">
                  <Zap className="w-3 h-3 mr-1" />
                  Tech Stack
                </Badge>
              </div>
            </div>
            <div className="max-w-lg mx-auto">
              <DemoDataLoader username={username} onDataLoad={handleDemoDataLoad} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
