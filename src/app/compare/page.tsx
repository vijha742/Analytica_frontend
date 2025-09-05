"use client"

import { useState } from 'react'
import { compareUsers } from '@/lib/api-client'
import { GithubUser, UserComparisonResponse, CompResults } from '@/types/github'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Users, Trophy, GitBranch, Star, Users2, MessageSquare, GitCommit } from 'lucide-react'
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
                return <Trophy className="h-5 w-5 text-green-500" />
            case 'User 2':
                return <Trophy className="h-5 w-5 text-blue-500" />
            case 'Both are equal':
                return <Users2 className="h-5 w-5 text-yellow-500" />
            default:
                return null
        }
    }

    const getResultColor = (result: string) => {
        switch (result) {
            case 'User 1':
                return 'text-green-600 bg-green-50 border-green-200'
            case 'User 2':
                return 'text-blue-600 bg-blue-50 border-blue-200'
            case 'Both are equal':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200'
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200'
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
            <div className="container mx-auto py-8 space-y-6">
                <Header />
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">Compare Users</h1>
                    <p className="text-muted-foreground">
                        Compare two GitHub users side by side to see who performs better
                    </p>
                </div>

                {/* User Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User 1 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">User 1</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                placeholder="Enter GitHub username..."
                                value={user1Input}
                                onChange={(e) => setUser1Input(e.target.value)}
                            />
                        </CardContent>
                    </Card>

                    {/* User 2 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">User 2</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                placeholder="Enter GitHub username..."
                                value={user2Input}
                                onChange={(e) => setUser2Input(e.target.value)}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Compare Button */}
                <div className="text-center">
                    <Button
                        onClick={handleCompare}
                        disabled={!user1Input.trim() || !user2Input.trim() || loading}
                        size="lg"
                        className="w-full max-w-md"
                    >
                        {loading ? (
                            <>
                                <LoadingSpinner message="" size="sm" />
                                <span className="ml-2">Comparing...</span>
                            </>
                        ) : (
                            <>
                                <Users className="h-5 w-5 mr-2" />
                                Compare Users
                            </>
                        )}
                    </Button>
                </div>

                {/* Error */}
                {error && (
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="p-4">
                            <div className="text-center text-red-600">
                                <p className="font-medium">Error</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Comparison Results */}
                {comparisonResult && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-center">Comparison Results</h2>

                        {/* User Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={comparisonResult.user1.avatarUrl} alt={comparisonResult.user1.name} />
                                            <AvatarFallback>
                                                {comparisonResult.user1.name?.charAt(0) || comparisonResult.user1.githubUsername.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        {comparisonResult.user1.name || comparisonResult.user1.githubUsername}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Followers</span>
                                        <span className="font-medium">{formatNumber(comparisonResult.user1.followersCount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Repositories</span>
                                        <span className="font-medium">{comparisonResult.user1.publicReposCount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Contributions</span>
                                        <span className="font-medium">{formatNumber(comparisonResult.user1.totalContributions)}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={comparisonResult.user2.avatarUrl} alt={comparisonResult.user2.name} />
                                            <AvatarFallback>
                                                {comparisonResult.user2.name?.charAt(0) || comparisonResult.user2.githubUsername.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        {comparisonResult.user2.name || comparisonResult.user2.githubUsername}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Followers</span>
                                        <span className="font-medium">{formatNumber(comparisonResult.user2.followersCount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Repositories</span>
                                        <span className="font-medium">{comparisonResult.user2.publicReposCount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Contributions</span>
                                        <span className="font-medium">{formatNumber(comparisonResult.user2.totalContributions)}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Detailed Comparison */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Head-to-Head Comparison</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        { key: 'followersResult', label: 'Followers', icon: Users },
                                        { key: 'publicReposResult', label: 'Public Repositories', icon: Star },
                                        { key: 'totalContributionsResult', label: 'Total Contributions', icon: GitBranch },
                                        { key: 'pullRequestsResult', label: 'Pull Requests', icon: GitBranch },
                                        { key: 'issuesResult', label: 'Issues', icon: MessageSquare },
                                        { key: 'commitsResult', label: 'Commits', icon: GitCommit },
                                    ].map(({ key, label, icon: Icon }) => {
                                        const result = comparisonResult.results[key as keyof CompResults]
                                        return (
                                            <div key={key} className="flex items-center justify-between p-4 border rounded-md">
                                                <div className="flex items-center gap-3">
                                                    <Icon className="h-5 w-5 text-muted-foreground" />
                                                    <span className="font-medium">{label}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {getResultIcon(result)}
                                                    <Badge className={getResultColor(result)}>
                                                        {result}
                                                    </Badge>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AuthGuard>
    )
}
