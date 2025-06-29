'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReadmeAnalysis } from '@/types/github';
import { FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useMemo } from 'react';

interface ReadmeQualityProps {
  readmeAnalysis: ReadmeAnalysis[];
}

export function ReadmeQuality({ readmeAnalysis }: ReadmeQualityProps) {
  const stats = useMemo(() => {
    const totalRepos = readmeAnalysis.length;
    const averageScore = totalRepos > 0 
      ? Math.round(readmeAnalysis.reduce((sum, readme) => sum + readme.score, 0) / totalRepos)
      : 0;

    const qualityDistribution = {
      excellent: readmeAnalysis.filter(r => r.score >= 80).length,
      good: readmeAnalysis.filter(r => r.score >= 60 && r.score < 80).length,
      fair: readmeAnalysis.filter(r => r.score >= 40 && r.score < 60).length,
      poor: readmeAnalysis.filter(r => r.score < 40).length,
    };

    const topReadmes = readmeAnalysis
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return {
      totalRepos,
      averageScore,
      qualityDistribution,
      topReadmes
    };
  }, [readmeAnalysis]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    if (score >= 40) return 'outline';
    return 'destructive';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          README Quality Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-3xl font-bold ${getScoreColor(stats.averageScore)}`}>
            {stats.averageScore}
          </div>
          <p className="text-sm text-muted-foreground">Average README Score</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Excellent (80+)</span>
              <Badge variant="default">{stats.qualityDistribution.excellent}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Good (60-79)</span>
              <Badge variant="secondary">{stats.qualityDistribution.good}</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Fair (40-59)</span>
              <Badge variant="outline">{stats.qualityDistribution.fair}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Poor (0-39)</span>
              <Badge variant="destructive">{stats.qualityDistribution.poor}</Badge>
            </div>
          </div>
        </div>

        {stats.topReadmes.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Top README Files</h4>
            <div className="space-y-2">
              {stats.topReadmes.map((readme) => (
                <div key={readme.title} className="flex items-center justify-between p-2 rounded-lg border">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{readme.title}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-xs">
                        {readme.hasIntroduction ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-500" />
                        )}
                        Intro
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        {readme.hasInstallationGuide ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-500" />
                        )}
                        Install
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        {readme.hasUsageExamples ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-500" />
                        )}
                        Usage
                      </div>
                    </div>
                  </div>
                  <Badge variant={getScoreBadgeVariant(readme.score)}>
                    {readme.score}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
