'use client';

import { useState } from 'react';
import { searchUsers, suggestUser } from '@/lib/api-client';
import UserCard, { UserCardSkeleton } from '@/components/UserCard';
import SimpleUserCard from '@/components/SimpleUserCard';
import { GithubUser } from '@/types/github';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSuggestedUsers } from '@/components/DataFetcher';

import Header from '@/components/ui/Header';


export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<GithubUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<GithubUser | null>(null);
  const [suggestUsername, setSuggestUsername] = useState('');
  const [suggestedBy, setSuggestedBy] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<'search' | 'suggested'>('search');
  const [showSearchSection, setShowSearchSection] = useState(false);

  // Use refetch from hook
  const { users: suggestedUsers, isLoading: isInitialLoading, refetch: refetchSuggestedUsers } = useSuggestedUsers();
  const [isRefetchingSuggested, setIsRefetchingSuggested] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError(null);
    setUsers([]);
    setShowSearchSection(true); // Clear previous results

    try {
      const searchResults = await searchUsers(searchQuery);

      if (!Array.isArray(searchResults)) {
        throw new Error('Invalid response from server');
      }

      setUsers(searchResults);

      if (searchResults.length === 0) {
        setError('No users found. Try a different search term.');
      } else {
        setShowSearchSection(true); // Show search section when results are found
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Unable to perform search. Please check your connection and try again.');
      setShowSearchSection(true); // Show search section even when there's an error so user can see the error message
    } finally {
      setLoading(false);
    }
  };

  // const handleUserSelect = async (username: string) => {
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const userData = await fetchUser(username);
  //     setSelectedUser(userData);
  //     setCurrentSection('search'); // Set current section to search when selecting from search results
  //   } catch {
  //     setError('Failed to fetch user data. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Navigate between users in the current section
  const handleUserNavigation = (direction: 'prev' | 'next') => {
    if (!selectedUser) return;

    // Determine which list to navigate through based on current section
    const currentList = currentSection === 'search' ? users : suggestedUsers;
    if (!currentList || currentList.length === 0) return;

    // Find current index of selected user in the list
    const currentIndex = currentList.findIndex(
      user => user.githubUsername === selectedUser.githubUsername
    );

    if (currentIndex === -1) return;

    // Calculate new index with wraparound
    let newIndex;
    if (direction === 'next') {
      newIndex = currentIndex === currentList.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? currentList.length - 1 : currentIndex - 1;
    }

    // Update selected user
    const nextUser = currentList[newIndex];
    setSelectedUser(nextUser);

    // Keep drawer open by not modifying the open state in UserCard component
  };

  const handleSuggestUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await suggestUser(suggestUsername, suggestedBy);
      setSuggestUsername('');
      setSuggestedBy('');
      setIsRefetchingSuggested(true);
      await refetchSuggestedUsers();
    } catch {
      setError('Failed to suggest user. Please try again.');
    } finally {
      setLoading(false);
      setIsRefetchingSuggested(false);
    }
  };

  const handleCloseSearchSection = () => {
    setShowSearchSection(false);
    setSelectedUser(null);
    setUsers([]);
    setError(null);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-text-highlight mb-4">GitHub Analytics</h1>
            <p className="text-lg bg-text-highlight">
              Track and analyze GitHub activity of your peers
            </p>
          </div> */}

          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for peers..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input"
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
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input"
                required
              />
              <Input
                type="text"
                value={suggestedBy}
                onChange={(e) => setSuggestedBy(e.target.value)}
                placeholder="Your name..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input"
                required
              />
              <Button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50">
                Suggest User
              </Button>
            </div>
          </form>

          {error && showSearchSection && (
            <div className="mb-8 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
              {error}
            </div>
          )}

          {showSearchSection && (
            <div className="mb-8 transition-all duration-300 ease-in-out">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white bg-text-highlight">Search Results</h2>
                <Button
                  onClick={handleCloseSearchSection}
                  variant="outline"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20 border-gray-300 dark:border-gray-600"
                >
                  ✕ Close
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Search Results Column */}
                <div className="lg:col-span-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 bg-text-highlight">Results</h3>
                  <div className="h-[480px] overflow-y-auto pr-2 space-y-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 p-4">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, idx) => (
                        <div key={idx} className="w-full">
                          <UserCardSkeleton />
                        </div>
                      ))
                    ) : users.length > 0 ? (
                      users.map((user) => (
                        <SimpleUserCard
                          key={user.id}
                          user={user}
                          onSelect={(selectedUser) => {
                            setSelectedUser(selectedUser);
                            setCurrentSection('search');
                          }}
                        />
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No results found
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected User Details Column */}
                <div className="lg:col-span-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 bg-text-highlight">User Details</h3>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                    {selectedUser ? (
                      <UserCard
                        user={selectedUser}
                        onUserNavigation={handleUserNavigation}
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
              </div>
            </div>
          )}

          {/* Suggested Users Section */}
          <div className={`${showSearchSection ? 'mt-12' : 'mt-8'} mb-12`}>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white bg-text-highlight">Suggested Users</h2>
              {isRefetchingSuggested && (
                <span className="ml-2 inline-block align-middle">
                  <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isInitialLoading ? (
                Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="w-full">
                    <UserCardSkeleton />
                  </div>
                ))
              ) : (
                suggestedUsers.map((user) => (
                  <div key={user.id}>
                    <UserCard
                      user={selectedUser && currentSection === 'suggested' && selectedUser.id === user.id ? selectedUser : user}
                      onUserNavigation={selectedUser && currentSection === 'suggested' && selectedUser.id === user.id ? handleUserNavigation : undefined}
                      isDialogOpen={selectedUser?.id === user.id && currentSection === 'suggested'}
                      onDialogOpenChange={(open) => {
                        if (!open) {
                          setSelectedUser(null);
                        } else {
                          setSelectedUser(user);
                          setCurrentSection('suggested');
                        }
                      }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}