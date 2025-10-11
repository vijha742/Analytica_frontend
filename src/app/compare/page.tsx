"use client"

import { useState } from 'react'
import { compareUsers } from '@/lib/api-client'
import { UserComparisonResponse, CompResults } from '@/types/github'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Separator } from '@/components/ui/separator'
import {
    Users, Trophy, Star, Users2, MessageSquare, GitCommit,
    Crown, Zap, Target, TrendingUp, Heart, GitPullRequest,
    AlertCircle, CheckCircle, Award, Activity
} from 'lucide-react'
import AuthGuard from '@/components/AuthGuard'
import Header from '@/components/ui/Header'

export default function ComparePage() {
    const [user1Input, setUser1Input] = useState('')
    const [user2Input, setUser2Input] = useState('')
    const [comparisonResult, setComparisonResult] = useState<UserComparisonResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleCompare = async () => {
        if (!user1Input.trim() || !user2Input.trim()) {
            setError('Please enter both usernames to compare')
            return
        }

        try {
            setLoading(true)
            setError(null)
            const result = await compareUsers(user1Input.trim(), user2Input.trim())
            setComparisonResult(result)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to compare users')
        } finally {
            setLoading(false)
        }
    }

    const getResultIcon = (result: string) => {
        switch (result) {
            case 'User 1':
                return <Trophy className="h-5 w-5 text-emerald-500" />
            case 'User 2':
                return <Trophy className="h-5 w-5 text-blue-500" />
            case 'Both are equal':
                return <Users2 className="h-5 w-5 text-amber-500" />
            default:
                return null
        }
    }

    const getResultColor = (result: string) => {
        switch (result) {
            case 'User 1':
                return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950 dark:border-emerald-800'
            case 'User 2':
                return 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-800'
            case 'Both are equal':
                return 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950 dark:border-amber-800'
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-900 dark:border-gray-700'
        }
    }

    const calculateOverallWinner = (results: CompResults): { winner: string; score: number; breakdown: { user1: number; user2: number; ties: number } } => {
        let user1Wins = 0
        let user2Wins = 0
        let ties = 0

        Object.values(results).forEach(result => {
            if (result === 'User 1') user1Wins++
            else if (result === 'User 2') user2Wins++
            else if (result === 'Both are equal') ties++
        })

        const totalComparisons = user1Wins + user2Wins + ties
        let winner: string
        let score: number

        if (user1Wins > user2Wins) {
            winner = 'User 1'
            score = Math.round((user1Wins / totalComparisons) * 100)
        } else if (user2Wins > user1Wins) {
            winner = 'User 2'
            score = Math.round((user2Wins / totalComparisons) * 100)
        } else {
            winner = 'It\'s a tie!'
            score = Math.round((ties / totalComparisons) * 100)
        }

        return {
            winner,
            score,
            breakdown: { user1: user1Wins, user2: user2Wins, ties }
        }
    }

    const getWinnerGradient = (winner: string) => {
        switch (winner) {
            case 'User 1':
                return 'bg-gradient-to-r from-emerald-500 to-teal-600'
            case 'User 2':
                return 'bg-gradient-to-r from-blue-500 to-cyan-600'
            default:
                return 'bg-gradient-to-r from-amber-500 to-orange-600'
        }
    }

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M'
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K'
        }
        return num.toString()
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
                <Header />
                <div className="container mx-auto py-8 px-4 space-y-8">
                    {/* Hero Section */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-500/10 dark:to-purple-500/10 border border-blue-300 dark:border-blue-800/50">
                            <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Developer Comparison Tool</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                            Compare Developers
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Analyze and compare two GitHub developers across multiple metrics to see who excels in different areas
                        </p>
                    </div>

                    {/* User Selection Cards */}
                    <div className="relative flex gap-6 max-w-4xl mx-auto justify-center items-start lg:items-center flex-col lg:flex-row">
                        {/* User 1 Input */}
                        <Card className="relative w-full md:w-[20vw] overflow-hidden border-2 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 group">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <CardHeader className="relative">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900">
                                        <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-emerald-700 dark:bg-gradient-to-r dark:from-emerald-600 dark:to-teal-600 dark:bg-clip-text dark:text-transparent">
                                            Developer 1
                                        </span>
                                        <p className="text-sm font-normal text-muted-foreground mt-1">
                                            Enter the first GitHub username
                                        </p>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">GitHub Username</label>
                                    <Input
                                        placeholder="e.g., octocat"
                                        value={user1Input}
                                        onChange={(e) => setUser1Input(e.target.value)}
                                        className="h-12 text-lg border-2 focus:border-emerald-300 dark:focus:border-emerald-600"
                                    />
                                </div>
                                {user1Input.trim() && (
                                    <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle className="h-4 w-4" />
                                        Ready to compare
                                    </div>
                                )}
                            </CardContent>
                        </Card>



                        <div className='flex justify-center w-full md:w-[2vw] text-3xl font-bold'>VS</div>

                        {/* User 2 Input */}
                        <Card className="relative w-full md:w-[20vw]  overflow-hidden border-2 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <CardHeader className="relative">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                                        <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-blue-700 dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-600 dark:bg-clip-text dark:text-transparent">
                                            Developer 2
                                        </span>
                                        <p className="text-sm font-normal text-muted-foreground mt-1">
                                            Enter the second GitHub username
                                        </p>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">GitHub Username</label>
                                    <Input
                                        placeholder="e.g., torvalds"
                                        value={user2Input}
                                        onChange={(e) => setUser2Input(e.target.value)}
                                        className="h-12 text-lg border-2 focus:border-blue-300 dark:focus:border-blue-600"
                                    />
                                </div>
                                {user2Input.trim() && (
                                    <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                                        <CheckCircle className="h-4 w-4" />
                                        Ready to compare
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* VS Divider for Desktop */}


                    {/* Compare Button */}
                    <div className="text-center">
                        <Button
                            onClick={handleCompare}
                            disabled={!user1Input.trim() || !user2Input.trim() || loading}
                            size="lg"
                            className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner message="" size="sm" />
                                    <span className="ml-3">Analyzing developers...</span>
                                </>
                            ) : (
                                <>
                                    <Target className="h-6 w-6 mr-3" />
                                    Compare Developers
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Error State */}
                    {error && (
                        <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50 max-w-2xl mx-auto">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
                                    <AlertCircle className="h-6 w-6 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">Comparison Failed</p>
                                        <p className="text-sm mt-1">{error}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Comparison Results */}
                    {comparisonResult && (
                        <div className="space-y-8">
                            {/* Overall Winner Section */}
                            {(() => {
                                const overallResult = calculateOverallWinner(comparisonResult.results)
                                return (
                                    <Card className={`relative overflow-hidden border-2 ${getWinnerGradient(overallResult.winner)} p-1`}>
                                        <div className="bg-background rounded-lg p-8 text-center">
                                            <div className="flex items-center justify-center gap-3 mb-4">
                                                <Crown className="h-8 w-8 text-amber-500" />
                                                <h2 className="text-3xl font-bold">Overall Winner</h2>
                                                <Crown className="h-8 w-8 text-amber-500" />
                                            </div>
                                            <div className="space-y-4">
                                                <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xl font-bold ${getWinnerGradient(overallResult.winner)} text-white shadow-lg`}>
                                                    {overallResult.winner === 'User 1' && (
                                                        <>
                                                            <Trophy className="h-6 w-6" />
                                                            {comparisonResult.user1.name || comparisonResult.user1.githubUsername}
                                                        </>
                                                    )}
                                                    {overallResult.winner === 'User 2' && (
                                                        <>
                                                            <Trophy className="h-6 w-6" />
                                                            {comparisonResult.user2.name || comparisonResult.user2.githubUsername}
                                                        </>
                                                    )}
                                                    {overallResult.winner === 'It\'s a tie!' && (
                                                        <>
                                                            <Users2 className="h-6 w-6" />
                                                            It&apos;s a Perfect Tie!
                                                        </>
                                                    )}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    <div className="flex items-center justify-center gap-6 mt-3">
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                                            <span>{overallResult.breakdown.user1} wins</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                                            <span>{overallResult.breakdown.user2} wins</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                                            <span>{overallResult.breakdown.ties} ties</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                )
                            })()}

                            {/* Developer Profiles */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* User 1 Profile */}
                                <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/50 dark:to-teal-950/50">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-16 w-16 border-4 border-emerald-300 dark:border-emerald-600">
                                                <AvatarImage src={comparisonResult.user1.avatarUrl} alt={comparisonResult.user1.name} />
                                                <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-lg font-bold">
                                                    {comparisonResult.user1.name?.charAt(0) || comparisonResult.user1.githubUsername.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                                                    {comparisonResult.user1.name || comparisonResult.user1.githubUsername}
                                                </h3>
                                                <p className="text-emerald-600 dark:text-emerald-400">@{comparisonResult.user1.githubUsername}</p>
                                                {comparisonResult.user1.bio && (
                                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{comparisonResult.user1.bio}</p>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="bg-background/50 rounded-lg p-3 text-center">
                                                <Heart className="h-5 w-5 mx-auto mb-1 text-emerald-600" />
                                                <div className="text-lg font-bold">{formatNumber(comparisonResult.user1.followersCount)}</div>
                                                <div className="text-xs text-muted-foreground">Followers</div>
                                            </div>
                                            <div className="bg-background/50 rounded-lg p-3 text-center">
                                                <Star className="h-5 w-5 mx-auto mb-1 text-emerald-600" />
                                                <div className="text-lg font-bold">{comparisonResult.user1.publicReposCount}</div>
                                                <div className="text-xs text-muted-foreground">Repositories</div>
                                            </div>
                                            <div className="bg-background/50 rounded-lg p-3 text-center">
                                                <Activity className="h-5 w-5 mx-auto mb-1 text-emerald-600" />
                                                <div className="text-lg font-bold">{formatNumber(comparisonResult.user1.totalContributions)}</div>
                                                <div className="text-xs text-muted-foreground">Contributions</div>
                                            </div>
                                            <div className="bg-background/50 rounded-lg p-3 text-center">
                                                <Users className="h-5 w-5 mx-auto mb-1 text-emerald-600" />
                                                <div className="text-lg font-bold">{formatNumber(comparisonResult.user1.followingCount)}</div>
                                                <div className="text-xs text-muted-foreground">Following</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* User 2 Profile */}
                                <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/50 dark:to-cyan-950/50">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-16 w-16 border-4 border-blue-300 dark:border-blue-600">
                                                <AvatarImage src={comparisonResult.user2.avatarUrl} alt={comparisonResult.user2.name} />
                                                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-lg font-bold">
                                                    {comparisonResult.user2.name?.charAt(0) || comparisonResult.user2.githubUsername.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300">
                                                    {comparisonResult.user2.name || comparisonResult.user2.githubUsername}
                                                </h3>
                                                <p className="text-blue-600 dark:text-blue-400">@{comparisonResult.user2.githubUsername}</p>
                                                {comparisonResult.user2.bio && (
                                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{comparisonResult.user2.bio}</p>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="bg-background/50 rounded-lg p-3 text-center">
                                                <Heart className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                                                <div className="text-lg font-bold">{formatNumber(comparisonResult.user2.followersCount)}</div>
                                                <div className="text-xs text-muted-foreground">Followers</div>
                                            </div>
                                            <div className="bg-background/50 rounded-lg p-3 text-center">
                                                <Star className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                                                <div className="text-lg font-bold">{comparisonResult.user2.publicReposCount}</div>
                                                <div className="text-xs text-muted-foreground">Repositories</div>
                                            </div>
                                            <div className="bg-background/50 rounded-lg p-3 text-center">
                                                <Activity className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                                                <div className="text-lg font-bold">{formatNumber(comparisonResult.user2.totalContributions)}</div>
                                                <div className="text-xs text-muted-foreground">Contributions</div>
                                            </div>
                                            <div className="bg-background/50 rounded-lg p-3 text-center">
                                                <Users className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                                                <div className="text-lg font-bold">{formatNumber(comparisonResult.user2.followingCount)}</div>
                                                <div className="text-xs text-muted-foreground">Following</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Detailed Head-to-Head Comparison */}
                            <Card className="border-2 border-purple-200 dark:border-purple-800">
                                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
                                    <CardTitle className="flex items-center gap-3 text-2xl">
                                        <Award className="h-7 w-7 text-purple-600" />
                                        <span className="font-bold text-purple-700 dark:bg-gradient-to-r dark:from-purple-600 dark:to-pink-600 dark:bg-clip-text dark:text-transparent">
                                            Head-to-Head Analysis
                                        </span>
                                    </CardTitle>
                                    <p className="text-muted-foreground">Detailed comparison across key development metrics</p>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        {[
                                            { key: 'followersResult', label: 'Community Following', icon: Heart, description: 'Number of followers on GitHub' },
                                            { key: 'publicReposResult', label: 'Repository Portfolio', icon: Star, description: 'Total public repositories' },
                                            { key: 'totalContributionsResult', label: 'Overall Activity', icon: Activity, description: 'Total contributions across all repositories' },
                                            { key: 'pullRequestsResult', label: 'Pull Requests', icon: GitPullRequest, description: 'Pull requests created and merged' },
                                            { key: 'issuesResult', label: 'Issue Management', icon: MessageSquare, description: 'Issues opened and resolved' },
                                            { key: 'commitsResult', label: 'Code Commits', icon: GitCommit, description: 'Total commits across repositories' },
                                        ].map(({ key, label, icon: Icon, description }, index) => {
                                            const result = comparisonResult.results[key as keyof CompResults]
                                            return (
                                                <div key={key} className="group">
                                                    <div className="flex items-center justify-between p-6 border-2 rounded-xl hover:border-purple-200 dark:hover:border-purple-700 transition-all duration-200 hover:shadow-md">
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 group-hover:scale-110 transition-transform duration-200">
                                                                <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-lg">{label}</h4>
                                                                <p className="text-sm text-muted-foreground">{description}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {getResultIcon(result)}
                                                            <Badge className={`${getResultColor(result)} font-semibold px-4 py-2 text-sm`}>
                                                                {result}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    {index < 5 && <Separator className="my-4" />}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Technical Insights */}
                            <Card className="border-2 border-indigo-200 dark:border-indigo-800">
                                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50">
                                    <CardTitle className="flex items-center gap-3 text-2xl">
                                        <TrendingUp className="h-7 w-7 text-indigo-600" />
                                        <span className="font-bold text-indigo-700 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-blue-600 dark:bg-clip-text dark:text-transparent">
                                            Technical Insights
                                        </span>
                                    </CardTitle>
                                    <p className="text-muted-foreground">Additional developer profile information</p>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-lg text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                                                {comparisonResult.user1.name || comparisonResult.user1.githubUsername}
                                            </h4>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Primary Languages:</span>
                                                    <span className="font-medium">
                                                        {comparisonResult.user1.technicalProfile?.primaryLanguages?.slice(0, 2).map(lang => lang.language).join(', ') || 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Specialization Score:</span>
                                                    <span className="font-medium">
                                                        {comparisonResult.user1.technicalProfile?.specializationScore ?
                                                            `${comparisonResult.user1.technicalProfile.specializationScore * 10}/10` : 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Versatility Score:</span>
                                                    <span className="font-medium">
                                                        {comparisonResult.user1.technicalProfile?.versatilityScore ?
                                                            `${comparisonResult.user1.technicalProfile.versatilityScore * 10}/10` : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-lg text-blue-700 dark:text-blue-300 flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                                                {comparisonResult.user2.name || comparisonResult.user2.githubUsername}
                                            </h4>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Primary Languages:</span>
                                                    <span className="font-medium">
                                                        {comparisonResult.user2.technicalProfile?.primaryLanguages?.slice(0, 2).map(lang => lang.language).join(', ') || 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Specialization Score:</span>
                                                    <span className="font-medium">
                                                        {comparisonResult.user2.technicalProfile?.specializationScore ?
                                                            `${comparisonResult.user2.technicalProfile.specializationScore * 10}/10` : 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Versatility Score:</span>
                                                    <span className="font-medium">
                                                        {comparisonResult.user2.technicalProfile?.versatilityScore ?
                                                            `${comparisonResult.user2.technicalProfile.versatilityScore * 10}/10` : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </AuthGuard>
    )
}
