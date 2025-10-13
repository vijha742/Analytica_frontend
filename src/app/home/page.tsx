'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { searchUsers, suggestUser, createTeam, deleteTeam, fetchUserTeams } from '@/lib/api-client';
import UserCard, { UserCardSkeleton } from '@/components/UserCard';
import SimpleUserCard from '@/components/SimpleUserCard';
import { GithubUser } from '@/types/github';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSuggestedUsersHome, clearSuggestedUsersCache } from '@/hooks/useSuggestedUsersHome';
import AuthGuard from '@/components/AuthGuard';
import Header from '@/components/ui/Header';
import SearchUserCard from '@/components/SearchUserCard';
import { EmptyGroupCTA } from '@/components/ui/EmptyGroupCTA';
import { useToast, ToastContainer } from '@/components/ui/toast';


export default function HomePage() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<GithubUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<GithubUser | null>(null);
  const [suggestUsername, setSuggestUsername] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [groups, setGroups] = useState<string[]>([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [groupLoading, setGroupLoading] = useState(false);
  const [groupSwitchLoading, setGroupSwitchLoading] = useState<string | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<'search' | 'suggested'>('search');
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [showSearchSection, setShowSearchSection] = useState(false);
  const { toasts, removeToast, showSuccess, showError } = useToast();

  // Use refetch from hook with selected group
  const { users: suggestedUsers, isLoading: isInitialLoading, refetch: refetchSuggestedUsers, removeUser, addUser, updateUser, clearCache } = useSuggestedUsersHome(selectedGroup);
  const [isRefetchingSuggested, setIsRefetchingSuggested] = useState(false);

  // Refs for managing state and preventing concurrent fetches
  const searchSectionRef = useRef<HTMLFormElement>(null);
  const isFetchingTeamsRef = useRef(false);
  const hasInitiallyFetchedRef = useRef(false);

  // Handle group switching with loading state
  const handleGroupSwitch = async (newGroup: string) => {
    if (newGroup === selectedGroup) return;

    // Validate that the group still exists
    if (!groups.includes(newGroup)) {
      console.warn(`Attempted to switch to non-existent group: ${newGroup}`);
      showError('Selected group no longer exists. Please select another group.');
      return;
    }

    setGroupSwitchLoading(newGroup);
    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 200));
    setSelectedGroup(newGroup);
    setGroupSwitchLoading(null);
  };

  // Function to fetch teams from database - only depends on session
  const fetchTeamsFromDatabase = useCallback(async (preserveSelection = false) => {
    if (!session?.backendJWT) {
      console.log('No backend JWT available, cannot fetch teams');
      return;
    }

    // Prevent concurrent fetches
    if (isFetchingTeamsRef.current) {
      console.log('Teams fetch already in progress, skipping');
      return;
    }

    isFetchingTeamsRef.current = true;
    setTeamsLoading(true);
    try {
      const userTeams = await fetchUserTeams();
      console.log('Fetched teams from database:', userTeams);

      if (userTeams.length > 0) {
        setGroups(userTeams);
        // Only update selection if not preserving or if current selection is invalid
        if (!preserveSelection || !selectedGroup || !userTeams.includes(selectedGroup)) {
          setSelectedGroup(userTeams[0]);
        }
      } else {
        // If no teams found, set default teams
        const defaultTeams = ['Classmates', 'Colleagues', 'Friends'];
        setGroups(defaultTeams);
        if (!preserveSelection || !selectedGroup) {
          setSelectedGroup(defaultTeams[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching teams from database:', error);
      // Fallback to default teams on error
      const defaultTeams = ['Classmates', 'Colleagues', 'Friends'];
      setGroups(defaultTeams);
      if (!preserveSelection || !selectedGroup) {
        setSelectedGroup(defaultTeams[0]);
      }
    } finally {
      isFetchingTeamsRef.current = false;
      setTeamsLoading(false);
    }
  }, [session?.backendJWT]);

  // Initialize teams from database - only once when session becomes available
  useEffect(() => {
    console.log('Session JWT status changed:', {
      hasBackendJWT: !!session?.backendJWT,
      hasInitiallyFetched: hasInitiallyFetchedRef.current
    });

    if (!session?.backendJWT || hasInitiallyFetchedRef.current) {
      // No backend JWT yet, or already fetched initially
      return;
    }

    console.log('Fetching teams from database for the first time');
    hasInitiallyFetchedRef.current = true;
    fetchTeamsFromDatabase();
  }, [session?.backendJWT, fetchTeamsFromDatabase]);



  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setSearchLoading(true);
    setError(null);
    setUsers([]);
    setShowSearchSection(true);

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
      setSearchLoading(false);
    }
  };

  // Navigate between users in the current section
  const handleUserNavigation = (direction: 'prev' | 'next') => {
    if (!selectedUser) return;

    // Determine which list to navigate through based on current section
    const currentList = currentSection === 'search' ? users : suggestedUsers;
    if (!currentList || currentList.length === 0) return;

    // Find current index of selected user in the list
    const currentIndex = currentList.findIndex(
      (user: GithubUser) => user.githubUsername === selectedUser.githubUsername
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
    const username = suggestUsername.trim();
    if (!username) return;

    setSuggestLoading(true);
    setError(null);

    try {
      const optimisticUser: GithubUser = {
        id: `temp-${Date.now()}`,
        githubUsername: username,
        name: username,
        avatarUrl: `https://github.com/${username}.png`,
        bio: undefined,
        followersCount: 0,
        followingCount: 0,
        publicReposCount: 0,
        totalContributions: 0,
        lastUpdated: new Date().toISOString(),
        repositories: [],
        contributions: [],
        technicalProfile: {
          primaryLanguages: [],
          frameworksUsed: [],
          librariesUsed: [],
          toolingPreferences: [],
          specializationScore: 0,
          versatilityScore: 0,
          learningRate: 0,
          experimentationFrequency: 0
        },
        userTech: {
          projectTimeList: [],
          technologyUsageList: []
        }
      };

      // Add optimistic update
      if (addUser) {
        addUser(optimisticUser);
      }
      setSuggestUsername('');
      showSuccess('User suggestion in progress...');

      // Make the actual API call
      await suggestUser(username, selectedGroup);

      // Refresh to get real data (this will replace the optimistic update)
      setIsRefetchingSuggested(true);
      await refetchSuggestedUsers();
      setIsRefetchingSuggested(false);
      showSuccess('User suggested successfully!');
    } catch (err) {
      // Remove optimistic update on error
      if (removeUser) {
        removeUser(`temp-${Date.now()}`);
      }
      setIsRefetchingSuggested(false);

      // Extract error message from the backend response
      let errorMessage = 'Failed to suggest user. Please try again.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      // Check if it's a backend error with specific message
      if (typeof err === 'object' && err !== null && 'message' in err) {
        errorMessage = err.message as string;
      }

      // Show specific error messages based on common scenarios
      if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        errorMessage = 'User not found. Please check the username spelling.';
      } else if (errorMessage.includes('already exists') || errorMessage.includes('duplicate')) {
        errorMessage = 'User already exists in this group.';
      } else if (errorMessage.includes('API error')) {
        errorMessage = 'Failed to suggest user. Make sure there is no misspelling.';
      }

      showError(errorMessage);
      setError(errorMessage);
    } finally {
      setSuggestLoading(false);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    if (groups.includes(newGroupName.trim())) {
      showError('Group name already exists. Please choose a different name.');
      return;
    }

    setGroupLoading(true);

    try {
      await createTeam(newGroupName.trim());

      // Immediately fetch fresh teams from database
      const freshTeams = await fetchUserTeams();
      console.log('Teams after creation:', freshTeams);

      setGroups(freshTeams);
      setSelectedGroup(newGroupName.trim());
      setNewGroupName('');
      setShowCreateGroup(false);
      showSuccess(`Group "${newGroupName.trim()}" created successfully!`);
    } catch (err) {
      let errorMessage = 'Failed to create group. Please try again.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      // Handle specific error cases
      if (errorMessage.includes('already exists')) {
        errorMessage = 'Group name already exists. Please choose a different name.';
      } else if (errorMessage.toLowerCase().includes('invalid')) {
        errorMessage = 'Invalid group name. Please use alphanumeric characters only.';
      }
      showError(errorMessage);
    } finally {
      setGroupLoading(false);
    }
  };

  const handleDeleteGroup = async (groupName: string) => {
    // Prevent deleting if it's the only group
    if (groups.length <= 1) {
      showError('Cannot delete the last remaining group.');
      return;
    }

    setDeletingGroup(groupName);

    try {
      await deleteTeam(groupName);

      // Immediately fetch fresh teams from database
      const freshTeams = await fetchUserTeams();
      console.log('Teams after deletion:', freshTeams);

      // Update groups with fresh data from database
      setGroups(freshTeams);

      // If the deleted group was selected, switch to the first available group
      if (selectedGroup === groupName) {
        const newSelectedGroup = freshTeams[0];
        if (newSelectedGroup) {
          setSelectedGroup(newSelectedGroup);
        }
      }

      // Clear the cache for the deleted group to avoid showing stale data
      clearSuggestedUsersCache(groupName);
      console.log('Cleared cache for deleted group:', groupName);

      // Also clear current cache if we're switching away from the deleted group
      if (clearCache && selectedGroup === groupName) {
        clearCache();
      }

      showSuccess(`Group "${groupName}" deleted successfully!`);
    } catch (err) {
      let errorMessage = 'Failed to delete group. Please try again.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      console.error('Delete group error:', err);
      showError(errorMessage);
    } finally {
      setDeletingGroup(null);
    }
  };

  const handleDeleteUser = (userId: string) => {
    // Remove the user from the list and close dialog if it was open
    if (selectedUser?.id === userId) {
      setSelectedUser(null);
    }

    // Remove user from the hook's state and cache
    if (removeUser) {
      removeUser(userId);
    }
  };

  const handleRefreshUser = (refreshedUser: GithubUser) => {
    // Update the user in the hook's state and cache
    if (updateUser) {
      updateUser(refreshedUser);
    }

    // If this is the currently selected user in the drawer, update it too
    if (selectedUser && selectedUser.githubUsername === refreshedUser.githubUsername) {
      setSelectedUser(refreshedUser);
    }
  };

  const handleCloseSearchSection = () => {
    setShowSearchSection(false);
    setSelectedUser(null);
    setUsers([]);
    setError(null);
    setSearchQuery('');
  };

  const scrollToSearch = () => {
    searchSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <main className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-text-highlight mb-4">GitHub Analytics</h1>
            <p className="text-lg bg-text-highlight">
              Track and analyze GitHub activity of your peers
            </p>
          </div> */}


            <form onSubmit={handleSearch} className="mb-8" ref={searchSectionRef}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for peers..."
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input"
                  required
                  disabled={searchLoading}
                />
                <Button type="submit" disabled={searchLoading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                  {searchLoading ? 'Searching...' : 'Search'}
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
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input"
                  required
                  disabled={suggestLoading}
                />
                <select
                  value={selectedGroup}
                  onChange={(e) => handleGroupSwitch(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={teamsLoading || groups.length === 0 || groupSwitchLoading !== null}
                >
                  {teamsLoading || groups.length === 0 ? (
                    <option value="">Loading teams...</option>
                  ) : (
                    groups.map((group) => (
                      <option key={group} value={group}>
                        {group} {groupSwitchLoading === group ? '(Loading...)' : ''}
                      </option>
                    ))
                  )}
                </select>
                <Button type="submit" disabled={suggestLoading || teamsLoading || groups.length === 0 || groupSwitchLoading !== null} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50">
                  {suggestLoading ? 'Suggesting...' : teamsLoading || groups.length === 0 ? 'Loading...' : 'Suggest User'}
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
                  <h2 className="text-3xl font-bold text-white bg-text-highlight">Search Results</h2>
                  <Button
                    onClick={handleCloseSearchSection}
                    variant="outline"
                    size="sm"
                    className="text-gray-400 hover:text-gray-200 hover:bg-red-900/60 border-gray-600"
                  >
                    ✕ Close
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="lg:col-span-1">
                    <h3 className="text-xl font-semibold text-white mb-4 bg-text-highlight">Results</h3>
                    <div className="h-[480px] overflow-y-auto pr-2 space-y-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 p-4">
                      {searchLoading ? (
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
                    <h3 className="text-xl font-semibold text-white mb-4 bg-text-highlight">User Details</h3>
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                      {selectedUser ? (
                        <SearchUserCard
                          user={selectedUser}
                          onSuggestUser={async (user) => {
                            // Create a temporary ID for optimistic update
                            const tempId = `temp-search-${Date.now()}`;
                            const tempUser: GithubUser = {
                              ...user,
                              id: tempId
                            };

                            try {
                              // Add optimistic update
                              if (addUser) {
                                addUser(tempUser);
                              }
                              showSuccess('User suggestion in progress...');

                              await suggestUser(user.githubUsername, selectedGroup);
                              setIsRefetchingSuggested(true);
                              await refetchSuggestedUsers();
                              setIsRefetchingSuggested(false);
                              showSuccess(`${user.githubUsername} suggested successfully!`);
                            } catch (err) {
                              // Remove optimistic update on error
                              if (removeUser) {
                                removeUser(tempId);
                              }
                              setIsRefetchingSuggested(false);

                              let errorMessage = 'Failed to suggest user. Please try again.';
                              if (err instanceof Error) {
                                errorMessage = err.message;
                              }

                              // Check for specific error types
                              if (errorMessage.includes('404') || errorMessage.includes('not found')) {
                                errorMessage = 'User not found. Please check the username spelling.';
                              } else if (errorMessage.includes('already exists') || errorMessage.includes('duplicate')) {
                                errorMessage = 'User already exists in this group.';
                              } else if (errorMessage.includes('API error')) {
                                errorMessage = 'Failed to suggest user. Make sure there is no misspelling.';
                              }

                              showError(errorMessage);
                              setError(errorMessage);
                            }
                          }}
                        />
                      ) : (
                        <div className="bg-gray-800 rounded-lg shadow-md p-6 text-center">
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
                <h2 className="text-2xl font-bold text-white bg-text-highlight">Suggested Users</h2>
                {isRefetchingSuggested && (
                  <span className="ml-2 inline-block align-middle">
                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  </span>
                )}
              </div>

              {/* Groups Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Groups</h3>
                <div className="flex flex-wrap items-center gap-2">
                  {groups.map((group) => {
                    const canDelete = groups.length > 1; // Allow deletion of any group as long as it's not the last one

                    return (
                      <div key={group} className="relative group inline-block">
                        <Button
                          variant={selectedGroup === group ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleGroupSwitch(group)}
                          className="text-sm relative pr-6"
                          disabled={groupSwitchLoading !== null || deletingGroup !== null}
                        >
                          {group}
                          {groupSwitchLoading === group && (
                            <span className="ml-2 inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-current"></span>
                          )}
                        </Button>
                        {canDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Are you sure you want to delete the "${group}" group? This action cannot be undone.`)) {
                                handleDeleteGroup(group);
                              }
                            }}
                            disabled={deletingGroup !== null || groupSwitchLoading !== null}
                            className="absolute top-0 right-0 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-10 transform translate-x-1 -translate-y-1"
                            title={`Delete ${group}`}
                          >
                            {deletingGroup === group ? (
                              <span className="inline-block animate-spin rounded-full h-1.5 w-1.5 border-b border-white"></span>
                            ) : (
                              '×'
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {!showCreateGroup ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCreateGroup(true)}
                      className="text-sm border-dashed border-2 hover:border-solid"
                    >
                      + Add Group
                    </Button>
                  ) : (
                    <form onSubmit={handleCreateGroup} className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="Group name..."
                        className="w-32 h-8 text-sm"
                        autoFocus
                        required
                        disabled={groupLoading}
                      />
                      <Button
                        type="submit"
                        size="sm"
                        className="h-8 px-2"
                        disabled={groupLoading || !newGroupName.trim()}
                      >
                        {groupLoading ? (
                          <span className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-current"></span>
                        ) : (
                          '✓'
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowCreateGroup(false);
                          setNewGroupName('');
                        }}
                        className="h-8 px-2"
                        disabled={groupLoading}
                      >
                        ✕
                      </Button>
                    </form>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isInitialLoading ? (
                  Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="w-full">
                      <UserCardSkeleton />
                    </div>
                  ))
                ) : suggestedUsers.length > 0 ? (
                  suggestedUsers.map((user: GithubUser) => (
                    <div key={user.id}>
                      <UserCard
                        user={selectedUser && currentSection === 'suggested' && selectedUser.id === user.id ? selectedUser : user}
                        onUserNavigation={selectedUser && currentSection === 'suggested' && selectedUser.id === user.id ? handleUserNavigation : undefined}
                        onRefresh={handleRefreshUser}
                        onDelete={handleDeleteUser}
                        selectedGroup={selectedGroup}
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
                ) : (
                  <div className="col-span-full">
                    <EmptyGroupCTA
                      groupName={selectedGroup}
                      onScrollToSearch={scrollToSearch}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
