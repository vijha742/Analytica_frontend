'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GithubUser, CodeAnalysis } from '@/types/github';
import { Activity, Code, FileText, TrendingUp, Award, Zap } from 'lucide-react';

interface StatsGridProps {
  user: GithubUser;
  codeAnalysis: CodeAnalysis[] | null;
}

export function StatsGrid({ user, codeAnalysis }: StatsGridProps) {
  const totalLinesOfCode = codeAnalysis?.reduce((sum, project) => sum + project.totalLines, 0) || 0;
  const averageComplexity = codeAnalysis?.length
    ? Math.round(codeAnalysis.reduce((sum, project) => sum + project.complexityScore, 0) / codeAnalysis.length)
    : 0;
  const languageCount = user.technicalProfile?.primaryLanguages.length || 0;

  const stats = [
    {
      title: 'Total Contributions',
      // TODO: Replace with actual calculation of total contributions (commits, PRs, issues) when available.
      value: 0,
      icon: Activity,
      description: 'Commits, PRs, and Issues',
      color: 'text-blue-500'
    },
    {
      title: 'Lines of Code',
      value: totalLinesOfCode.toLocaleString(),
      icon: Code,
      description: 'Across all repositories',
      color: 'text-green-500'
    },
    {
      title: 'Average Complexity',
      value: averageComplexity.toString(),
      icon: TrendingUp,
      description: 'Project complexity score',
      color: 'text-orange-500'
    },
    {
      title: 'Languages Used',
      value: languageCount.toString(),
      icon: Zap,
      description: 'Programming languages',
      color: 'text-purple-500'
    },
    {
      title: 'Public Repositories',
      value: user.publicReposCount.toString(),
      icon: FileText,
      description: 'Open source projects',
      color: 'text-indigo-500'
    },
    {
      title: 'Versatility Score',
      value: user.technicalProfile ? Math.round(user.technicalProfile.versatilityScore * 100).toString() : '0',
      icon: Award,
      description: 'Technology diversity',
      color: 'text-pink-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="transition-all hover:shadow-lg hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
