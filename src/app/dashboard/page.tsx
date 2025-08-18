'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/ui/Header';
import AuthGuard from '@/components/AuthGuard';
import Image from 'next/image';
import { fetchUserData, fetchCodeAnalysis, fetchReadmeAnalysis } from '@/lib/api-client';
import {
  GithubUser,
  CodeAnalysis,
  ReadmeAnalysis
} from '@/types/github';
import { Search, Code, BookOpen, TrendingUp, Zap, User, FolderGit2 } from 'lucide-react';
import { UserProfile } from '@/components/dashboard/UserProfile';
import { LanguageDistribution } from '@/components/dashboard/LanguageDistribution';
import { ReadmeQuality } from '@/components/dashboard/ReadmeQuality';
import { TechStack } from '@/components/dashboard/TechStack';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { TechTimeline } from '@/components/dashboard/TechTimeline';

type DashboardCacheType = {
  [username: string]: {
    userData: GithubUser | null;
    codeAnalysis: CodeAnalysis[] | null;
    readmeAnalysis: ReadmeAnalysis[] | null;
  };
};
function getDashboardCache(): DashboardCacheType {
  if (typeof window !== 'undefined') {
    // @ts-expect-error: Accessing custom property on window for dashboard cache
    return window.__dashboardCache || {};
  }
  return {};
}
function setDashboardCache(cache: DashboardCacheType) {
  if (typeof window !== 'undefined') {
    // @ts-expect-error: Setting custom property on window for dashboard cache
    window.__dashboardCache = cache;
  }
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <Suspense>
        <DashboardContent />
      </Suspense>
    </AuthGuard>
  );
}

function DashboardContent() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<GithubUser | null>(null);
  const [codeAnalysis, setCodeAnalysis] = useState<CodeAnalysis[] | null>(null);
  const [readmeAnalysis, setReadmeAnalysis] = useState<ReadmeAnalysis[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const prevUsernameRef = useRef<string | null>(null);

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
        setError(null);
        setLoading(false);
      } else {
        fetchAllData(usernameParam);
      }
    }
  }, [searchParams]);

  const fetchAllData = async (user: string) => {
    setLoading(true);
    setError(null);
    setReadmeAnalysis(null);


    const dashboardCache = getDashboardCache();
    if (prevUsernameRef.current && prevUsernameRef.current !== user) {
      delete dashboardCache[prevUsernameRef.current];
      setDashboardCache(dashboardCache);
    }
    prevUsernameRef.current = user;

    try {

      const [userResult, codeResult] = await Promise.allSettled([
        fetchUserData(user),
        fetchCodeAnalysis(user)
      ]);

      let newUserData = null;
      let newCodeAnalysis = null;

      if (userResult.status === 'fulfilled') {
        setUserData(userResult.value);
        newUserData = userResult.value;
      } else {
        setUserData(null);
      }

      if (codeResult.status === 'fulfilled') {
        setCodeAnalysis(codeResult.value);
        newCodeAnalysis = codeResult.value;
      } else {
        setCodeAnalysis(null);
      }

      setLoading(false);

      try {
        const readmeResult = await fetchReadmeAnalysis(user);
        setReadmeAnalysis(readmeResult);

        dashboardCache[user] = {
          userData: newUserData,
          codeAnalysis: newCodeAnalysis,
          readmeAnalysis: readmeResult
        };
        setDashboardCache(dashboardCache);
      } catch {
        setReadmeAnalysis(null);

        dashboardCache[user] = {
          userData: newUserData,
          codeAnalysis: newCodeAnalysis,
          readmeAnalysis: null
        };
        setDashboardCache(dashboardCache);
      } finally {
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
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
            <UserProfile user={userData} />
            <StatsGrid
              user={userData}
              codeAnalysis={codeAnalysis}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* <RepositoryOverview repositories={userData.repositories} /> */}
              {/* <ContributionChart contributions={userData.contributions} /> */}
              {codeAnalysis && (
                <LanguageDistribution codeAnalysis={codeAnalysis} />
              )}
              {readmeAnalysis && (
                <ReadmeQuality readmeAnalysis={readmeAnalysis} />
              )}
            </div>
            {userData.technicalProfile && (
              <TechStack user={userData} />
            )}
            {userData.userTech && userData.userTech.technologyUsageList.length > 0 && (
              <TechTimeline technologyUsageList={userData.userTech.technologyUsageList} />
            )}
          </div>
        )}
        {!userData && !loading && !error && (
          <section className="flex flex-col items-center justify-center min-h-[65vh] py-12 w-full">
            {/* Modern Hero Section */}
            <div className="relative w-full max-w-2xl text-center mb-10">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-0">
                <Image src="/globe.svg" alt="Dashboard Illustration" width={112} height={112} className="opacity-90 drop-shadow-xl animate-float" />
              </div>
              <h1 className="relative z-10 text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-sky-400 to-emerald-400 bg-clip-text text-transparent mb-3 tracking-tight drop-shadow-lg">
                GitHub Analytics, <span className="text-emerald-500">Reimagined</span>
              </h1>
              <p className="relative z-10 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-2">
                Unlock deep insights into your GitHub journey. Visualize, analyze, and showcase your developer profile in a whole new way.
              </p>
              <div className="flex justify-center gap-2 mt-4">
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">No login required</span>
                <span className="inline-block bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-xs font-medium">Instant results</span>
              </div>
            </div>
            {/* Features Grid Modernized */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 max-w-5xl w-full px-2">
              <div className="group flex flex-col items-center bg-gradient-to-br from-background/80 to-card/90 border border-border rounded-2xl p-7 shadow-lg hover:scale-[1.03] transition-transform cursor-pointer">
                <User className="h-9 w-9 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1 text-lg">User Profile</h3>
                <p className="text-sm text-muted-foreground text-center">See your GitHub avatar, bio, followers, and more.</p>
              </div>
              <div className="group flex flex-col items-center bg-gradient-to-br from-background/80 to-card/90 border border-border rounded-2xl p-7 shadow-lg hover:scale-[1.03] transition-transform cursor-pointer">
                <Code className="h-9 w-9 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1 text-lg">Code Analysis</h3>
                <p className="text-sm text-muted-foreground text-center">Language stats, code quality, and repo health at a glance.</p>
              </div>
              <div className="group flex flex-col items-center bg-gradient-to-br from-background/80 to-card/90 border border-border rounded-2xl p-7 shadow-lg hover:scale-[1.03] transition-transform cursor-pointer">
                <TrendingUp className="h-9 w-9 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1 text-lg">Contribution Trends</h3>
                <p className="text-sm text-muted-foreground text-center">Interactive charts of your commits, PRs, and activity.</p>
              </div>
              <div className="group flex flex-col items-center bg-gradient-to-br from-background/80 to-card/90 border border-border rounded-2xl p-7 shadow-lg hover:scale-[1.03] transition-transform cursor-pointer">
                <BookOpen className="h-9 w-9 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1 text-lg">README Quality</h3>
                <p className="text-sm text-muted-foreground text-center">Automated review of your project documentation.</p>
              </div>
              <div className="group flex flex-col items-center bg-gradient-to-br from-background/80 to-card/90 border border-border rounded-2xl p-7 shadow-lg hover:scale-[1.03] transition-transform cursor-pointer">
                <FolderGit2 className="h-9 w-9 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1 text-lg">Repository Overview</h3>
                <p className="text-sm text-muted-foreground text-center">Your top repositories, stars, forks, and more.</p>
              </div>
              <div className="group flex flex-col items-center bg-gradient-to-br from-background/80 to-card/90 border border-border rounded-2xl p-7 shadow-lg hover:scale-[1.03] transition-transform cursor-pointer">
                <Zap className="h-9 w-9 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1 text-lg">Tech Stack</h3>
                <p className="text-sm text-muted-foreground text-center">See the technologies and frameworks you use most.</p>
              </div>
            </div>
            {/* CTA Modern */}
            <div className="text-center text-muted-foreground pt-8">
              <span className="inline-block text-base font-medium bg-card/80 px-4 py-2 rounded-xl shadow">Enter a GitHub username above to see your personalized dashboard.</span>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
