export interface GithubUser {
  id: number;
  githubUsername: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  bio: string | null;
  followersCount: number;
  followingCount: number;
  publicReposCount: number;
  totalContributions: number;
  lastUpdated: Date;
  repositories: Repository[];
  contributions: Contribution[];
  collaborationMetrics?: CollaborationMetrics;
  repositoryAnalytics?: RepositoryAnalytics;
  technicalProfile?: TechnicalProfile;
  developerImpactMetrics?: DeveloperImpactMetrics;
  skillProgressionMetrics?: SkillProgressionMetrics;
}

export interface Repository {
  id: number;
  name: string;
  description: string | null;
  stargazerCount: number;
  forkCount: number;
  language: string | null;
  updatedAt: string;
}

export interface Contribution {
  id: string;
  date: string;
  count: number;
  type: ContributionType;
}

export enum ContributionType {
  COMMIT = 'COMMIT',
  PULL_REQUEST = 'PULL_REQUEST',
  ISSUE = 'ISSUE',
  CODE_REVIEW = 'CODE_REVIEW',
}

export interface SuggestedUser {
  id: number;
  githubUsername: string;
  suggestedBy: string;
  suggestedAt: string;
  isActive: boolean;
}

export interface RateLimit {
  limit: number;
  remaining: number;
  resetAt: string;
}


export interface ContributionTimeSeries {
  username: string;
  timeFrame: TimeFrame;
  startDate: string;
  endDate: string;
  points: Array<{
    date: string;
    readableDate?: string;
    count: number;
  }>;
}

// CollaborationMetrics from DashboardContent.md
export interface CollaborationMetrics {
  teamCollaborationScore: number;
  codeReviewParticipation: number;
  issueResolutionRate: number;
  avgResponseTime: number;
  collaborationStyle: CollaborationStyleMetrics;
  communityEngagement: CommunityEngagementMetrics;
}

export interface CollaborationStyleMetrics {
  pullRequestsCreated: number;
  pullRequestsReviewed: number;
  issuesCreated: number;
  issuesResolved: number;
  contributedRepositoriesCount: number;
  ownRepositoriesCount: number;
  codeReviewParticipation: number;
  issueParticipation: number;
  soloVsTeamScore: number;
  communityCollaborationScore: number;
  mainlyMaintainer: boolean;
}

export interface CommunityEngagementMetrics {
  discussionParticipation: number;
  issueResponses: number;
  pullRequestsReviewed: number;
  avgReviewQuality: number;
  helpfulnessRating: number;
}

// Repository fields from DashboardContent.md
// export interface Repository {
//   id: number;
//   name: string;
//   description: string | null;
//   language: string | null;
//   stargazerCount: number;
//   forkCount: number;
//   isPrivate: boolean;
//   createdAt: string;
//   updatedAt: string;
//   topics: string[];
//   codeMetrics?: CodeMetrics;
//   codeQuality?: CodeQuality;
//   licenseInfo?: LicenseInfo;
//   readmeInfo?: ReadmeInfo;
// }

export interface CodeMetrics {
  totalLines: number;
  avgFileSize: number;
  languageDistribution: Record<string, number>;
  complexityMetrics: ComplexityMetrics;
}

export interface ComplexityMetrics {
  score: number;
  factorsUsed: string[];
  avgMethodLength?: number;
  avgFileComplexity?: number;
  size: number;
  fileCount: number;
  folderCount: number;
  dependencyCount: number;
  fileTypesDistribution: Record<string, number>;
  languageFileCount: Record<string, number>;
  primaryLanguage: string;
}

export interface CodeQuality {
  codeQualityIndicators: string[];
  codeOrganizationScore: number;
  avgCommitMessageLength: number;
  conventionalCommitsPercentage: number;
  commentToCodeRatio: number;
  lastUpdated: string;
  testCoverage: number;
}

export interface LicenseInfo {
  name: string;
  spdxId: string;
  url: string;
}

export interface ReadmeInfo {
  score: number;
  lastUpdated: string;
  wordCount: number;
  hasIntro: boolean;
  hasInstallationGuide: boolean;
  hasUsageExamples: boolean;
  hasMaintainerInfo: boolean;
}

// Technical Profile from DashboardContent.md
export interface TechnicalProfile {
  languages: LanguageSpecificField[];
  developerImpact: DeveloperImpactMetrics;
  repositoryAnalytics: RepositoryAnalytics;
  codeQualityStats: CodeQualityStats;
  documentationStats: DocumentationStats;
}

export interface LanguageSpecificField {
  name: string;
  category: 'LANGUAGE' | 'FRAMEWORK' | 'LIBRARY' | 'TOOL';
  firstUsed: string;
  lastUsed: string;
  frequency: number;
  projectCount: number;
  proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  linesOfCode: number;
  yearsOfExperience: number;
  trend: number;
  fileCount: number;
  percentageOfCodebase: number;
}

export interface DeveloperImpactMetrics {
  totalStars: number;
  totalForks: number;
  totalWatchers: number;
  dependentRepoCount: number;
  communityImpactScore: number;
  mostImpactfulRepositories: string[];
  starsTrend: Array<{ date: string; count: number }>;
  forksTrend: Array<{ date: string; count: number }>;
  specializationScore: number;
  generalizationScore: number;
  lastUpdated: string;
}

export interface RepositoryAnalytics {
  totalRepositories: number;
  activeRepositories: number;
  abandonedRepositories: number;
  avgProjectDuration: number;
  completionRate: number;
  topicsDistribution: Record<string, number>;
}

export interface CodeQualityStats {
  avgCommitQuality: number;
  codeOrganizationScore: number;
  testCoverage: number;
  maintainabilityIndex: number;
}

export interface DocumentationStats {
  avgReadmeScore: number;
  wikiUsageRate: number;
  inlineDocumentationCoverage: number;
  documentationConsistency: number;
}

// Skill Progression Metrics from DashboardContent.md
export interface SkillProgressionMetrics {
  newTechnologiesAdoptedByYear: Record<string, number>;
  learningRate: number;
  experimentationRate: number;
  lastUpdated: string;
  languageProgression: LanguageProgression[];
  technologyProgression: TechnologyProgression[];
}

export interface LanguageProgression {
  language: string;
  year: number;
  repositoryCount: number;
  linesOfCode: number;
  proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
}

export interface TechnologyProgression {
  technology: string;
  category: 'LANGUAGE' | 'FRAMEWORK' | 'LIBRARY' | 'TOOL';
  year: number;
  repositoryCount: number;
  adoptionRate: number;
}

export interface RateLimit {
  limit: number;
  remaining: number;
  resetAt: string;
}

export enum TimeFrame {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export interface TimeSeriesDataPoint {
  date: string;
  readableDate?: string;
  chartDate?: string;
  count: number;
}

export interface ContributionTimeSeries {
  point: TimeSeriesDataPoint[];
  totalCount: number;
  periodStart: string;
  periodEnd: string;
  readablePeriodStart?: string;
  readablePeriodEnd?: string;
}

export interface RepositoryAnalytics {
  totalRepositories: number;
  activeRepositories: number;
  abandonedRepositories: number;
  averageProjectDuration?: number;
  completionRate: number;
  topicDistribution: TopicStats[];
  documentationStats?: DocumentationStats;
  codeQualityStats?: CodeQualityStats;
}

export interface TopicStats {
  topic: string;
  repositoryCount: number;
  percentage: number;
  trend?: TrendIndicator;
}

export interface DocumentationStats {
  averageReadmeScore: number;
  wikiUsageRate: number;
  inlineDocumentationRatio: number;
  documentationConsistency: number;
}

export interface CodeQualityStats {
  averageCommitQuality: number;
  codeOrganizationScore: number;
  testCoverage: number;
  maintainabilityIndex: number;
}

export enum TrendIndicator {
  INCREASING = 'INCREASING',
  STABLE = 'STABLE',
  DECREASING = 'DECREASING',
  NEW = 'NEW',
  ABANDONED = 'ABANDONED',
}

export interface TechnicalProfile {
  primaryLanguages: LanguageExpertise[];
  frameworksUsed?: TechnologyUsage[];
  librariesUsed?: TechnologyUsage[];
  toolingPreferences?: TechnologyUsage[];
  specializationScore: number;
  versatilityScore: number;
  learningRate?: number;
  experimentationFrequency?: number;
}

export interface LanguageExpertise {
  language: string;
  linesOfCode: number;
  yearsOfExperience?: number;
  lastUsed?: string;
  proficiencyLevel: ProficiencyLevel;
  trendIndicator?: TrendIndicator;
}

export interface TechnologyUsage {
  name: string;
  category: TechnologyCategory;
  firstUsed?: string;
  lastUsed?: string;
  frequency: number;
  projectCount?: number;
  proficiencyLevel: ProficiencyLevel;
}

export enum ProficiencyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

export enum TechnologyCategory {
  LANGUAGE = 'LANGUAGE',
  FRAMEWORK = 'FRAMEWORK',
  LIBRARY = 'LIBRARY',
  TOOL = 'TOOL',
  DATABASE = 'DATABASE',
  PLATFORM = 'PLATFORM',
}

export interface ImpactMetrics {
  dependencyUsageCount: number;
  totalDownstreamRepositories: number;
  stargazersTrend: TimeSeriesDataPoint[];
  forksTrend: TimeSeriesDataPoint[];
  communityInfluenceScore: number;
  contributionImpactScore: number;
}

// New analytics types
export interface SkillProgressionMetrics {
  username: string;
  languageProgressiondata: LanguageProgressionPoint[];
  technologyProgressiondata: TechnologyProgressionPoint[];
  newTechnologiesAdoptedByYeardata: Record<string, any>;
  learningRate: number;
  experimentationFrequency: number;
  lastUpdated: string;
}

export interface LanguageProgressionPoint {
  language: string;
  year: number;
  repositoryCount: number;
  linesOfCode: number;
  proficiencyLevel: number;
}

export interface TechnologyProgressionPoint {
  technology: string;
  category: string;
  year: number;
  repositoryCount: number;
  adoptionSpeed: number;
}

export interface CollaborationStyleMetrics {
  username: string;
  pullRequestsCreated: number;
  pullRequestsReviewed: number;
  issuesCreated: number;
  issuesResolved: number;
  contributedRepositoriesCount: number;
  ownRepositoriesCount: number;
  codeReviewParticipation: number;
  issueParticipation: number;
  soloVsTeamScore: number;
  communityCollaborationScore: number;
  mainlyMaintainer: boolean;
}

export interface DeveloperImpactMetrics {
  username: string;
  totalStars: number;
  totalForks: number;
  totalWatchers: number;
  dependentRepositoriesCount: number;
  communityInfluenceScore: number;
  mostImpactfulRepositoriesData: Record<string, any>;
  starsTrend: TrendPoint[];
  forksTrend: TrendPoint[];
  specializationScore: number;
  generalizationScore: number;
  lastUpdated: string;
}

export interface TrendPoint {
  date: string;
  count: number;
}

export interface CodeQualityIndicators {
  commitMessageQualityScore: number;
  codeOrganizationScore: number;
  averageCommitMessageLength: number;
  conventionalCommitPercentage: number;
  commentToCodeRatio: number;
  testCoverageEstimate: number;
  lastUpdated: string;
}

export interface ProjectComplexity {
  repositoryName: string;
  repositorySize: number;
  fileCount: number;
  directoryCount: number;
  dependencyCount: number;
  fileTypeDistribution: Record<string, any>;
  complexityScore: number;
  primaryLanguage: string;
}