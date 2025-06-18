import { CodeIcon, FileTextIcon, BrainIcon, FolderIcon, LayersIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/metric-card';
import { metricImprovementTips } from '@/lib/tooltipData';
import { useParams } from 'next/navigation';
import { useCodeAnalysis } from '@/hooks/useGithubData';

interface DashboardRepositoriesTabProps {
  repos: Array<{
    id: number;
    name: string;
    description: string;
    language: string;
    stargazerCount: number;
    forkCount: number;
  }>;
  primaryRepo: {
    title?: string;
    codeMetrics: {
      totalLines: number;
      avgFileSize: number;
      languageDistribution: Record<string, number>;
      complexityMetrics: {
        score: number;
        fileCount: number;
        folderCount: number;
        dependencyCount: number;
      };
    };
  };
}

export function DashboardRepositoriesTab({ primaryRepo }: DashboardRepositoriesTabProps) {
  const params = useParams();
  const username = typeof params.username === 'string' ? params.username : '';
  const { data: codeAnalysisData, isLoading } = useCodeAnalysis(username);

  // Find the primary repository data from code analysis
  const primaryRepoData = codeAnalysisData?.find(repo => 
    repo.title === (primaryRepo?.title || 'Analytica_frontend')
  );
  
  // Use API data if available, otherwise fall back to props
  const repoData = {
    totalLines: primaryRepoData?.totalLines || primaryRepo.codeMetrics.totalLines,
    avgFileSize: primaryRepoData?.averageFileSize || primaryRepo.codeMetrics.avgFileSize,
    complexityScore: primaryRepoData?.complexityScore || primaryRepo.codeMetrics.complexityMetrics.score,
    languageDistribution: primaryRepoData 
      ? primaryRepoData.languageDistribution.reduce((acc, lang) => {
          acc[lang.language] = lang.percentage;
          return acc;
        }, {} as Record<string, number>) 
      : primaryRepo.codeMetrics.languageDistribution,
    fileCount: primaryRepoData?.languageDistribution?.reduce((acc, lang) => acc + (lang.fileCount || 0), 0) || 
               primaryRepo.codeMetrics.complexityMetrics.fileCount,
    folderCount: primaryRepo.codeMetrics.complexityMetrics.folderCount,
    dependencyCount: primaryRepo.codeMetrics.complexityMetrics.dependencyCount,
    complexityFactors: primaryRepoData?.complexityFactors || []
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MetricCard
                  title="Total Lines"
                  value={repoData.totalLines.toLocaleString()}
                  icon={<CodeIcon className="h-4 w-4" />}
                  tip={metricImprovementTips.totalLines}
                />
                <MetricCard
                  title="Avg. File Size"
                  value={`${repoData.avgFileSize} lines`}
                  icon={<FileTextIcon className="h-4 w-4" />}
                  tip={metricImprovementTips.avgFileSize}
                />
                <Card className="sm:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Language Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {Object.entries(repoData.languageDistribution).map(([lang, percentage]) => (
                      <div key={lang} className="mb-2">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs">{lang}</span>
                          <span className="text-xs">{typeof percentage === 'number' ? percentage.toFixed(2) : percentage}%</span>
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
                  value={`${repoData.complexityScore}/100`}
                  icon={<BrainIcon className="h-4 w-4" />}
                  tip={metricImprovementTips.complexityScore}
                  valueClassName={repoData.complexityScore < 70 ? "text-green-500" : "text-amber-500"}
                />
                <MetricCard
                  title="File Count"
                  value={repoData.fileCount}
                  icon={<FileTextIcon className="h-4 w-4" />}
                  tip={metricImprovementTips.fileCount}
                />
                <MetricCard
                  title="Folder Count"
                  value={repoData.folderCount}
                  icon={<FolderIcon className="h-4 w-4" />}
                  tip={metricImprovementTips.folderCount}
                />
                <MetricCard
                  title="Dependency Count"
                  value={repoData.dependencyCount}
                  icon={<LayersIcon className="h-4 w-4" />}
                  tip={metricImprovementTips.dependencyCount}
                />
              </div>
              {repoData.complexityFactors.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Complexity Factors</h4>
                  <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-1">
                    {repoData.complexityFactors.map((factor, index) => (
                      <li key={index}>{factor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
