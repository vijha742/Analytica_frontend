'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GithubUser, CodeAnalysis, ReadmeAnalysis, TechAnalysis } from '@/types/github';
import { Sparkles, Code, BarChart3, FileText, Zap } from 'lucide-react';
import { fetchUserData, fetchCodeAnalysis, fetchReadmeAnalysis, fetchTechAnalysis } from '@/lib/api-client';

interface DemoDataLoaderProps {
  username: string;
  onDataLoad: (userData: GithubUser, codeAnalysis: CodeAnalysis[], readmeAnalysis: ReadmeAnalysis[], techAnalysis: TechAnalysis) => void;
}

export function DemoDataLoader({ username, onDataLoad }: DemoDataLoaderProps) {
  const [loading, setLoading] = useState(false);

  const handleLoadData = async () => {
    setLoading(true);
    try {
      const [userData, codeAnalysis, readmeAnalysis, techAnalysis] = await Promise.all([
        fetchUserData(username),
        fetchCodeAnalysis(username),
        fetchReadmeAnalysis(username),
        fetchTechAnalysis(username)
      ]);
      onDataLoad(userData, codeAnalysis, readmeAnalysis, techAnalysis);
    } catch {
      alert('Failed to load demo data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto border-2 border-dashed border-primary/30 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Demo Experience</CardTitle>
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <CardDescription className="text-sm">
          Explore the full potential of Analytica with comprehensive sample data showcasing
          all analytics features and beautiful visualizations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Feature highlights */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
            <Code className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">Code Analysis</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/5 border border-secondary/10">
            <BarChart3 className="h-4 w-4 text-secondary" />
            <span className="text-xs font-medium">Contributions</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-accent/5 border border-accent/10">
            <FileText className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium">README Quality</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-chart-1/5 border border-chart-1/10">
            <Zap className="h-4 w-4" style={{ color: 'hsl(var(--chart-1))' }} />
            <span className="text-xs font-medium">Tech Stack</span>
          </div>
        </div>

        {/* Technology stack preview */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Sample Technologies
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {['Java', 'TypeScript', 'React', 'Spring Boot', 'Next.js', 'Tailwind'].map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs py-0.5 px-2">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Demo stats preview */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">1.2K+</div>
            <div className="text-xs text-muted-foreground">Contributions</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-secondary">32</div>
            <div className="text-xs text-muted-foreground">Repositories</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-accent">6</div>
            <div className="text-xs text-muted-foreground">Languages</div>
          </div>
        </div>

        <Button
          onClick={handleLoadData}
          disabled={loading}
          className="w-full relative overflow-hidden group"
          size="lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-20 transition-opacity" />
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Loading Demo Data...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Explore Demo Analytics
              <Sparkles className="w-4 h-4" />
            </div>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground leading-relaxed">
          This demo loads comprehensive analytics for user <strong>vijha742</strong> with
          realistic data patterns, beautiful visualizations, and interactive components.
        </p>
      </CardContent>
    </Card>
  );
}
