import { GitBranchIcon, FolderIcon, ActivityIcon, CodepenIcon, BookIcon, FileTextIcon, MessageSquareIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/metric-card';
import { RadarChart } from '@/components/ui/radar-chart';
import { metricImprovementTips } from '@/lib/tooltipData';

interface DashboardCodeQualityTabProps {
  codeQualityStats: {
    overallScore: number;
    maintainabilityScore: number;
    readabilityScore: number;
    efficiencyScore: number;
    modularityScore: number;
    testCoverage: number;
    codeReviewStats: Array<{
      label: string;
      value: string | number;
    }>;
    recentImprovements: Array<{
      description: string;
      date: string;
    }>;
  };
  documentationStats: {
    coverage: number;
  };
}

export function DashboardCodeQualityTab({ codeQualityStats, documentationStats }: DashboardCodeQualityTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Code Quality Score"
          value={`${codeQualityStats.overallScore}/100`}
          icon={<CodepenIcon className="h-4 w-4" />}
          tip="Improve overall code quality by following best practices, using linters, and conducting regular code reviews."
          valueClassName={codeQualityStats.overallScore >= 80 ? "text-green-500" : "text-amber-500"}
        />
        <MetricCard
          title="Documentation Coverage"
          value={`${documentationStats.coverage}%`}
          icon={<BookIcon className="h-4 w-4" />}
          tip="Enhance documentation coverage by adding comprehensive comments, JSDoc/TSDoc, and README files."
        />
        <MetricCard
          title="Test Coverage"
          value={`${codeQualityStats.testCoverage}%`}
          icon={<ActivityIcon className="h-4 w-4" />}
          tip="Increase test coverage by writing unit tests, integration tests, and end-to-end tests for critical code paths."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <RadarChart 
              title="Code Quality Metrics"
              labels={['Maintainability', 'Readability', 'Efficiency', 'Modularity', 'Test Coverage']}
              datasets={[{
                label: 'Code Quality',
                data: [
                  codeQualityStats.maintainabilityScore,
                  codeQualityStats.readabilityScore,
                  codeQualityStats.efficiencyScore,
                  codeQualityStats.modularityScore,
                  codeQualityStats.testCoverage
                ],
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'rgba(99, 102, 241, 1)'
              }]}
              tip="Overall code quality metrics shown across different dimensions"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Code Review Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {codeQualityStats.codeReviewStats.map((stat: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <MessageSquareIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{stat.label}</span>
                  </div>
                  <span className="text-sm font-medium">{stat.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Code Quality Improvements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {codeQualityStats.recentImprovements.map((improvement: any, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1">
                    <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm">{improvement.description}</p>
                    <p className="text-xs text-muted-foreground">{improvement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
