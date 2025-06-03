import { UsersIcon, CodeIcon, MessageSquareIcon, ActivityIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/metric-card';
import { RadarChart } from '@/components/ui/radar-chart';
import { CircularProgress } from '@/components/ui/circular-progress';
import { metricImprovementTips } from '@/lib/tooltipData';

interface CollaborationTabMetrics {
  teamCollaborationScore: number;
  codeReviewParticipation: number;
  issueResolutionRate: number;
  avgResponseTime: number;
}

interface CommunityEngagementMetrics {
  discussionParticipation: number;
  issueResponses: number;
  pullRequestsReviewed: number;
  avgReviewQuality: number;
  helpfulnessRating: number;
  soloVsTeamScore: number;
}

interface DashboardCollaborationTabProps {
  collaborationMetrics: CollaborationTabMetrics;
  communityEngagement: CommunityEngagementMetrics;
}

export function DashboardCollaborationTab({ collaborationMetrics, communityEngagement }: DashboardCollaborationTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Team Collaboration"
          value={`${collaborationMetrics.teamCollaborationScore}/100`}
          icon={<UsersIcon className="h-4 w-4" />}
          tip={metricImprovementTips.teamCollaborationScore}
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard
          title="Code Review Participation"
          value={`${collaborationMetrics.codeReviewParticipation}%`}
          icon={<CodeIcon className="h-4 w-4" />}
          tip={metricImprovementTips.codeReviewParticipation}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Issue Resolution Rate"
          value={`${collaborationMetrics.issueResolutionRate}%`}
          icon={<MessageSquareIcon className="h-4 w-4" />}
          tip={metricImprovementTips.issueResolutionRate}
          trend={{ value: 5, isPositive: true }}
        />
        <MetricCard
          title="Avg. Response Time"
          value={`${collaborationMetrics.avgResponseTime} hrs`}
          icon={<ActivityIcon className="h-4 w-4" />}
          tip={metricImprovementTips.avgResponseTime}
          trend={{ value: 1.2, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Collaboration Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <RadarChart
              title="Collaboration Profile"
              labels={[
                'Team Collaboration',
                'Code Review',
                'Issue Resolution',
                'Response Time',
                'Community Engagement'
              ]}
              datasets={[
                {
                  label: 'Your Profile',
                  data: [
                    collaborationMetrics.teamCollaborationScore,
                    collaborationMetrics.codeReviewParticipation,
                    collaborationMetrics.issueResolutionRate,
                    100 - collaborationMetrics.avgResponseTime * 5,
                    communityEngagement.helpfulnessRating * 10
                  ],
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  borderColor: 'rgba(99, 102, 241, 1)',
                },
                {
                  label: 'Average Developer',
                  data: [65, 60, 70, 65, 75],
                  backgroundColor: 'rgba(156, 163, 175, 0.2)',
                  borderColor: 'rgba(156, 163, 175, 1)',
                }
              ]}
              tip={metricImprovementTips.collaborationProfile}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Community Engagement</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <CircularProgress 
              value={communityEngagement.discussionParticipation} 
              max={200}
              title="Discussions" 
              tip={metricImprovementTips.discussionParticipation} 
            />
            <CircularProgress 
              value={communityEngagement.issueResponses} 
              max={300}
              title="Issue Responses" 
              tip={metricImprovementTips.issueResponses} 
            />
            <CircularProgress 
              value={communityEngagement.pullRequestsReviewed} 
              max={400}
              title="PRs Reviewed" 
              tip={metricImprovementTips.pullRequestsReviewed} 
            />
            <CircularProgress 
              value={communityEngagement.avgReviewQuality * 10} 
              max={100}
              title="Review Quality" 
              tip={metricImprovementTips.avgReviewQuality} 
            />
            <CircularProgress 
              value={communityEngagement.helpfulnessRating * 10} 
              max={100}
              title="Helpfulness" 
              tip={metricImprovementTips.helpfulnessRating} 
            />
            <CircularProgress 
              value={communityEngagement.soloVsTeamScore} 
              max={100}
              title="Team Player" 
              tip={metricImprovementTips.soloVsTeamScore} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
