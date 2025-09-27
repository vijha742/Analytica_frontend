'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/ui/Header';
import AuthGuard from '@/components/AuthGuard';
import { fetchUserData, fetchCodeAnalysis, fetchReadmeAnalysis } from '@/lib/api-client';
import {
    GithubUser,
    CodeAnalysis,
    ReadmeAnalysis
} from '@/types/github';
import { UserProfile } from '@/components/dashboard/UserProfile';
import { LanguageDistribution } from '@/components/dashboard/LanguageDistribution';
import { ReadmeQuality } from '@/components/dashboard/ReadmeQuality';
import { TechStack } from '@/components/dashboard/TechStack';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { TechTimeline } from '@/components/dashboard/TechTimeline';
import { RefreshCw } from 'lucide-react';

type ProfileCacheType = {
    [username: string]: {
        userData: GithubUser | null;
        codeAnalysis: CodeAnalysis[] | null;
        readmeAnalysis: ReadmeAnalysis[] | null;
    };
};

function getProfileCache(): ProfileCacheType {
    if (typeof window !== 'undefined') {
        // @ts-expect-error: Accessing custom property on window for profile cache
        return window.__profileCache || {};
    }
    return {};
}

function setProfileCache(cache: ProfileCacheType) {
    if (typeof window !== 'undefined') {
        // @ts-expect-error: Setting custom property on window for profile cache
        window.__profileCache = cache;
    }
}

export default function ProfilePage() {
    return (
        <AuthGuard>
            <Suspense>
                <ProfileContent />
            </Suspense>
        </AuthGuard>
    );
}

function ProfileContent() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState<GithubUser | null>(null);
    const [codeAnalysis, setCodeAnalysis] = useState<CodeAnalysis[] | null>(null);
    const [readmeAnalysis, setReadmeAnalysis] = useState<ReadmeAnalysis[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Function to fetch GitHub username using access token
    const fetchGitHubUsername = async (accessToken: string): Promise<string | null> => {
        try {
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `token ${accessToken}`,
                    'User-Agent': 'Analytica-App'
                }
            });

            if (response.ok) {
                const userData = await response.json();
                return userData.login;
            }
        } catch (error) {
            console.error('Failed to fetch GitHub username:', error);
        }
        return null;
    };

    useEffect(() => {
        let username = session?.githubUsername;
        if (!username && session?.githubAccessToken) {
            console.log('No githubUsername found, trying to fetch from GitHub API...');
            fetchGitHubUsername(session.githubAccessToken).then((fetchedUsername) => {
                if (fetchedUsername) {
                    console.log('Fetched username from GitHub API:', fetchedUsername);
                    // We could update the session here, but for now just use it directly
                    fetchAllData(fetchedUsername);
                }
            });
            return;
        }

        if (username) {
            const profileCache = getProfileCache();
            if (profileCache[username]) {
                const cached = profileCache[username];
                setUserData(cached.userData);
                setCodeAnalysis(cached.codeAnalysis);
                setReadmeAnalysis(cached.readmeAnalysis);
                setError(null);
                setLoading(false);
            } else {
                fetchAllData(username);
            }
        } else if (session && !session.githubUsername) {
            // Session exists but no githubUsername - this indicates an auth issue
            setError('GitHub username not found in session. Please sign out and sign in again.');
        }
    }, [session?.githubUsername, session?.githubAccessToken, session]);

    const fetchAllData = async (username: string) => {
        setLoading(true);
        setError(null);
        setReadmeAnalysis(null);

        try {
            const [userResult, codeResult] = await Promise.allSettled([
                fetchUserData(username),
                fetchCodeAnalysis(username)
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
                const readmeResult = await fetchReadmeAnalysis(username);
                setReadmeAnalysis(readmeResult);

                const profileCache = getProfileCache();
                profileCache[username] = {
                    userData: newUserData,
                    codeAnalysis: newCodeAnalysis,
                    readmeAnalysis: readmeResult
                };
                setProfileCache(profileCache);
            } catch {
                setReadmeAnalysis(null);

                const profileCache = getProfileCache();
                profileCache[username] = {
                    userData: newUserData,
                    codeAnalysis: newCodeAnalysis,
                    readmeAnalysis: null
                };
                setProfileCache(profileCache);
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        const username = session?.githubUsername;
        if (username) {
            // Clear cache and refetch
            const profileCache = getProfileCache();
            delete profileCache[username];
            setProfileCache(profileCache);
            fetchAllData(username);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
            <Header />
            <main className="container mx-auto py-8 space-y-8">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <h1 className="text-3xl font-bold">Your GitHub Profile</h1>
                        {session?.githubUsername && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRefresh}
                                disabled={loading}
                                className="flex items-center gap-2"
                            >
                                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                        )}
                    </div>
                    <p className="text-muted-foreground">
                        Analyze your coding journey and track your progress
                    </p>
                </div>

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
                                    <CardContent className="pt-6">
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

                {!userData && !loading && !error && session?.githubUsername && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            Loading your profile data for {session.githubUsername}...
                        </p>
                    </div>
                )}

                {!session?.githubUsername && !loading && session && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">
                            Unable to load profile. GitHub username not found in session.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Please sign out and sign in again to refresh your session.
                        </p>
                        {session?.githubAccessToken && (
                            <p className="text-xs text-muted-foreground mt-2">
                                Fallback: Trying to fetch username from GitHub API...
                            </p>
                        )}
                    </div>
                )}

                {!session && !loading && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            Please sign in to view your profile.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
