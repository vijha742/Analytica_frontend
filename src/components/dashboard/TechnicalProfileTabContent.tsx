import { StarIcon, GitForkIcon, LayersIcon, UsersIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MetricCard } from '../ui/metric-card';

import { DeveloperImpactMetrics, RepositoryAnalytics, LanguageSpecificField } from '@/types/github';

interface TechnicalProfileTabContentProps {
  technicalProfile: {
    languageSpecificFields: LanguageSpecificField[];
  };
  developerImpactMetrics: DeveloperImpactMetrics;
  repositoryAnalytics: RepositoryAnalytics;
}

export function TechnicalProfileTabContent({ 
  technicalProfile, 
  developerImpactMetrics, 
  repositoryAnalytics 
}: TechnicalProfileTabContentProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Language Proficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {technicalProfile.languageSpecificFields.slice(0, 5).map((lang, index) => (
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
                      className={`h-2 rounded-full ${
                        lang.proficiencyLevel === 'EXPERT' ? 'bg-green-500' : 
                        lang.proficiencyLevel === 'ADVANCED' ? 'bg-blue-500' : 
                        lang.proficiencyLevel === 'INTERMEDIATE' ? 'bg-amber-500' : 
                        'bg-rose-500'
                      }`}
                      style={{ width: `${
                        lang.proficiencyLevel === 'EXPERT' ? '95' : 
                        lang.proficiencyLevel === 'ADVANCED' ? '75' : 
                        lang.proficiencyLevel === 'INTERMEDIATE' ? '50' : 
                        '25'
                      }%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>{lang.yearsOfExperience} years</span>
                    <span>{lang.projectCount} projects</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Developer Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MetricCard
                title="Total Stars"
                value={developerImpactMetrics.totalStars}
                icon={<StarIcon className="h-4 w-4" />}
                tip="Increase stars by creating valuable, well-documented projects and sharing them with relevant communities."
              />
              <MetricCard
                title="Total Forks"
                value={developerImpactMetrics.totalForks}
                icon={<GitForkIcon className="h-4 w-4" />}
                tip="Make your projects more fork-friendly by ensuring they are well-structured and extensible."
              />
              <MetricCard
                title="Community Impact"
                value={`${developerImpactMetrics.communityImpactScore}/100`}
                icon={<UsersIcon className="h-4 w-4" />}
                tip="Build community impact by contributing to open-source projects and engaging in tech communities."
              />
              <MetricCard
                title="Dependent Repos"
                value={developerImpactMetrics.dependentRepoCount}
                icon={<LayersIcon className="h-4 w-4" />}
                tip="Create useful libraries and packages that other developers can depend on in their projects."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Repository Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-4">Repository Status</h3>
              <div className="aspect-square relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{repositoryAnalytics.totalRepositories}</div>
                    <div className="text-xs text-muted-foreground">Total Repos</div>
                  </div>
                </div>
                <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                  <circle r="40" cx="50" cy="50" fill="transparent" stroke="currentColor" strokeWidth="10" strokeOpacity="0.1" />
                  <circle 
                    r="40" 
                    cx="50" 
                    cy="50" 
                    fill="transparent" 
                    stroke="currentColor" 
                    strokeWidth="10" 
                    strokeDasharray={`${(repositoryAnalytics.activeRepositories / repositoryAnalytics.totalRepositories) * 251.2} 251.2`} 
                    className="text-green-500" 
                  />
                </svg>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs">Active: {repositoryAnalytics.activeRepositories}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-muted mr-2"></div>
                  <span className="text-xs">Inactive: {repositoryAnalytics.abandonedRepositories}</span>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium mb-4">Project Metrics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MetricCard
                  title="Avg. Project Duration"
                  value={`${repositoryAnalytics.avgProjectDuration} days`}
                  tip="Track how long you typically spend on projects to improve planning and time management."
                />
                <MetricCard
                  title="Completion Rate"
                  value={`${repositoryAnalytics.completionRate}%`}
                  tip="Improve your project completion rate by setting clear goals and deadlines for your repositories."
                />
                <MetricCard
                  title="Topic Distribution"
                  value={Object.keys(repositoryAnalytics.topicsDistribution).length}
                  tip="Use repository topics consistently to categorize your projects and make them more discoverable."
                />
              </div>
              
              <div className="mt-4">
                <h4 className="text-xs font-medium mb-2">Top Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(repositoryAnalytics.topicsDistribution)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 8)
                    .map(([topic, count], index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-muted rounded-full">
                        {topic} ({count})
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
