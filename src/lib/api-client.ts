import { GithubUser, ContributionTimeSeriesAPI, CodeAnalysis, ReadmeAnalysis, TechAnalysis, UserComparisonResponse, SupplementingUserMatch } from '@/types/github';
import { makeAuthenticatedRequest } from './auth-api';
import { logger } from './logger';

/**
 * Standardized API error class (ERR-003)
 * Throw and catch this throughout the codebase for consistent error handling.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly endpoint: string;

  constructor(message: string, statusCode: number, endpoint = '') {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.endpoint = endpoint;
  }

  /** True when the server responded with 4xx/5xx, false for network errors */
  get isHttpError(): boolean {
    return this.statusCode > 0;
  }

  /** Human-readable summary for display in UI */
  get displayMessage(): string {
    if (this.statusCode === 401) return 'Authentication required. Please sign in again.';
    if (this.statusCode === 403) return 'You do not have permission to access this resource.';
    if (this.statusCode === 404) return 'The requested resource was not found.';
    if (this.statusCode === 429) return 'Too many requests. Please wait a moment and try again.';
    if (this.statusCode >= 500) return 'A server error occurred. Please try again later.';
    return this.message;
  }
}

/**
 * API-001: In-flight request deduplication.
 *
 * Maps a cache key (method + URL) to an in-flight Promise. Subsequent calls
 * with the same key while the first is pending receive the same Promise,
 * eliminating redundant network requests when multiple components mount at once.
 */
const inFlightRequests = new Map<string, Promise<unknown>>();

/**
 * Wraps an async factory with deduplication logic.
 *
 * @param key   - Unique string key for this request (e.g. "GET /api/...")
 * @param factory - Function that creates the actual fetch Promise
 */
function dedupe<T>(key: string, factory: () => Promise<T>): Promise<T> {
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key) as Promise<T>;
  }
  const promise = factory().finally(() => {
    inFlightRequests.delete(key);
  });
  inFlightRequests.set(key, promise);
  return promise;
}


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchTechAnalysis(username: string): Promise<TechAnalysis> {
  const endpoint = `/api/public/u/${username}/tech-analysis`;
  // API-001: deduplicate concurrent calls for the same username
  return dedupe(`GET:${endpoint}`, async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new ApiError(`Failed to fetch tech analysis`, response.status, endpoint);
      }
      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error fetching tech analysis:', error);
      throw new ApiError('Network error while fetching tech analysis', 0, endpoint);
    }
  });
}

export async function fetchReadmeAnalysis(username: string): Promise<ReadmeAnalysis[]> {
  const endpoint = `/api/public/u/${username}/readme-analysis`;
  // API-001: deduplicate concurrent calls for the same username
  return dedupe(`GET:${endpoint}`, async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new ApiError(`Failed to fetch README analysis`, response.status, endpoint);
      }
      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error fetching readme analysis:', error);
      throw new ApiError('Network error while fetching README analysis', 0, endpoint);
    }
  });
}

export async function fetchCodeAnalysis(username: string): Promise<CodeAnalysis[]> {
  const endpoint = `/api/public/u/${username}/code-analysis`;
  // API-001: deduplicate concurrent calls for the same username
  return dedupe(`GET:${endpoint}`, async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new ApiError(`Failed to fetch code analysis`, response.status, endpoint);
      }
      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error fetching code analysis:', error);
      throw new ApiError('Network error while fetching code analysis', 0, endpoint);
    }
  });
}

export async function fetchUserData(username: string): Promise<GithubUser> {
  const endpoint = `/api/public/users/${username}`;
  // API-001: deduplicate concurrent calls for the same username
  return dedupe(`GET:${endpoint}`, async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new ApiError(`Failed to fetch user data`, response.status, endpoint);
      }
      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error fetching user data:', error);
      throw new ApiError('Network error while fetching user data', 0, endpoint);
    }
  });
}

export async function fetchUser(username: string): Promise<GithubUser> {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/graphql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query($username: String!) {
            user(username: $username) {
              id
              githubUsername
              name
              email
              avatarUrl
              bio
              followersCount
              followingCount
              publicReposCount
              totalContributions
              lastUpdated
              repositories {
                id
                name
                description
                language
                stargazerCount
                forkCount
                isPrivate
                createdAt
                updatedAt
              }
              contributions {
                id
                date
                count
                type
              }
            }
          }
        `,
        variables: {
          username,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.errors?.[0]?.message || 'Failed to fetch user data');
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }
  return data.data.user;
}

export async function getSuggestedUsers(group: string = 'Classmates'): Promise<GithubUser[]> {
  const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/suggested-users?team=${encodeURIComponent(group)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch suggested users');
  }
  return response.json();
}

export async function suggestUser(githubUsername: string, team: string = 'Classmates'): Promise<void> {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/api/suggested-users?githubUsername=${encodeURIComponent(githubUsername)}&team=${encodeURIComponent(team)}`,
    {
      method: 'POST',
    }
  );
  if (!response.ok && response.status === 400) {
    throw new Error('Failed to suggest user. Make sure the username is correct.');
  }
}

export async function fetchContributionTimeSeries(username: string, mode: string): Promise<ContributionTimeSeriesAPI> {
  const endpoint = `/api/public/users/${username}/contrib-cal?mode=${encodeURIComponent(mode)}`;
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new ApiError(`Failed to fetch contribution time-series`, response.status, endpoint);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logger.error('Error fetching contribution time-series:', error);
    throw new ApiError('Network error while fetching contribution data', 0, endpoint);
  }
}

export const refreshUser = async (githubUsername: string, team: string): Promise<GithubUser> => {
  const endpoint = `/api/suggested-users/refresh?githubUsername=${encodeURIComponent(githubUsername)}&team=${encodeURIComponent(team)}`;
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}${endpoint}`, { method: 'POST' });
    if (!response.ok) {
      throw new ApiError(`Failed to refresh user`, response.status, endpoint);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logger.error('Error refreshing user:', error);
    throw new ApiError('Network error while refreshing user', 0, endpoint);
  }
}

export const compareUsers = async (user1: string, user2: string): Promise<UserComparisonResponse> => {
  const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/public/users/compare?User1=${encodeURIComponent(user1)}&User2=${encodeURIComponent(user2)}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return await response.json();
};

export async function deactivateSuggestedUser(id: number): Promise<void> {
  const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/suggested-users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to deactivate suggested user');
  }
}

export async function deleteSuggestedUser(id: string): Promise<{ success: boolean }> {
  const endpoint = `/api/suggested-users/${id}`;
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}${endpoint}`, { method: 'DELETE' });
    if (!response.ok) {
      throw new ApiError(`Failed to delete suggested user`, response.status, endpoint);
    }
    return { success: true };
  } catch (error) {
    logger.error('Error deleting suggested user:', error);
    return { success: false };
  }
}

export async function isUserSuggested(githubUsername: string): Promise<boolean> {
  const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/suggested-users/check/${encodeURIComponent(githubUsername)}`);
  if (!response.ok) {
    throw new Error('Failed to check if user is suggested');
  }
  return response.json();
}

export async function searchUsers(query: string, limit: number = 10): Promise<GithubUser[]> {
  const endpoint = `/api/public/users/search?keyword=${encodeURIComponent(query)}&limit=${limit}`;
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}${endpoint}`, { method: 'GET' });
    if (!response.ok) {
      throw new ApiError(`Search request failed`, response.status, endpoint);
    }
    const result = await response.json();
    if (Array.isArray(result)) return result;
    return [];
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logger.error('Search users error:', error);
    throw new ApiError('Network error while searching users', 0, endpoint);
  }
}

export async function getLeaderboard(scope: string = "global"): Promise<GithubUser[]> {
  const endpoint = scope === "local" ? `/api/social/leaderboard/local` : `/api/social/leaderboard/global`;
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new ApiError(`Failed to fetch leaderboard`, response.status, endpoint);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logger.error('Error fetching leaderboard:', error);
    throw new ApiError('Network error while fetching leaderboard', 0, endpoint);
  }
}

export async function getSupplementingUser(): Promise<SupplementingUserMatch[]> {
  const endpoint = `/api/social/p-match/s`;
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new ApiError(`Failed to fetch supplementing users`, response.status, endpoint);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logger.error('Error fetching supplementing users:', error);
    throw new ApiError('Network error while fetching supplementing users', 0, endpoint);
  }
}

export async function createTeam(teamName: string): Promise<string[]> {
  const endpoint = `/api/public/users/team?teamName=${encodeURIComponent(teamName)}`;
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new ApiError(`Failed to create team`, response.status, endpoint);
    }
    const data = await response.json();
    // Backend returns direct array of team names
    if (Array.isArray(data)) return data;
    // Fallback in case backend structure changes
    return data.Teams || [];
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logger.error('Error creating team:', error);
    throw new ApiError('Network error while creating team', 0, endpoint);
  }
}

export async function deleteTeam(teamName: string): Promise<string[]> {
  const endpoint = `/api/public/users/team?teamName=${encodeURIComponent(teamName)}`;
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new ApiError(`Failed to delete team`, response.status, endpoint);
    }
    const data = await response.json();
    // Backend returns direct array of team names
    if (Array.isArray(data)) return data;
    // Fallback in case backend structure changes
    return data.Teams || [];
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logger.error('Error deleting team:', error);
    throw new ApiError('Network error while deleting team', 0, endpoint);
  }
}

export async function getMyData(username: string): Promise<GithubUser> {
  const endpoint = `/api/public/users/${username}`;
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new ApiError(`Failed to fetch user data`, response.status, endpoint);
    }
    const data = await response.json();
    return data as GithubUser;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logger.error('Error fetching user data (getMyData):', error);
    throw new ApiError('Network error while fetching user data', 0, endpoint);
  }
}

export async function fetchUserTeams(): Promise<string[]> {
  const endpoint = `/api/public/users/team`;
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new ApiError(`Failed to fetch user teams`, response.status, endpoint);
    }
    const data = await response.json();
    // Handle both cases: array directly or wrapped in teams property
    if (Array.isArray(data)) return data;
    return data.teams || [];
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logger.error('Error fetching user teams:', error);
    throw new ApiError('Network error while fetching teams', 0, endpoint);
  }
}
