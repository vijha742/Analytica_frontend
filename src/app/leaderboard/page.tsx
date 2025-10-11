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
                return (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                        <Trophy className="h-5 w-5 text-white" />
                    </div>
                )
            case 2:
                return (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center shadow-lg">
                        <Medal className="h-5 w-5 text-white" />
                    </div>
                )
            case 3:
                return (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                        <Award className="h-5 w-5 text-white" />
                    </div>
                )
            default:
                return (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-sm font-bold text-white shadow-md">
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
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <Header />
                <main className="py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-center min-h-[400px]">
                            <LoadingSpinner />
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <Header />
                <main className="py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <Card className="max-w-md mx-auto bg-gray-800/90 backdrop-blur-sm border-gray-700">
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="text-red-400 mb-2 text-2xl">⚠️</div>
                                    <h3 className="text-lg font-semibold mb-2 text-white">Error Loading Leaderboard</h3>
                                    <p className="text-sm text-gray-300 mb-4">{error}</p>
                                    <button
                                        onClick={fetchLeaderboardData}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <Header />
                <main className="py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold text-white mb-4">🏆 Leaderboard</h1>
                            <p className="text-lg text-gray-300">
                                Top developers ranked by contributions and activity
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div className="flex items-center gap-3 bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
                                <label htmlFor="scope-select" className="text-sm font-medium text-gray-300">
                                    Scope:
                                </label>
                                <Select value={scope} onValueChange={setScope}>
                                    <SelectTrigger className="w-36 bg-gray-700 border-gray-600 text-white">
                                        <SelectValue placeholder="Select scope" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-700">
                                        <SelectItem value="global" className="text-white hover:bg-gray-700">Global</SelectItem>
                                        <SelectItem value="local" className="text-white hover:bg-gray-700">Local</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700 hover:bg-gray-800 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/20 rounded-lg">
                                            <Users className="h-6 w-6 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Total Users</p>
                                            <p className="text-2xl font-bold text-white">{users.length}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700 hover:bg-gray-800 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-500/20 rounded-lg">
                                            <GitBranch className="h-6 w-6 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Total Contributions</p>
                                            <p className="text-2xl font-bold text-white">
                                                {formatNumber(users.reduce((sum, user) => sum + user.totalContributions, 0))}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700 hover:bg-gray-800 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                                            <Star className="h-6 w-6 text-yellow-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Scope</p>
                                            <p className="text-2xl font-bold text-white capitalize">{scope}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Leaderboard */}
                        <div className="space-y-6">
                            {users.length === 0 ? (
                                <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700">
                                    <CardContent className="p-8">
                                        <div className="text-center">
                                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold mb-2 text-white">No Users Found</h3>
                                            <p className="text-sm text-gray-400">
                                                No users found for the selected scope. Try changing the scope or check back later.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                users.map((user, index) => (
                                    <Card key={user.id || user.githubUsername} className="bg-gray-800/90 backdrop-blur-sm border-gray-700 hover:bg-gray-800 transition-all hover:shadow-lg hover:shadow-blue-500/10">
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-4">
                                                {/* Rank */}
                                                <div className="flex-shrink-0">
                                                    {getRankIcon(index + 1)}
                                                </div>

                                                {/* Avatar */}
                                                <Avatar className="h-14 w-14 ring-2 ring-gray-600">
                                                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                                                    <AvatarFallback className="bg-gray-700 text-white">
                                                        {user.name?.charAt(0) || user.githubUsername.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>

                                                {/* User Info */}
                                                <div className="flex-grow min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold truncate text-white text-lg">{user.name || user.githubUsername}</h3>
                                                        {user.team && (
                                                            <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30">
                                                                {user.team}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-blue-400 font-medium">@{user.githubUsername}</p>
                                                    {user.bio && (
                                                        <p className="text-sm text-gray-300 mt-2 line-clamp-2">{user.bio}</p>
                                                    )}
                                                </div>

                                                {/* Stats */}
                                                <div className="flex flex-col sm:flex-row gap-6 text-center">
                                                    <div className="text-center">
                                                        <p className="text-xs text-gray-400 mb-1">Contributions</p>
                                                        <p className="text-lg font-bold text-white">{formatNumber(user.totalContributions)}</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-xs text-gray-400 mb-1">Repositories</p>
                                                        <p className="text-lg font-bold text-white">{user.publicReposCount}</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-xs text-gray-400 mb-1">Followers</p>
                                                        <p className="text-lg font-bold text-white">{formatNumber(user.followersCount)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Primary Languages */}
                                            {user.technicalProfile?.primaryLanguages && user.technicalProfile.primaryLanguages.length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-gray-700">
                                                    <p className="text-sm text-gray-400 mb-3">Top Languages</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {user.technicalProfile.primaryLanguages.slice(0, 5).map((lang, langIndex) => (
                                                            <Badge key={langIndex} variant="outline" className="text-xs bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-gray-600">
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
                </main>
            </div>
        </AuthGuard>
    )
}
