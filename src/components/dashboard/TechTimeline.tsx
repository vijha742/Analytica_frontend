import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Clock } from 'lucide-react';

interface TechnologyUsage {
    name: string;
    firstUsed: string;
    lastUsed: string;
    frequency: number;
    projectCount: number;
}

interface TechTimelineProps {
    technologyUsageList: TechnologyUsage[];
}

export function TechTimeline({ technologyUsageList }: TechTimelineProps) {
    // Sort technologies by first used date
    const sortedTechs = [...technologyUsageList].sort((a, b) =>
        new Date(a.firstUsed).getTime() - new Date(b.firstUsed).getTime()
    );

    // Group technologies by year
    const techByYear = sortedTechs.reduce((acc, tech) => {
        const year = new Date(tech.firstUsed).getFullYear();
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(tech);
        return acc;
    }, {} as Record<number, TechnologyUsage[]>);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        });
    };

    const getProjectCountColor = (count: number) => {
        if (count >= 10) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        if (count >= 5) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        if (count >= 2) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Technology Learning Timeline
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Your journey learning new technologies over time
                </p>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {Object.entries(techByYear)
                        .sort(([a], [b]) => parseInt(b) - parseInt(a))
                        .map(([year, techs]) => (
                            <div key={year} className="relative">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border-2 border-primary">
                                        <Calendar className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">{year}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {techs.length} new {techs.length === 1 ? 'technology' : 'technologies'}
                                        </p>
                                    </div>
                                </div>

                                <div className="ml-6 pl-6 border-l border-border space-y-3">
                                    {techs.map((tech) => (
                                        <div
                                            key={tech.name}
                                            className="relative bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="absolute -left-9 top-6 w-3 h-3 bg-primary rounded-full border-2 border-background"></div>

                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h4 className="font-medium text-foreground">{tech.name}</h4>
                                                        <Badge
                                                            variant="secondary"
                                                            className={getProjectCountColor(tech.projectCount)}
                                                        >
                                                            {tech.projectCount} {tech.projectCount === 1 ? 'project' : 'projects'}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            Started: {formatDate(tech.firstUsed)}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            Last used: {formatDate(tech.lastUsed)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>

                {sortedTechs.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No technology timeline data available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
