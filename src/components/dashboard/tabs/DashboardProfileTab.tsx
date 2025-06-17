import { UserIcon, UsersIcon, GitBranchIcon, FolderIcon, MessageSquareIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { MetricCard } from '../../ui/metric-card';
import { metricImprovementTips } from '@/lib/tooltipData';
import { GithubUser, ContributionType } from '@/types/github';

interface DashboardProfileTabProps {
  user: GithubUser;
}

export function DashboardProfileTab({ user }: DashboardProfileTabProps) {
  // Calculate contribution counts from user.contributions array
  const pullRequests = user.contributions?.filter(c => c.type === ContributionType.PULL_REQUEST)?.reduce((sum, c) => sum + c.count, 0) || 0;
  const issues = user.contributions?.filter(c => c.type === ContributionType.ISSUE)?.reduce((sum, c) => sum + c.count, 0) || 0;
  const commits = user.contributions?.filter(c => c.type === ContributionType.COMMIT)?.reduce((sum, c) => sum + c.count, 0) || 0;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Followers"
          value={user.followersCount}
          icon={<UserIcon className="h-4 w-4" />}
          tip={metricImprovementTips.followersCount}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Following"
          value={user.followingCount}
          icon={<UsersIcon className="h-4 w-4" />}
          tip={metricImprovementTips.followingCount}
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard
          title="Contributions"
          value={user.totalContributions}
          icon={<GitBranchIcon className="h-4 w-4" />}
          tip={metricImprovementTips.contributionsCount}
          trend={{ value: 24, isPositive: true }}
        />
        <MetricCard
          title="Public Repositories"
          value={user.publicReposCount}
          icon={<FolderIcon className="h-4 w-4" />}
          tip={metricImprovementTips.publicRepositories}
          trend={{ value: 5, isPositive: true }}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Contributions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Pull Requests"
              value={pullRequests}
              icon={<GitBranchIcon className="h-4 w-4" />}
              tip={metricImprovementTips.pullRequestsCreated}
            />
            <MetricCard
              title="Issues"
              value={issues}
              icon={<MessageSquareIcon className="h-4 w-4" />}
              tip={metricImprovementTips.issuesCreated}
            />
            <MetricCard
              title="Commits"
              value={commits}
              icon={<GitBranchIcon className="h-4 w-4" />}
              tip="Increase your commit count by making regular, atomic commits to your projects."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
