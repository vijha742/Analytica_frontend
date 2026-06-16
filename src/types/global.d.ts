// Global Window interface extensions for in-memory caching
// Resolves TYPE-001: Replaces @ts-expect-error hacks in dashboard/profile pages

import type { GithubUser, CodeAnalysis, ReadmeAnalysis } from './github';

declare global {
  interface Window {
    __dashboardCache?: {
      [username: string]: {
        userData: import('./github').GithubUser | null;
        codeAnalysis: import('./github').CodeAnalysis[] | null;
        readmeAnalysis: import('./github').ReadmeAnalysis[] | null;
      };
    };
    __profileCache?: {
      [username: string]: {
        userData: import('./github').GithubUser | null;
        codeAnalysis: import('./github').CodeAnalysis[] | null;
        readmeAnalysis: import('./github').ReadmeAnalysis[] | null;
      };
    };
    __suggestedUsersCache?: Record<
      string,
      {
        data: import('./github').GithubUser[];
        timestamp: number;
        expiresAt: number;
      }
    >;
  }
}

export {};
