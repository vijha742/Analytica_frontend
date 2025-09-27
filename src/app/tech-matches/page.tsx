'use client';

import { useSupplementingUsers } from '@/hooks/useSupplementingUsers';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Progress } from '@/components/ui/progress';
import { Users, Code, GitBranch, Star, UserCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Header from '@/components/ui/Header';

export default function TechMatchesPage() {
    const { matches, loading, error, isUsingMockData, refetch, otherMatches } = useSupplementingUsers();

    const formatMatchScore = (score: number) => {
        return Math.round(score * 100);
    };

    const getMatchScoreColor = (score: number) => {
        const percentage = score * 100;
        if (percentage >= 90) return 'bg-green-500';
        if (percentage >= 70) return 'bg-blue-500';
        if (percentage >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getProficiencyColor = (level: string) => {
        switch (level.toLowerCase()) {
            case 'expert':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'advanced':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'intermediate':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'beginner':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatYearsExperience = (years: number) => {
        if (years < 1) {
            return `${Math.round(years * 12)} months`;
        }
        return `${years.toFixed(1)} years`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner message="Finding your tech stack matches..." />
            </div>
        );
    }

    const currentUserMatch = matches[0];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <Header />
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Tech Stack Matches
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Discover developers with similar technical skills and interests
                            </p>
                        </div>
                        <Button
                            onClick={refetch}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </Button>
                    </div>

                    {/* Status Banner */}
                    {isUsingMockData && (
                        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                                <AlertCircle className="w-5 h-5" />
                                <span className="font-medium">Sample Data</span>
                            </div>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                Currently showing sample data. {error || 'API service may be temporarily unavailable.'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Current User Profile */}
                {currentUserMatch && (
                    <Card className="mb-8 border-2 border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Avatar className="w-16 h-16">
                                    <Image
                                        width={64}
                                        height={64}
                                        src={currentUserMatch.matchedUser.avatarUrl}
                                        alt={currentUserMatch.matchedUser.name}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-xl font-semibold">{currentUserMatch.matchedUser.name}</h2>
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                            <UserCheck className="w-3 h-3 mr-1" />
                                            You ({formatMatchScore(currentUserMatch.matchScore)}% match)
                                        </Badge>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        @{currentUserMatch.matchedUser.githubUsername}
                                    </p>
                                    {currentUserMatch.matchedUser.bio && (
                                        <p className="text-gray-700 dark:text-gray-300 mt-2">
                                            {currentUserMatch.matchedUser.bio}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {currentUserMatch.matchedUser.followersCount} followers
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <GitBranch className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {currentUserMatch.matchedUser.publicReposCount} repositories
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {currentUserMatch.matchedUser.totalContributions} contributions
                                    </span>
                                </div>
                            </div>

                            {/* Current User's Tech Stack */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <Code className="w-5 h-5" />
                                    Your Tech Stack
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {currentUserMatch.matchedUser.technicalProfile.primaryLanguages
                                        .slice(0, 6)
                                        .map((lang, index) => (
                                            <div
                                                key={index}
                                                className="bg-white dark:bg-gray-800 p-3 rounded-lg border"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-medium text-sm">{lang.language}</h4>
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-xs ${getProficiencyColor(lang.proficiencyLevel)}`}
                                                    >
                                                        {lang.proficiencyLevel}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                                    <div>Experience: {formatYearsExperience(lang.yearsOfExperience)}</div>
                                                    <div>Projects: {lang.projectCount}</div>
                                                    <div>Lines: {lang.linesOfCode.toLocaleString()}</div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Other Matches */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Similar Developers ({otherMatches.length})
                    </h2>

                    {otherMatches.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {otherMatches.map((match, index) => (
                                <Card key={match.matchedUser.id || index} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-12 h-12">
                                                    <img
                                                        src={match.matchedUser.avatarUrl}
                                                        alt={match.matchedUser.name}
                                                        className="w-full h-full object-cover rounded-full"
                                                    />
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-semibold">{match.matchedUser.name}</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        @{match.matchedUser.githubUsername}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className={`w-3 h-3 rounded-full ${getMatchScoreColor(match.matchScore)}`}></div>
                                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                        {formatMatchScore(match.matchScore)}%
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500">match</p>
                                                <Progress
                                                    value={formatMatchScore(match.matchScore)}
                                                    className="w-20 h-2 mt-1"
                                                />
                                            </div>
                                        </div>

                                        {match.matchedUser.bio && (
                                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                                                {match.matchedUser.bio}
                                            </p>
                                        )}
                                    </CardHeader>

                                    <CardContent>
                                        {/* Stats */}
                                        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                                            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                                <div className="text-lg font-semibold">{match.matchedUser.followersCount}</div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400">Followers</div>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                                <div className="text-lg font-semibold">{match.matchedUser.publicReposCount}</div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400">Repos</div>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                                <div className="text-lg font-semibold">{match.matchedUser.totalContributions}</div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400">Contributions</div>
                                            </div>
                                        </div>

                                        {/* Teams */}
                                        {match.matchedUser.teams && match.matchedUser.teams.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="text-sm font-medium mb-2">Teams</h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {match.matchedUser.teams.map((team, teamIndex) => (
                                                        <Badge key={teamIndex} variant="secondary" className="text-xs">
                                                            {team}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Top Languages */}
                                        <div>
                                            <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                                                <Code className="w-4 h-4" />
                                                Top Languages
                                            </h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {match.matchedUser.technicalProfile.primaryLanguages
                                                    .slice(0, 4)
                                                    .map((lang, langIndex) => (
                                                        <div
                                                            key={langIndex}
                                                            className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs"
                                                        >
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="font-medium">{lang.language}</span>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={`text-xs ${getProficiencyColor(lang.proficiencyLevel)}`}
                                                                >
                                                                    {lang.proficiencyLevel.slice(0, 3)}
                                                                </Badge>
                                                            </div>
                                                            <div className="text-gray-600 dark:text-gray-400">
                                                                {lang.projectCount} projects
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>

                                        {/* Technical Scores */}
                                        <div className="mt-4 pt-4 border-t">
                                            <div className="grid grid-cols-2 gap-4 text-xs">
                                                <div>
                                                    <div className="text-gray-600 dark:text-gray-400">Specialization</div>
                                                    <div className="font-semibold">
                                                        {(match.matchedUser.technicalProfile.specializationScore * 100).toFixed(0)}%
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-600 dark:text-gray-400">Versatility</div>
                                                    <div className="font-semibold">
                                                        {(match.matchedUser.technicalProfile.versatilityScore * 100).toFixed(0)}%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="text-center p-8">
                            <CardContent>
                                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    No Matches Found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    We couldn&apos;t find any developers with similar tech stacks.
                                    Check back later as more developers join the platform.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
