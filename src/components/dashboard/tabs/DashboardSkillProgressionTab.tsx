import { TrendingUpIcon, BrainIcon, CodepenIcon, ChevronRightIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/metric-card';
import { useReadmeAnalysis } from '@/hooks/useGithubData';
import { useParams } from 'next/navigation';

interface SkillProgressionMetrics {
  newTechnologiesAdoptedByYear: number;
  learningRate: number;
  experimentationRate: number;
  lastUpdated: string;
  recommendations?: string[];
}

interface LanguageProgression {
  name: string;
  category: string;
  proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  progress: number;
  year: number;
  proficiencyPercentage: number;
  growth: number;
}

interface TechnologyProgression {
  name: string;
  category: string;
  adoptionRate: number;
  year: number;
  repositoryCount: number;
  experienceLevel: string;
  lastUsed: string;
  icon?: React.ReactNode;
}

interface DashboardSkillProgressionTabProps {
  skillProgressionMetrics: SkillProgressionMetrics;
  languageProgressions: LanguageProgression[];
  technologyProgressions: TechnologyProgression[];
}

export function DashboardSkillProgressionTab({ 
  skillProgressionMetrics, 
  languageProgressions, 
  technologyProgressions 
}: DashboardSkillProgressionTabProps) {
  const params = useParams();
  const username = typeof params.username === 'string' ? params.username : '';
  const { data: readmeAnalysisData, isLoading } = useReadmeAnalysis(username);
  
  // Calculate average README score
  const averageScore = readmeAnalysisData 
    ? readmeAnalysisData.reduce((sum, item) => sum + item.score, 0) / readmeAnalysisData.length 
    : 0;
  
  // Count readmes with documentation features
  const withIntro = readmeAnalysisData ? readmeAnalysisData.filter(item => item.hasIntroduction).length : 0;
  const withInstallation = readmeAnalysisData ? readmeAnalysisData.filter(item => item.hasInstallationGuide).length : 0;
  const withExamples = readmeAnalysisData ? readmeAnalysisData.filter(item => item.hasUsageExamples).length : 0;
  const withMaintainer = readmeAnalysisData ? readmeAnalysisData.filter(item => item.hasMaintainerSection).length : 0;
  
  // Get most recent README update
  const lastUpdated = readmeAnalysisData 
    ? readmeAnalysisData.reduce((latest, item) => {
        if (!item.lastUpdated) return latest;
        return !latest || new Date(item.lastUpdated) > new Date(latest) 
          ? item.lastUpdated 
          : latest;
      }, '') 
    : skillProgressionMetrics.lastUpdated;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="New Technologies / Year"
          value={skillProgressionMetrics.newTechnologiesAdoptedByYear}
          icon={<TrendingUpIcon className="h-4 w-4" />}
          tip="Regularly learn and adopt new technologies to stay current with industry trends."
        />
        <MetricCard
          title="Learning Rate"
          value={`${skillProgressionMetrics.learningRate}/10`}
          icon={<BrainIcon className="h-4 w-4" />}
          tip="Increase your learning rate by dedicating regular time to explore new technologies and techniques."
        />
        <MetricCard
          title="Experimentation Rate"
          value={`${skillProgressionMetrics.experimentationRate}/10`}
          icon={<CodepenIcon className="h-4 w-4" />}
          tip="Boost your experimentation rate by trying out new tools and approaches in side projects."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Language Progression</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {languageProgressions.map((lang, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{lang.name}</span>
                      <span className="ml-2 text-xs px-2 py-0.5 bg-muted rounded-full">{lang.category}</span>
                    </div>
                    <span className="text-xs">{lang.proficiencyLevel}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${lang.proficiencyPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">6 months ago</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      {lang.growth >= 0 ? '+' : ''}{lang.growth}%
                      <ChevronRightIcon className={`h-3 w-3 ${lang.growth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technology Stack Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {technologyProgressions.map((tech, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      {tech.icon}
                      <div>
                        <div className="text-sm font-medium">{tech.name}</div>
                        <div className="text-xs text-muted-foreground">{tech.category}</div>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-muted">{tech.experienceLevel}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Last used: {tech.lastUsed}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documentation Quality Card using README analysis data */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Documentation Quality</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Average README Score</h3>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${averageScore}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">0</span>
                  <span className="text-xs text-muted-foreground">{averageScore.toFixed(0)}/100</span>
                  <span className="text-xs text-muted-foreground">100</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">README Features</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between text-sm">
                      <span>Introduction</span>
                      <span className="font-medium">{withIntro}/{readmeAnalysisData?.length || 0}</span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span>Installation Guide</span>
                      <span className="font-medium">{withInstallation}/{readmeAnalysisData?.length || 0}</span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span>Usage Examples</span>
                      <span className="font-medium">{withExamples}/{readmeAnalysisData?.length || 0}</span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span>Maintainer Info</span>
                      <span className="font-medium">{withMaintainer}/{readmeAnalysisData?.length || 0}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Projects with READMEs</h3>
                  <div className="aspect-square relative">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                      <circle r="40" cx="50" cy="50" fill="transparent" stroke="currentColor" strokeWidth="10" strokeOpacity="0.1" />
                      <circle 
                        r="40" 
                        cx="50" 
                        cy="50" 
                        fill="transparent" 
                        stroke="currentColor" 
                        strokeWidth="10" 
                        strokeDasharray={`${(readmeAnalysisData?.length || 0) / (technologyProgressions.length || 1) * 251.2} 251.2`} 
                        className="text-green-500" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{Math.round((readmeAnalysisData?.length || 0) / (technologyProgressions.length || 1) * 100)}%</div>
                        <div className="text-xs text-muted-foreground">Coverage</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {readmeAnalysisData && readmeAnalysisData.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Top READMEs</h3>
                  <div className="space-y-2">
                    {readmeAnalysisData
                      .sort((a, b) => b.score - a.score)
                      .slice(0, 3)
                      .map((readme, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                          <span className="font-medium">{readme.title}</span>
                          <span className="text-sm">{readme.score}/100</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
