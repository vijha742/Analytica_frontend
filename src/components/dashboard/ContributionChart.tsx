'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Contribution } from '@/types/github';
import { Activity, GitCommit, GitPullRequest, MessageSquare } from 'lucide-react';
import { useMemo } from 'react';

interface ContributionChartProps {
  contributions: Contribution[];
}

export function ContributionChart({ contributions }: ContributionChartProps) {
  const contributionStats = useMemo(() => {
    const stats = contributions.reduce((acc, contrib) => {
      acc[contrib.type] = (acc[contrib.type] || 0) + contrib.count;
      return acc;
    }, {} as Record<string, number>);

    return [
      {
        type: 'COMMIT',
        count: stats.COMMIT || 0,
        label: 'Commits',
        icon: GitCommit,
        color: 'bg-blue-500',
      },
      {
        type: 'PULL_REQUEST',
        count: stats.PULL_REQUEST || 0,
        label: 'Pull Requests',
        icon: GitPullRequest,
        color: 'bg-green-500',
      },
      {
        type: 'ISSUE',
        count: stats.ISSUE || 0,
        label: 'Issues',
        icon: MessageSquare,
        color: 'bg-orange-500',
      },
    ];
  }, [contributions]);

  const totalContributions = contributionStats.reduce((sum, stat) => sum + stat.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Contribution Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">{totalContributions}</div>
          <p className="text-sm text-muted-foreground">Total Contributions</p>
        </div>

        <div className="space-y-3">
          {contributionStats.map((stat) => {
            const percentage = totalContributions > 0 ? (stat.count / totalContributions) * 100 : 0;
            
            return (
              <div key={stat.type} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <stat.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{stat.label}</span>
                  </div>
                  <Badge variant="secondary">{stat.count}</Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${stat.color} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {contributions.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Last activity: {new Date(contributions[0]?.date).toLocaleDateString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
