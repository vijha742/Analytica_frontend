import { StarIcon, GitForkIcon, CodeIcon, FileTextIcon, BrainIcon, FolderIcon, LayersIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MetricCard } from '../ui/metric-card';
import { metricImprovementTips } from '@/lib/tooltipData';
import { Repository, CodeMetrics } from '@/types/github';

interface CodeQuality {
  score: number;
  maintainabilityIndex: number;
}

interface ReadmeInfo {
  hasReadme: boolean;
  readmeScore: number;
}

interface RepositoriesTabContentProps {
  repos: Repository[];
  primaryRepo: {
    codeMetrics: CodeMetrics;
    codeQuality?: CodeQuality;
    readmeInfo?: ReadmeInfo;
  };
}

export function RepositoriesTabContent({ repos, primaryRepo }: RepositoriesTabContentProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {repos.slice(0, 4).map((repo, index) => (
          <Card key={index} className="h-full">
            <CardHeader>
              <CardTitle className="text-base">{repo.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{repo.language}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4 line-clamp-2">{repo.description}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm">{repo.stargazerCount}</span>
                </div>
                <div className="flex items-center">
                  <GitForkIcon className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm">{repo.forkCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Code Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MetricCard
                title="Total Lines"
                value={primaryRepo.codeMetrics.totalLines.toLocaleString()}
                icon={<CodeIcon className="h-4 w-4" />}
                tip={metricImprovementTips.totalLines}
              />
              <MetricCard
                title="Avg. File Size"
                value={`${primaryRepo.codeMetrics.avgFileSize} lines`}
                icon={<FileTextIcon className="h-4 w-4" />}
                tip={metricImprovementTips.avgFileSize}
              />
              <Card className="sm:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Language Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.entries(primaryRepo.codeMetrics.languageDistribution).map(([lang, percentage]) => (
                    <div key={lang} className="mb-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs">{lang}</span>
                        <span className="text-xs">{percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Complexity Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MetricCard
                title="Complexity Score"
                value={`${primaryRepo.codeMetrics.complexityMetrics.score}/100`}
                icon={<BrainIcon className="h-4 w-4" />}
                tip={metricImprovementTips.complexityScore}
                valueClassName={primaryRepo.codeMetrics.complexityMetrics.score < 70 ? "text-green-500" : "text-amber-500"}
              />
              <MetricCard
                title="File Count"
                value={primaryRepo.codeMetrics.complexityMetrics.fileCount}
                icon={<FileTextIcon className="h-4 w-4" />}
                tip={metricImprovementTips.fileCount}
              />
              <MetricCard
                title="Folder Count"
                value={primaryRepo.codeMetrics.complexityMetrics.folderCount}
                icon={<FolderIcon className="h-4 w-4" />}
                tip={metricImprovementTips.folderCount}
              />
              <MetricCard
                title="Dependency Count"
                value={primaryRepo.codeMetrics.complexityMetrics.dependencyCount}
                icon={<LayersIcon className="h-4 w-4" />}
                tip={metricImprovementTips.dependencyCount}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
