'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Line } from "react-chartjs-2";
import {
  Activity,
  Code2,
  FileCode2,
  GitCommit,
  GitFork,
  GitPullRequest,
  Star,
  Users2
} from "lucide-react";
import { fetchUser, fetchContributionTimeSeries } from '@/lib/api';
import { GithubUser, TimeFrame, ContributionTimeSeries, ContributionType } from '@/types/github';
import { useParams } from 'next/navigation';
import { Separator } from "@/components/ui/separator";

function formatDate(dateStr: string | Date | null | undefined) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function DashboardPage() {
  const params = useParams();
  const username = params?.username as string;
  const [user, setUser] = useState<GithubUser | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<ContributionTimeSeries | null>(null);
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      if (!username) return;
      
      try {
        const userData = await fetchUser(username);
        setUser(userData);
        
        setIsLoadingChart(true);
        const timeSeriesData = await fetchContributionTimeSeries(
          username,
          TimeFrame.MONTHLY
        );
        setTimeSeriesData(timeSeriesData);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoadingChart(false);
      }
    };

    loadUser();
  }, [username]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            {user.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt={user.name || user.githubUsername} />
            ) : (
              <AvatarFallback>{user.name?.[0] || user.githubUsername[0]}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{user.name || user.githubUsername}</h2>
            <p className="text-muted-foreground">@{user.githubUsername}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">{user.publicReposCount} Public Repos</Badge>
          <Badge variant="secondary">{user.followersCount} Followers</Badge>
          <Badge variant="secondary">{user.followingCount} Following</Badge>
        </div>
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Contributions</CardTitle>
            <GitCommit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.totalContributions}</div>
            <p className="text-xs text-muted-foreground">Lifetime</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pull Requests</CardTitle>
            <GitPullRequest className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{
              user.contributions.filter(c => c.type === "PULL_REQUEST").reduce((sum, c) => sum + c.count, 0)
            }</div>
            <p className="text-xs text-muted-foreground">Total PRs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Repositories</CardTitle>
            <FileCode2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.publicReposCount}</div>
            <p className="text-xs text-muted-foreground">Public</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Stars</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.repositories?.reduce((sum, repo) => sum + (repo.stargazerCount || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">All repos</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Monthly contribution activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {isLoadingChart ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : timeSeriesData && timeSeriesData.points.length > 0 ? (
                <Line
                  data={{
                    labels: timeSeriesData.points.map(point => point.chartDate || formatDate(point.date)),
                    datasets: [
                      {
                        label: 'Contributions',
                        data: timeSeriesData.points.map(point => point.count),
                        borderColor: 'hsl(var(--primary))',
                        backgroundColor: 'hsl(var(--primary) / 0.1)',
                        tension: 0.4,
                        fill: true,
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                      tooltip: { mode: 'index', intersect: false }
                    },
                    scales: {
                      x: { grid: { display: false } },
                      y: { 
                        beginAtZero: true,
                        grid: { color: 'hsl(var(--border) / 0.2)' }
                      }
                    }
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No activity data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Popular Repositories</CardTitle>
            <CardDescription>Your most starred repositories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.repositories
                ?.sort((a, b) => (b.stargazerCount || 0) - (a.stargazerCount || 0))
                .slice(0, 5)
                .map((repo) => (
                  <div key={repo.id} className="flex items-center gap-4 rounded-lg border p-3">
                    <Code2 className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{repo.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          <span>{repo.stargazerCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <GitFork className="h-3 w-3" />
                          <span>{repo.forkCount}</span>
                        </div>
                        {repo.language && (
                          <Badge variant="secondary" className="ml-auto">
                            {repo.language}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest contributions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.contributions
                .slice(0, 5)
                .map((contribution, index) => (
                  <div key={index} className="flex items-center gap-4 rounded-lg border p-3">
                    <Activity className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {contribution.type} contribution
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(contribution.date)}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {contribution.count} contributions
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}