/**
 * Centralized API configuration (API-003)
 *
 * All API base URLs and endpoint path builders live here.
 * Import `API_BASE_URL` or the helper builders instead of using
 * `process.env.NEXT_PUBLIC_API_URL` inline throughout the codebase.
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

/** Public (unauthenticated) endpoints */
export const API_ENDPOINTS = {
  // Users
  user: (username: string) => `${API_BASE_URL}/api/public/users/${username}`,
  userSearch: (keyword: string, limit = 10) =>
    `${API_BASE_URL}/api/public/users/search?keyword=${encodeURIComponent(keyword)}&limit=${limit}`,
  userCompare: (user1: string, user2: string) =>
    `${API_BASE_URL}/api/public/users/compare?User1=${encodeURIComponent(user1)}&User2=${encodeURIComponent(user2)}`,
  userTeams: () => `${API_BASE_URL}/api/public/users/team`,
  userTeam: (teamName: string) =>
    `${API_BASE_URL}/api/public/users/team?teamName=${encodeURIComponent(teamName)}`,

  // Analyses
  codeAnalysis: (username: string) =>
    `${API_BASE_URL}/api/public/u/${username}/code-analysis`,
  readmeAnalysis: (username: string) =>
    `${API_BASE_URL}/api/public/u/${username}/readme-analysis`,
  techAnalysis: (username: string) =>
    `${API_BASE_URL}/api/public/u/${username}/tech-analysis`,
  contribCal: (username: string, mode: string) =>
    `${API_BASE_URL}/api/public/users/${username}/contrib-cal?mode=${encodeURIComponent(mode)}`,

  // Social
  suggestedUsers: (team: string) =>
    `${API_BASE_URL}/api/suggested-users?team=${encodeURIComponent(team)}`,
  suggestUser: (githubUsername: string, team: string) =>
    `${API_BASE_URL}/api/suggested-users?githubUsername=${encodeURIComponent(githubUsername)}&team=${encodeURIComponent(team)}`,
  suggestedUserById: (id: string | number) =>
    `${API_BASE_URL}/api/suggested-users/${id}`,
  checkSuggestedUser: (githubUsername: string) =>
    `${API_BASE_URL}/api/suggested-users/check/${encodeURIComponent(githubUsername)}`,
  refreshSuggestedUser: (githubUsername: string, team: string) =>
    `${API_BASE_URL}/api/suggested-users/refresh?githubUsername=${encodeURIComponent(githubUsername)}&team=${encodeURIComponent(team)}`,
  leaderboard: (scope = 'global') =>
    `${API_BASE_URL}/api/social/leaderboard?scope=${encodeURIComponent(scope)}`,
  partnerMatch: () => `${API_BASE_URL}/api/social/p-match/s`,

  // Auth
  refreshJwt: () => `${API_BASE_URL}/auth/refresh-jwt`,
  graphql: () => `${API_BASE_URL}/graphql`,
} as const;
