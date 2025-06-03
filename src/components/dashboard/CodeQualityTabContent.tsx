import { GitBranchIcon, FolderIcon, ActivityIcon, CodepenIcon, BookIcon, FileTextIcon, MessageSquareIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MetricCard } from '../ui/metric-card';
import { RadarChart } from '../ui/radar-chart';
import { metricImprovementTips } from '@/lib/tooltipData';

interface CodeQualityTabContentProps {
  codeQualityStats: any; // Add proper type
  documentationStats: any; // Add proper type
}

export function CodeQualityTabContent({ codeQualityStats, documentationStats }: CodeQualityTabContentProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Avg. Commit Quality"
          value={`${codeQualityStats.avgCommitQuality}/10`}
          icon={<GitBranchIcon className="h-4 w-4" />}
          tip="Improve commit quality by making atomic commits with clear messages that explain the why, not just the what."
        />
        <MetricCard
          title="Code Organization"
          value={`${codeQualityStats.codeOrganizationScore}/100`}
          icon={<FolderIcon className="h-4 w-4" />}
          tip="Enhance code organization by following consistent patterns and architecture principles across your projects."
        />
        <MetricCard
          title="Test Coverage"
          value={`${codeQualityStats.testCoverage}%`}
          icon={<ActivityIcon className="h-4 w-4" />}
          tip="Increase test coverage across your repositories by writing more unit, integration, and end-to-end tests."
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Code Quality Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <RadarChart
              title="Code Quality Profile"
              labels={[
                'Organization',
                'Test Coverage',
                'Documentation',
                'Commit Quality',
                'Maintainability'
              ]}
              datasets={[
                {
                  label: 'Your Profile',
                  data: [
                    codeQualityStats.codeOrganizationScore,
                    codeQualityStats.testCoverage,
                    documentationStats.avgReadmeScore,
                    codeQualityStats.avgCommitQuality * 10,
                    codeQualityStats.maintainabilityIndex
                  ],
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  borderColor: 'rgba(16, 185, 129, 1)',
                },
                {
                  label: 'Industry Standard',
                  data: [70, 75, 65, 80, 75],
                  backgroundColor: 'rgba(156, 163, 175, 0.2)',
                  borderColor: 'rgba(156, 163, 175, 1)',
                }
              ]}
              tip={metricImprovementTips.codeQualityProfile || "Improve your code quality by focusing on organization, test coverage, documentation, commit quality, and maintainability."}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documentation Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Avg. Readme Score"
              value={`${documentationStats.avgReadmeScore}/100`}
              icon={<BookIcon className="h-4 w-4" />}
              tip="Improve your README files with clear project descriptions, installation instructions, usage examples, and contribution guidelines."
            />
            <MetricCard
              title="Wiki Usage Rate"
              value={`${documentationStats.wikiUsageRate}%`}
              icon={<FileTextIcon className="h-4 w-4" />}
              tip="Utilize wikis for more detailed documentation that doesn't fit in README files, especially for larger projects."
            />
            <MetricCard
              title="Inline Documentation"
              value={`${documentationStats.inlineDocumentationCoverage}%`}
              icon={<CodepenIcon className="h-4 w-4" />}
              tip="Add more inline documentation to your code to make it easier for others (and future you) to understand."
            />
            <MetricCard
              title="Documentation Consistency"
              value={`${documentationStats.documentationConsistency}/10`}
              icon={<MessageSquareIcon className="h-4 w-4" />}
              tip="Maintain consistent documentation style and standards across all your repositories."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
