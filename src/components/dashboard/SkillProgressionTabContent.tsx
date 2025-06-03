import { TrendingUpIcon, BrainIcon, CodepenIcon, ChevronRightIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MetricCard } from '../ui/metric-card';

interface SkillProgressionTabContentProps {
  skillProgressionMetrics: any;
  languageProgressions: any[];
  technologyProgressions: any[];
}

export function SkillProgressionTabContent({ 
  skillProgressionMetrics, 
  languageProgressions, 
  technologyProgressions 
}: SkillProgressionTabContentProps) {
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
          tip="Experiment more with new libraries, frameworks, and coding patterns in your projects."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Language Progression</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {languageProgressions.slice(0, 4).map((progression, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{progression.language}</span>
                    <span className="text-xs">{progression.year}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        progression.proficiencyLevel === 'EXPERT' ? 'bg-green-500' : 
                        progression.proficiencyLevel === 'ADVANCED' ? 'bg-blue-500' : 
                        progression.proficiencyLevel === 'INTERMEDIATE' ? 'bg-amber-500' : 
                        'bg-rose-500'
                      }`}
                      style={{ width: `${
                        progression.proficiencyLevel === 'EXPERT' ? '95' : 
                        progression.proficiencyLevel === 'ADVANCED' ? '75' : 
                        progression.proficiencyLevel === 'INTERMEDIATE' ? '50' : 
                        '25'
                      }%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>{progression.linesOfCode.toLocaleString()} lines</span>
                    <span>{progression.repositoryCount} repositories</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technology Progression</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {technologyProgressions.slice(0, 4).map((progression, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{progression.technology}</span>
                      <span className="ml-2 text-xs px-2 py-0.5 bg-muted rounded-full">{progression.category}</span>
                    </div>
                    <span className="text-xs">{progression.year}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${progression.adoptionRate * 10}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>Adoption: {progression.adoptionRate}/10</span>
                    <span>{progression.repositoryCount} repositories</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skill Growth Recommendations section */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Growth Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skillProgressionMetrics.recommendations.map((recommendation: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg bg-muted/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/20 text-primary">
                    <BrainIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{recommendation.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{recommendation.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {recommendation.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Trend: {recommendation.trend}
                      </span>
                    </div>
                    <div className="mt-3">
                      <a href={recommendation.resourceLink} className="text-sm flex items-center text-primary hover:underline">
                        Learn more <ChevronRightIcon className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
