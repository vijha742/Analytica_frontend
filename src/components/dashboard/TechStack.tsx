'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TechAnalysis } from '@/types/github';
import { Zap, TrendingUp, TrendingDown, Minus, Award } from 'lucide-react';
import { useMemo } from 'react';

interface TechStackProps {
  techAnalysis: TechAnalysis;
}

export function TechStack({ techAnalysis }: TechStackProps) {
  const topLanguages = useMemo(() => {
    return techAnalysis.primaryLanguages
      .sort((a, b) => b.linesOfCode - a.linesOfCode)
      .slice(0, 8);
  }, [techAnalysis.primaryLanguages]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'GROWING':
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'DECLINING':
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return <Minus className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'EXPERT':
        return 'bg-green-500';
      case 'ADVANCED':
        return 'bg-blue-500';
      case 'INTERMEDIATE':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getProficiencyVariant = (level: string) => {
    switch (level) {
      case 'EXPERT':
        return 'default';
      case 'ADVANCED':
        return 'secondary';
      case 'INTERMEDIATE':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Technology Stack Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg border">
            <div className="text-2xl font-bold text-primary">
              {Math.round(techAnalysis.specializationScore * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Specialization</p>
          </div>
          <div className="text-center p-4 rounded-lg border">
            <div className="text-2xl font-bold text-secondary">
              {Math.round(techAnalysis.versatilityScore * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Versatility</p>
          </div>
          <div className="text-center p-4 rounded-lg border">
            <div className="text-2xl font-bold text-accent">
              {techAnalysis.primaryLanguages.length}
            </div>
            <p className="text-xs text-muted-foreground">Languages</p>
          </div>
          <div className="text-center p-4 rounded-lg border">
            <div className="text-2xl font-bold text-muted-foreground">
              {Math.round(techAnalysis.learningRate * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Learning Rate</p>
          </div>
        </div>

        {/* Primary Languages */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold flex items-center gap-2">
            <Award className="w-5 h-5" />
            Primary Languages
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topLanguages.map((lang) => (
              <div key={lang.language} className="p-4 rounded-lg border bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getProficiencyColor(lang.proficiencyLevel)}`} />
                    <h5 className="font-medium">{lang.language}</h5>
                    {getTrendIcon(lang.trendIndicator)}
                  </div>
                  <Badge variant={getProficiencyVariant(lang.proficiencyLevel)}>
                    {lang.proficiencyLevel}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="font-medium">{lang.linesOfCode.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Lines of Code</div>
                  </div>
                  <div>
                    <div className="font-medium">{lang.projectCount}</div>
                    <div className="text-xs text-muted-foreground">Projects</div>
                  </div>
                  <div>
                    <div className="font-medium">
                      {lang.yearsOfExperience < 1 
                        ? `${Math.round(lang.yearsOfExperience * 12)}mo`
                        : `${lang.yearsOfExperience.toFixed(1)}y`
                      }
                    </div>
                    <div className="text-xs text-muted-foreground">Experience</div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Last used: {new Date(lang.lastUsed).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Technologies */}
        {(techAnalysis.frameworksUsed.length > 0 || 
          techAnalysis.librariesUsed.length > 0 || 
          techAnalysis.toolingPreferences.length > 0) && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Additional Technologies</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {techAnalysis.frameworksUsed.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2">Frameworks</h5>
                  <div className="flex flex-wrap gap-2">
                    {techAnalysis.frameworksUsed.map((framework) => (
                      <Badge key={framework} variant="outline">
                        {framework}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {techAnalysis.librariesUsed.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2">Libraries</h5>
                  <div className="flex flex-wrap gap-2">
                    {techAnalysis.librariesUsed.map((library) => (
                      <Badge key={library} variant="outline">
                        {library}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {techAnalysis.toolingPreferences.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2">Tools</h5>
                  <div className="flex flex-wrap gap-2">
                    {techAnalysis.toolingPreferences.map((tool) => (
                      <Badge key={tool} variant="outline">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
