'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { searchUsers, suggestUser, createTeam } from '@/lib/api-client';
import UserCard, { UserCardSkeleton } from '@/components/UserCard';
import SimpleUserCard from '@/components/SimpleUserCard';
import { GithubUser } from '@/types/github';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSuggestedUsersHome } from '@/hooks/useSuggestedUsersHome';
import AuthGuard from '@/components/AuthGuard';
import Header from '@/components/ui/Header';
import SearchUserCard from '@/components/SearchUserCard';
import { EmptyGroupCTA } from '@/components/ui/EmptyGroupCTA';
import { useToast, ToastContainer } from '@/components/ui/toast';


export default function HomePage() {
  const { data: session, update: updateSession } = useSession();
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
  const [error, setError] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<'search' | 'suggested'>('search');
  const [showSearchSection, setShowSearchSection] = useState(false);
  const [teamsManuallyUpdated, setTeamsManuallyUpdated] = useState(false);
  const { toasts, removeToast, showSuccess, showError } = useToast();

  // Use refetch from hook with selected group
  const { users: suggestedUsers, isLoading: isInitialLoading, refetch: refetchSuggestedUsers, removeUser, addUser } = useSuggestedUsersHome(selectedGroup);
  const [isRefetchingSuggested, setIsRefetchingSuggested] = useState(false);

  // Ref for scrolling to search section
  const searchSectionRef = useRef<HTMLFormElement>(null);

  // Handle group switching with loading state
  const handleGroupSwitch = async (newGroup: string) => {
    if (newGroup === selectedGroup) return;

    setGroupSwitchLoading(newGroup);
    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 200));
    setSelectedGroup(newGroup);
    setGroupSwitchLoading(null);
  };

  // Initialize teams from session data
  useEffect(() => {
    console.log('Session data:', {
      userTeams: session?.userTeams,
      hasSession: !!session,
      currentGroups: groups,
      selectedGroup: selectedGroup,
      teamsManuallyUpdated: teamsManuallyUpdated
    });

    if (!session) {
      // No session yet, don't do anything
      return;
    }

    // Reset manual update flag when session changes (new login)
    if (session && teamsManuallyUpdated) {
      setTeamsManuallyUpdated(false);
    }

    // Check if we have session data with teams
    if (session.userTeams && Array.isArray(session.userTeams) && session.userTeams.length > 0) {
      // Always update from session if we have real teams (not the default ones)
      const isCurrentlyDefault = JSON.stringify([...groups].sort()) === JSON.stringify(['Classmates', 'Colleagues', 'Friends'].sort());
      const sessionTeamsStr = JSON.stringify([...session.userTeams].sort());
      const currentGroupsStr = JSON.stringify([...groups].sort());

      if (isCurrentlyDefault || sessionTeamsStr !== currentGroupsStr) {
        console.log('Updating groups from session:', session.userTeams);
        setGroups(session.userTeams);
        // Set the first team as selected if no group is selected yet or if current selection is not in the new teams
        if (!selectedGroup || !session.userTeams.includes(selectedGroup)) {
          setSelectedGroup(session.userTeams[0]);
        }
      }
    } else if (!session.userTeams || session.userTeams.length === 0) {
      // Only set default teams if we have a session but no teams
      if (groups.length === 0 || !teamsManuallyUpdated) {
        console.log('Setting default teams');
        const defaultTeams = ['Classmates', 'Colleagues', 'Friends'];
        setGroups(defaultTeams);
        if (!selectedGroup) {
          setSelectedGroup(defaultTeams[0]);
        }
      }
    }
  }, [session]);

  // Effect to handle group changes
  useEffect(() => {
  }, [selectedGroup]);

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
      // Optimistically create a user object (this will be replaced with real data on success)
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
      addUser && addUser(optimisticUser);
      setSuggestUsername('');
      showSuccess('User suggestion in progress...');

      // Make the actual API call
      await suggestUser(username, selectedGroup);

      // Refresh to get real data (this will replace the optimistic update)
      await refetchSuggestedUsers();
      showSuccess('User suggested successfully!');
    } catch (err) {
      // Remove optimistic update on error
      removeUser && removeUser(`temp-${Date.now()}`);

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
      const result = await createTeam(newGroupName.trim());

      if (Array.isArray(result) && result.length > 0) {
        // Update groups with the response from backend which contains all teams
        setGroups(result);
        setSelectedGroup(newGroupName.trim());
        setNewGroupName('');
        setShowCreateGroup(false);
        setTeamsManuallyUpdated(true); // Mark as manually updated
        showSuccess(`Group "${newGroupName.trim()}" created successfully!`);

        console.log('Updated teams from backend:', result);

        // Force session refresh to get updated teams from backend
        try {
          await updateSession();
          console.log('Session refreshed with new teams');
        } catch (sessionError) {
          console.error('Failed to refresh session:', sessionError);
        }
      } else {
        showError('Failed to create group. Please try again.');
      }
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
                  disabled={groups.length === 0 || groupSwitchLoading !== null}
                >
                  {groups.length === 0 ? (
                    <option value="">Loading teams...</option>
                  ) : (
                    groups.map((group) => (
                      <option key={group} value={group}>
                        {group} {groupSwitchLoading === group ? '(Loading...)' : ''}
                      </option>
                    ))
                  )}
                </select>
                <Button type="submit" disabled={suggestLoading || groups.length === 0 || groupSwitchLoading !== null} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50">
                  {suggestLoading ? 'Suggesting...' : groups.length === 0 ? 'Loading...' : 'Suggest User'}
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
                              addUser && addUser(tempUser);
                              showSuccess('User suggestion in progress...');

                              await suggestUser(user.githubUsername, selectedGroup);
                              await refetchSuggestedUsers();
                              showSuccess(`${user.githubUsername} suggested successfully!`);
                            } catch (err) {
                              // Remove optimistic update on error
                              removeUser && removeUser(tempId);

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
                  {groups.map((group) => (
                    <Button
                      key={group}
                      variant={selectedGroup === group ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleGroupSwitch(group)}
                      className="text-sm relative"
                      disabled={groupSwitchLoading !== null}
                    >
                      {group}
                      {groupSwitchLoading === group && (
                        <span className="ml-2 inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-current"></span>
                      )}
                    </Button>
                  ))}
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
                        onDelete={handleDeleteUser}
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
