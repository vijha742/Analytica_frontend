'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CodeAnalysis } from '@/types/github';
import { Code2, PieChart } from 'lucide-react';
import { useMemo } from 'react';

interface LanguageDistributionProps {
  codeAnalysis: CodeAnalysis[];
}

export function LanguageDistribution({ codeAnalysis }: LanguageDistributionProps) {
  const languageStats = useMemo(() => {
    const totalStats = codeAnalysis.reduce((acc, project) => {
      project.languageDistribution.forEach(lang => {
        if (acc[lang.language]) {
          acc[lang.language].linesOfCode += lang.linesOfCode;
          acc[lang.language].fileCount += lang.fileCount;
        } else {
          acc[lang.language] = {
            language: lang.language,
            linesOfCode: lang.linesOfCode,
            fileCount: lang.fileCount,
            percentage: 0
          };
        }
      });
      return acc;
    }, {} as Record<string, { language: string; linesOfCode: number; fileCount: number; percentage: number }>);

    const totalLines = Object.values(totalStats).reduce((sum, lang) => sum + lang.linesOfCode, 0);
    
    Object.values(totalStats).forEach(lang => {
      lang.percentage = totalLines > 0 ? (lang.linesOfCode / totalLines) * 100 : 0;
    });

    return Object.values(totalStats)
      .sort((a, b) => b.linesOfCode - a.linesOfCode)
      .slice(0, 8);
  }, [codeAnalysis]);

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-orange-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-indigo-500'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code2 className="w-5 h-5" />
          Language Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {languageStats.map((lang, index) => (
            <div key={lang.language} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
                  <span className="text-sm font-medium">{lang.language}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {lang.linesOfCode.toLocaleString()} lines
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {lang.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${colors[index % colors.length]} transition-all duration-500`}
                  style={{ width: `${lang.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">
                {languageStats.reduce((sum, lang) => sum + lang.linesOfCode, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Total Lines</p>
            </div>
            <div>
              <div className="text-2xl font-bold">{languageStats.length}</div>
              <p className="text-xs text-muted-foreground">Languages</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
