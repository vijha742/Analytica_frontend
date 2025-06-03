import { TrendingUpIcon, BrainIcon, CodepenIcon, ChevronRightIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/metric-card';

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
    </div>
  );
}
