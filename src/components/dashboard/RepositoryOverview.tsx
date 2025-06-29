'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Repository } from '@/types/github';
import { Star, GitFork, Code } from 'lucide-react';

interface RepositoryOverviewProps {
  repositories: Repository[];
}

export function RepositoryOverview({ repositories }: RepositoryOverviewProps) {
  const sortedRepos = repositories
    .filter(repo => repo.stargazerCount > 0 || repo.forkCount > 0)
    .sort((a, b) => (b.stargazerCount + b.forkCount) - (a.stargazerCount + a.forkCount))
    .slice(0, 5);

  const languageStats = repositories.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topLanguages = Object.entries(languageStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="w-5 h-5" />
          Repository Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-3">Top Languages</h4>
          <div className="flex flex-wrap gap-2">
            {topLanguages.map(([language, count]) => (
              <Badge key={language} variant="secondary" className="text-xs">
                {language} ({count})
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Popular Repositories</h4>
          <div className="space-y-3">
            {sortedRepos.length > 0 ? (
              sortedRepos.map((repo) => (
                <div key={repo.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium">{repo.name}</h5>
                      {repo.language && (
                        <Badge variant="outline" className="text-xs">
                          {repo.language}
                        </Badge>
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {repo.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {repo.stargazerCount}
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="w-3 h-3" />
                      {repo.forkCount}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No starred or forked repositories found.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
