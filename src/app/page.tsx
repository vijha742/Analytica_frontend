'use client';

import { useState, useEffect } from 'react';
import { fetchUser, searchUsers, getSuggestedUsers, suggestUser } from '@/lib/api';
import UserCard from '@/components/UserCard';
import { GithubUser } from '@/types/github';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<GithubUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<GithubUser | null>(null);
  const [suggestedUsers, setSuggestedUsers] = useState<GithubUser[]>([]);
  const [suggestUsername, setSuggestUsername] = useState('');
  const [suggestedBy, setSuggestedBy] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSuggestedUsers();
  }, []);

  const loadSuggestedUsers = async () => {
    try {
      const users = await getSuggestedUsers();
      setSuggestedUsers(users);
    } catch (err) {
      setError('Failed to load suggested users');
    }
  };

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
    } catch (err) {
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
      await loadSuggestedUsers();
    } catch (err) {
      setError('Failed to suggest user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            GitHub Analytics
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Track and analyze GitHub activity of your peers
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for peers..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Suggest User Form */}
        <form onSubmit={handleSuggestUser} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={suggestUsername}
              onChange={(e) => setSuggestUsername(e.target.value)}
              placeholder="GitHub username to suggest..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              value={suggestedBy}
              onChange={(e) => setSuggestedBy(e.target.value)}
              placeholder="Your name..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            >
              Suggest User
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-8 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
            {error}
          </div>
        )}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Results */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Search Results</h2>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserSelect(user.githubUsername)}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    {user.avatarUrl && (
                      <img
                        src={user.avatarUrl}
                        alt={`${user.name}'s avatar`}
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">@{user.githubUsername}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected User Details */}
          <div className="lg:col-span-2">
            {selectedUser ? (
              <UserCard user={selectedUser} />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Select a user to view their details
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Suggested Users Section */}
        {suggestedUsers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Suggested Users</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedUsers.map((user) => (
                <div key={user.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3">
                  <UserCard user={user} />
                </div>
              ))}
            </div>
          </div>
        )}

        
      </div>
    </main>
  );
}
