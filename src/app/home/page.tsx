'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState, useEffect } from 'react';
import { fetchUser, searchUsers, getSuggestedUsers, suggestUser } from '@/lib/api';
import UserCard from '@/components/UserCard';
import { GithubUser } from '@/types/github';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useSuggestedUsers } from '@/components/DataFetcher';
import Image from 'next/image';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<GithubUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<GithubUser | null>(null);
  const [suggestUsername, setSuggestUsername] = useState('');
  const [suggestedBy, setSuggestedBy] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshingUsers, setRefreshingUsers] = useState<Record<string, boolean>>({});
  
  const { users: suggestedUsers, isLoading: isInitialLoading } = useSuggestedUsers();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!searchQuery.trim()) {
        setError('Please enter a search query');
        return;
      }
      const searchResults = await searchUsers(searchQuery);
      setUsers(searchResults);
      if (searchResults.length === 0) {
        setError('No users found matching your search');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = async (username: string) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await fetchUser(username);
      setSelectedUser(userData);
    } catch {
      setError('Failed to fetch user data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await suggestUser(suggestUsername, suggestedBy);
      setSuggestUsername('');
      setSuggestedBy('');
    } catch {
      setError('Failed to suggest user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserRefresh = (username: string, refreshedUser: GithubUser) => {
    if (selectedUser && selectedUser.githubUsername === username) {
      setSelectedUser(refreshedUser);
    }
    setRefreshingUsers(prev => ({
      ...prev,
      [username]: false
    }));
  };

  // Skeleton subcomponents
  const UserCardHeaderSkeleton = () => (
    <div className="flex items-center space-x-4">
      <Skeleton className="w-16 h-16 rounded-full shrink-0" />
      <div className="flex-1 min-w-0 space-y-1">
        <Skeleton className="h-5 w-3/5" /> {/* Name */}
        <Skeleton className="h-4 w-2/5" /> {/* Username */}
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-28 rounded-md" /> {/* View Profile */}
        <Skeleton className="h-8 w-28 rounded-md" /> {/* Refresh */}
      </div>
    </div>
  );

  const UserBioSkeleton = () => (
    <div className="space-y-1">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  );

  const UserStatsSkeleton = () => (
    <div className="grid grid-cols-4 gap-2 bg-white/70 dark:bg-gray-800/70 rounded-lg p-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center space-y-1">
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="h-4 w-6" />
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  );

  const UserTechStackSkeleton = () => (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-5 w-20 rounded-full" />
      ))}
    </div>
  );

  const UserLatestRepoSkeleton = () => (
    <div className="mt-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 space-y-1.5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-4 w-32" /> {/* Repo name */}
      <Skeleton className="h-5 w-20 rounded-full" /> {/* Language badge */}
      <Skeleton className="h-3 w-full" /> {/* Description */}
      <Skeleton className="h-3 w-4/5" />
    </div>
  );

  const UserCardFooterSkeleton = () => (
    <div className="flex gap-2 mt-2">
      <Skeleton className="h-10 w-1/2 rounded-lg" />
      <Skeleton className="h-10 w-1/2 rounded-lg" />
    </div>
  );

  const UserCardSkeleton = () => (
    <div className="space-y-4 max-w-xl mx-auto bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-800 flex flex-col relative transition-colors animate-pulse">
      <UserCardHeaderSkeleton />
      <UserBioSkeleton />
      <UserStatsSkeleton />
      <UserTechStackSkeleton />
      <UserLatestRepoSkeleton />
      <UserCardFooterSkeleton />
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">GitHub Analytics</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Track and analyze GitHub activity of your peers
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for peers..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <Button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
              {loading ? 'Loading...' : 'Search'}
            </Button>
          </div>
        </form>

        <form onSubmit={handleSuggestUser} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              value={suggestUsername}
              onChange={(e) => setSuggestUsername(e.target.value)}
              placeholder="GitHub username to suggest..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <Input
              type="text"
              value={suggestedBy}
              onChange={(e) => setSuggestedBy(e.target.value)}
              placeholder="Your name..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <Button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50">
              Suggest User
            </Button>
          </div>
        </form>

        {error && (
          <div className="mb-8 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading
                ? Array.from({ length: 12 }).map((_, idx) => <UserCardSkeleton key={idx} />)
                : users.length > 0
                  ? users.slice(0, 12).map((user) => (
                      <div key={user.id}>
                        <div
                          onClick={() => handleUserSelect(user.githubUsername)}
                          className="cursor-pointer hover:shadow-lg transition-shadow"
                        >
                          <UserCard user={user} />
                        </div>
                      </div>
                    ))
                  : null}
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedUser ? (
              <UserCard 
                user={selectedUser} 
                onRefresh={(refreshedUser) => handleUserRefresh(selectedUser.githubUsername, refreshedUser)}
                isRefreshing={refreshingUsers[selectedUser.githubUsername]}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Select a user to view their details
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="my-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Suggested Users</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isInitialLoading ? (
              Array.from({ length: 12 }).map((_, index) => (
                <UserCardSkeleton key={index} />
              ))
            ) : (
              suggestedUsers.slice(0, 12).map((user) => (
                <div key={user.id}>
                  <UserCard 
                    user={user} 
                    onRefresh={(refreshedUser) => handleUserRefresh(user.githubUsername, refreshedUser)}
                    isRefreshing={refreshingUsers[user.githubUsername]}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 