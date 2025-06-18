import { ContributionType } from "./github";

export interface MockUser {
  id: string;
  name: string;
  username: string;
  email: string;
  profilePicture: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  totalContributions: number;
  publicReposCount: number;
  contributions: {
    id: number | string;
    date: string;
    count: number;
    type: string;
  }[];
  collaborationMetrics?: {
    teamCollaborationScore: number;
    codeReviewParticipation: number;
    issueResolutionRate: number;
    avgResponseTime: number;
  };
  collaborationStyleMetrics?: {
    soloVsTeamScore: number;
  };
  communityEngagementMetrics?: {
    discussionParticipation: number;
    issueResponses: number;
    pullRequestsReviewed: number;
    avgReviewQuality: number;
    helpfulnessRating: number;
  };
}

export interface MockRepository {
  id: number;
  name: string;
  description: string;
  language: string;
  stargazerCount: number;
  forkCount: number;
  updatedAt: string;
  codeMetrics?: {
    languageDistribution: Record<string, number>;
    totalLines: number;
    avgFileSize: number;
    complexityMetrics?: {
      score: number;
      fileCount: number;
      folderCount: number;
      dependencyCount: number;
    };
  };
}
