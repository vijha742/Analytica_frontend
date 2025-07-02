'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/ui/Header';
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
import ThemeToggle from '@/components/ui/ThemeToggle';

type DashboardCacheType = {
  [username: string]: {
    userData: GithubUser | null;
    codeAnalysis: CodeAnalysis[] | null;
    techAnalysis: TechAnalysis | null;
    readmeAnalysis: ReadmeAnalysis[] | null;
  };
};
// Use a client-side cache (window property) to avoid server sharing
function getDashboardCache(): DashboardCacheType {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    return window.__dashboardCache || {};
  }
  return {};
}
function setDashboardCache(cache: DashboardCacheType) {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.__dashboardCache = cache;
  }
}

export default function DashboardPage() {
  return (
    <>
      <Suspense>
        <DashboardContent />
      </Suspense>
    </>
  );
}

function DashboardContent() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [readmeLoading, setReadmeLoading] = useState(false);
  const [userData, setUserData] = useState<GithubUser | null>(null);
  const [codeAnalysis, setCodeAnalysis] = useState<CodeAnalysis[] | null>(null);
  const [readmeAnalysis, setReadmeAnalysis] = useState<ReadmeAnalysis[] | null>(null);
  const [techAnalysis, setTechAnalysis] = useState<TechAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const prevUsernameRef = useRef<string | null>(null);

  const [userApiStatus, setUserApiStatus] = useState<'connected' | 'fallback' | 'error'>('fallback');
  const [techApiStatus, setTechApiStatus] = useState<'connected' | 'fallback' | 'error'>('fallback');
  const [readmeApiStatus, setReadmeApiStatus] = useState<'connected' | 'fallback' | 'error'>('fallback');

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const usernameParam = searchParams.get('username');
    if (usernameParam) {
      setUsername(usernameParam);

      const dashboardCache = getDashboardCache();
      if (dashboardCache[usernameParam]) {
        const cached = dashboardCache[usernameParam];
        setUserData(cached.userData);
        setCodeAnalysis(cached.codeAnalysis);
        setReadmeAnalysis(cached.readmeAnalysis);
        setTechAnalysis(cached.techAnalysis);
        setError(null);
        setLoading(false);
        setReadmeLoading(false);
      } else {
        fetchAllData(usernameParam);
      }
    }
  }, [searchParams]);

  const fetchAllData = async (user: string) => {
    setLoading(true);
    setError(null);
    setReadmeAnalysis(null);
    setReadmeApiStatus('fallback');


    const dashboardCache = getDashboardCache();
    if (prevUsernameRef.current && prevUsernameRef.current !== user) {
      delete dashboardCache[prevUsernameRef.current];
      setDashboardCache(dashboardCache);
    }
    prevUsernameRef.current = user;

    try {

      const [userResult, codeResult, techResult] = await Promise.allSettled([
        fetchUserData(user),
        fetchCodeAnalysis(user),
        fetchTechAnalysis(user)
      ]);

      let newUserData = null;
      let newCodeAnalysis = null;
      let newTechAnalysis = null;

      if (userResult.status === 'fulfilled') {
        setUserData(userResult.value);
        newUserData = userResult.value;
        setUserApiStatus('connected');
      } else {
        setUserData(null);
        setUserApiStatus('error');
      }

      if (codeResult.status === 'fulfilled') {
        setCodeAnalysis(codeResult.value);
        newCodeAnalysis = codeResult.value;
      } else {
        setCodeAnalysis(null);
      }

      if (techResult.status === 'fulfilled') {
        setTechAnalysis(techResult.value);
        newTechAnalysis = techResult.value;
        setTechApiStatus('connected');
      } else {
        setTechAnalysis(null);
        setTechApiStatus('error');
      }

      setLoading(false);

      setReadmeLoading(true);
      try {
        const readmeResult = await fetchReadmeAnalysis(user);
        setReadmeAnalysis(readmeResult);
        setReadmeApiStatus('connected');

        dashboardCache[user] = {
          userData: newUserData,
          codeAnalysis: newCodeAnalysis,
          techAnalysis: newTechAnalysis,
          readmeAnalysis: readmeResult
        };
        setDashboardCache(dashboardCache);
      } catch (readmeError) {
        setReadmeAnalysis(null);
        setReadmeApiStatus('error');

        dashboardCache[user] = {
          userData: newUserData,
          codeAnalysis: newCodeAnalysis,
          techAnalysis: newTechAnalysis,
          readmeAnalysis: null
        };
        setDashboardCache(dashboardCache);
      } finally {
        setReadmeLoading(false);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setUserApiStatus('error');
      setTechApiStatus('error');
      setLoading(false);
    }
  };


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
      <Header />
      <main className="container mx-auto py-8 space-y-8">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-2 mb-6 max-w-2xl mx-auto"
        >
          <div className="relative flex-1 w-full min-w-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 pr-4 w-full min-w-[180px] sm:min-w-[240px] max-w-full"
              style={{ minWidth: '180px', maxWidth: '100%' }}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="flex-shrink-0 ml-0 sm:ml-2"
            style={{ minWidth: '110px' }}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </Button>
        </form>
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
            <ApiStatusIndicator
              userApiStatus={userApiStatus}
              techApiStatus={techApiStatus}
              readmeApiStatus={readmeApiStatus}
            />
            <UserProfile user={userData} />
            <StatsGrid
              user={userData}
              codeAnalysis={codeAnalysis}
              techAnalysis={techAnalysis}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RepositoryOverview repositories={userData.repositories} />
              <ContributionChart contributions={userData.contributions} />
              {codeAnalysis && (
                <LanguageDistribution codeAnalysis={codeAnalysis} />
              )}
              {readmeAnalysis ? (
                <ReadmeQuality readmeAnalysis={readmeAnalysis} />
              ) : readmeLoading ? (
                <Card>
                  <CardHeader>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ) : readmeApiStatus === 'error' ? (
                <Card className="border-muted">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">README Quality</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Failed to load README analysis</p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-muted">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">README Quality</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">README analysis not available</p>
                  </CardContent>
                </Card>
              )}
            </div>
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
