"use client"

import { useState, useEffect, useCallback } from 'react'
import { getLeaderboard } from '@/lib/api-client'
import { GithubUser } from '@/types/github'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Trophy, Medal, Award, Users, GitBranch, Star } from 'lucide-react'
import AuthGuard from '@/components/AuthGuard'
import Header from '@/components/ui/Header'

// interface LeaderboardProps {unknown}

export default function LeaderboardPage() {
    const [users, setUsers] = useState<GithubUser[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [scope, setScope] = useState<string>('global')

    const fetchLeaderboardData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await getLeaderboard(scope)
            setUsers(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard')
        } finally {
            setLoading(false)
        }
    }, [scope])

    useEffect(() => {
        fetchLeaderboardData()
    }, [fetchLeaderboardData])

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Trophy className="h-6 w-6 text-yellow-500" />
            case 2:
                return <Medal className="h-6 w-6 text-gray-400" />
            case 3:
                return <Award className="h-6 w-6 text-orange-500" />
            default:
                return (
                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                        {rank}
                    </div>
                )
        }
    }

    const formatNumber = (num: number) => {
        if (num != null) {
            console.log(num)
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M'
            }
            if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'K'
            }
            return num.toString()
        }
        else return '0'
    }

    if (loading) {
        return (
            <div className="container mx-auto py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <LoadingSpinner />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto py-8">
                <Card className="max-w-md mx-auto">
                    <CardContent className="p-6">
                        <div className="text-center">
                            <div className="text-red-500 mb-2">⚠️</div>
                            <h3 className="text-lg font-semibold mb-2">Error Loading Leaderboard</h3>
                            <p className="text-sm text-muted-foreground mb-4">{error}</p>
                            <button
                                onClick={fetchLeaderboardData}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                            >
                                Try Again
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <AuthGuard>
            <Header />
            <div className="container mx-auto py-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Leaderboard</h1>
                        <p className="text-muted-foreground">
                            Top developers ranked by contributions and activity
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="scope-select" className="text-sm font-medium">
                            Scope:
                        </label>
                        <Select value={scope} onValueChange={setScope}>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Select scope" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="global">Global</SelectItem>
                                <SelectItem value="local">Local</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Users</p>
                                    <p className="text-lg font-semibold">{users.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <GitBranch className="h-5 w-5 text-green-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Contributions</p>
                                    <p className="text-lg font-semibold">
                                        {formatNumber(users.reduce((sum, user) => sum + user.totalContributions, 0))}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Scope</p>
                                    <p className="text-lg font-semibold capitalize">{scope}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Leaderboard */}
                <div className="space-y-4">
                    {users.length === 0 ? (
                        <Card>
                            <CardContent className="p-8">
                                <div className="text-center">
                                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
                                    <p className="text-sm text-muted-foreground">
                                        No users found for the selected scope. Try changing the scope or check back later.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        users.map((user, index) => (
                            <Card key={user.id || user.githubUsername} className="transition-all hover:shadow-md">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        {/* Rank */}
                                        <div className="flex-shrink-0">
                                            {getRankIcon(index + 1)}
                                        </div>

                                        {/* Avatar */}
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                                            <AvatarFallback>
                                                {user.name?.charAt(0) || user.githubUsername.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>

                                        {/* User Info */}
                                        <div className="flex-grow min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold truncate">{user.name || user.githubUsername}</h3>
                                                {user.team && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {user.team}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">@{user.githubUsername}</p>
                                            {user.bio && (
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{user.bio}</p>
                                            )}
                                        </div>

                                        {/* Stats */}
                                        <div className="flex flex-col sm:flex-row gap-4 text-center">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Contributions</p>
                                                <p className="text-lg font-semibold">{formatNumber(user.totalContributions)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Repositories</p>
                                                <p className="text-lg font-semibold">{user.publicReposCount}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Followers</p>
                                                <p className="text-lg font-semibold">{formatNumber(user.followersCount)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Primary Languages */}
                                    {user.technicalProfile?.primaryLanguages && user.technicalProfile.primaryLanguages.length > 0 && (
                                        <div className="mt-4 pt-4 border-t">
                                            <p className="text-sm text-muted-foreground mb-2">Top Languages</p>
                                            <div className="flex flex-wrap gap-2">
                                                {user.technicalProfile.primaryLanguages.slice(0, 5).map((lang, langIndex) => (
                                                    <Badge key={langIndex} variant="outline" className="text-xs">
                                                        {lang.language}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </AuthGuard>

    )
}
