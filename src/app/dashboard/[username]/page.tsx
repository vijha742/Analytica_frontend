"use client";

import { GitBranchIcon, GitPullRequestIcon, MessageSquareIcon, StarIcon, GitForkIcon } from 'lucide-react';
import Image from 'next/image';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardMockData } from "@/lib/enhancedDashboardMockData";
import { DashboardProfileTab } from "@/components/dashboard/tabs/DashboardProfileTab";
import { DashboardCollaborationTab } from '@/components/dashboard/tabs/DashboardCollaborationTab';
import { DashboardRepositoriesTab } from '@/components/dashboard/tabs/DashboardRepositoriesTab';
import { DashboardCodeQualityTab } from '@/components/dashboard/tabs/DashboardCodeQualityTab';
import { DashboardTechnicalTab } from '@/components/dashboard/tabs/DashboardTechnicalTab';
import { DashboardSkillProgressionTab } from '@/components/dashboard/tabs/DashboardSkillProgressionTab';
import { ApiStatusIndicator } from '@/components/dashboard/ApiStatusIndicator';
import { ContributionType, GithubUser } from '@/types/github';
import { useParams } from 'next/navigation';
import { ApiStatusProvider, useApiStatus } from '@/context/ApiStatusContext';
import { useUserData } from '@/hooks/useUserData';
import { MockRepository, MockUser } from '@/types/mock';


// Note on API Integration:
// Four API endpoints are now integrated:
// 1. http://localhost:8080/api/users/{username} - For user profile data
// 2. http://localhost:8080/api/u/{username}/tech-analysis - For technical profile data
// 3. http://localhost:8080/api/u/{username}/readme-analysis - For README documentation analysis
// 4. http://localhost:8080/api/u/{username}/code-analysis - For code analysis metrics
//
// These endpoints are accessed through custom hooks in the components:
// - useUserData in DashboardContent (main hook for user data)
// - useTechAnalysis in DashboardTechnicalTab
// - useReadmeAnalysis in DashboardSkillProgressionTab
// - useCodeAnalysis in DashboardRepositoriesTab
//
// Each hook includes fallback to mock data if the API is unavailable

function DashboardContent() {
  const params = useParams();
  const username = typeof params.username === 'string' ? params.username : '';
  const { userApiStatus, techApiStatus, readmeApiStatus } = useApiStatus();
  const { data: userData, isLoading } = useUserData(username);
  
  // Use API data if available, otherwise fall back to mock data
  const user: GithubUser | MockUser = userData || (dashboardMockData.user as MockUser);
  const repos = userData?.repositories || (dashboardMockData.repositories as any[]);
  const primaryRepo = repos[0];

  // Extract contribution counts from either API data or mock data
  const pullRequests = userData 
    ? userData.contributions.find(c => c.type === ContributionType.PULL_REQUEST)?.count || 0
    : dashboardMockData.user.contributions.find(c => c.type === "PULL_REQUEST")?.count || 0;
  
  const issues = userData
    ? userData.contributions.find(c => c.type === ContributionType.ISSUE)?.count || 0
    : dashboardMockData.user.contributions.find(c => c.type === "ISSUE")?.count || 0;
  
  const commits = userData
    ? userData.contributions.find(c => c.type === ContributionType.COMMIT)?.count || 0
    : dashboardMockData.user.contributions.find(c => c.type === "COMMIT")?.count || 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b sticky top-0 z-10 bg-background">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Analytica</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
              ) : (
                <Image 
                  src={userData?.avatarUrl || ('profilePicture' in user ? user.profilePicture : '')} 
                  alt={userData?.name ? String(userData.name) : ('name' in user ? String(user.name) : 'User')} 
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full" 
                />
              )}
              <span className="font-medium">{userData?.name || ('name' in user ? user.name : 'User')}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <ApiStatusIndicator 
          userApiStatus={userApiStatus}
          techApiStatus={techApiStatus} 
          readmeApiStatus={readmeApiStatus} 
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                {isLoading ? (
                  <div className="w-24 h-24 rounded-full bg-muted animate-pulse mb-4"></div>
                ) : (
                  <Image 
                    src={userData?.avatarUrl || ('profilePicture' in user ? user.profilePicture : '')} 
                    alt={userData?.name ? String(userData.name) : ('name' in user ? String(user.name) : 'User')} 
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full mb-4" 
                  />
                )}
                <h2 className="text-xl font-bold">{userData?.name || ('name' in user ? user.name : 'User')}</h2>
                <p className="text-sm text-muted-foreground mb-1">
                  @{userData?.githubUsername || ('username' in user ? user.username : 'user')}
                </p>
                <p className="text-sm mb-4">{userData?.bio || ('bio' in user ? user.bio : '')}</p>
                <div className="flex gap-4 justify-center">
                  <div className="text-center">
                    <p className="font-bold">{userData?.followersCount || user.followersCount}</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold">{userData?.followingCount || user.followingCount}</p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold">{userData?.totalContributions || user.totalContributions}</p>
                    <p className="text-xs text-muted-foreground">Contributions</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Contribution Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                  <GitPullRequestIcon className="h-8 w-8 mb-2 text-blue-500" />
                  <p className="text-xl font-bold">{pullRequests}</p>
                  <p className="text-sm text-muted-foreground">Pull Requests</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                  <MessageSquareIcon className="h-8 w-8 mb-2 text-green-500" />
                  <p className="text-xl font-bold">{issues}</p>
                  <p className="text-sm text-muted-foreground">Issues</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                  <GitBranchIcon className="h-8 w-8 mb-2 text-purple-500" />
                  <p className="text-xl font-bold">{commits}</p>
                  <p className="text-sm text-muted-foreground">Commits</p>
                </div>
              </div>
              {primaryRepo && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Top Repository: {primaryRepo.name}</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm">{primaryRepo.stargazerCount}</span>
                    </div>
                    <div className="flex items-center">
                      <GitForkIcon className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="text-sm">{primaryRepo.forkCount}</span>
                    </div>
                    {primaryRepo.language && (
                      <div className="flex items-center">
                        <span className="text-xs px-2 py-1 bg-muted rounded-full">{primaryRepo.language}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 w-full">
            <TabsTrigger value="profile">User Profile</TabsTrigger>
            <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
            <TabsTrigger value="repositories">Repositories</TabsTrigger>
            <TabsTrigger value="code-quality">Code Quality</TabsTrigger>
            <TabsTrigger value="technical">Technical Profile</TabsTrigger>
            <TabsTrigger value="progression">Skill Progression</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <DashboardProfileTab 
              user={userData || {
                id: parseInt(typeof user.id === 'string' ? user.id : String(user.id)),
                githubUsername: 'username' in user ? user.username : (user as GithubUser).githubUsername,
                name: 'name' in user ? user.name : (user as GithubUser).name,
                email: 'email' in user ? user.email : (user as GithubUser).email,
                avatarUrl: 'profilePicture' in user ? user.profilePicture : (user as GithubUser).avatarUrl,
                bio: 'bio' in user ? user.bio : (user as GithubUser).bio,
                followersCount: user.followersCount,
                followingCount: user.followingCount,
                publicReposCount: user.publicReposCount,
                totalContributions: user.totalContributions,
                lastUpdated: new Date(),
                repositories: repos.map(repo => ({
                  id: repo.id,
                  name: repo.name,
                  description: repo.description || null,
                  stargazerCount: repo.stargazerCount,
                  forkCount: repo.forkCount,
                  language: repo.language || null,
                  updatedAt: repo.updatedAt,
                })),
                contributions: 'contributions' in user ? 
                  user.contributions.map(c => ({
                    id: c.id.toString(),
                    date: c.date,
                    count: c.count,
                    type: c.type as ContributionType
                  })) :
                  (user as GithubUser).contributions
              }}
            />
          </TabsContent>

          <TabsContent value="collaboration">
            <DashboardCollaborationTab 
              collaborationMetrics={{
                teamCollaborationScore: ('collaborationMetrics' in user && user.collaborationMetrics?.teamCollaborationScore) || 0,
                codeReviewParticipation: ('collaborationMetrics' in user && user.collaborationMetrics?.codeReviewParticipation) || 0,
                issueResolutionRate: ('collaborationMetrics' in user && user.collaborationMetrics?.issueResolutionRate) || 0,
                avgResponseTime: ('collaborationMetrics' in user && user.collaborationMetrics?.avgResponseTime) || 0
              }}
              communityEngagement={{
                discussionParticipation: ('communityEngagementMetrics' in user && user.communityEngagementMetrics?.discussionParticipation) || 0,
                issueResponses: ('communityEngagementMetrics' in user && user.communityEngagementMetrics?.issueResponses) || 0,
                pullRequestsReviewed: ('communityEngagementMetrics' in user && user.communityEngagementMetrics?.pullRequestsReviewed) || 0,
                avgReviewQuality: ('communityEngagementMetrics' in user && user.communityEngagementMetrics?.avgReviewQuality) || 0,
                helpfulnessRating: ('communityEngagementMetrics' in user && user.communityEngagementMetrics?.helpfulnessRating) || 0,
                soloVsTeamScore: ('collaborationStyleMetrics' in user && user.collaborationStyleMetrics?.soloVsTeamScore) || 0
              }}
            />
          </TabsContent>

          <TabsContent value="repositories">
            <DashboardRepositoriesTab 
              repos={repos.map(repo => ({
                id: repo.id,
                name: repo.name,
                description: repo.description || "",
                language: repo.language || "",
                stargazerCount: repo.stargazerCount,
                forkCount: repo.forkCount,
              }))} 
              primaryRepo={{
                title: primaryRepo?.name || "Analytica_frontend",
                codeMetrics: {
                  ...((primaryRepo && 'codeMetrics' in primaryRepo && primaryRepo.codeMetrics) ? primaryRepo.codeMetrics : {}),
                  languageDistribution: Object.entries(
                    (primaryRepo && 'codeMetrics' in primaryRepo && primaryRepo.codeMetrics?.languageDistribution) || {}
                  ).reduce(
                    (acc, [key, value]) => value !== undefined ? { ...acc, [key]: value as number } : acc, 
                    {} as Record<string, number>
                  ),
                  totalLines: (primaryRepo && 'codeMetrics' in primaryRepo && primaryRepo.codeMetrics?.totalLines) || 0,
                  avgFileSize: (primaryRepo && 'codeMetrics' in primaryRepo && primaryRepo.codeMetrics?.avgFileSize) || 0,
                  complexityMetrics: {
                    score: (primaryRepo && 'codeMetrics' in primaryRepo && primaryRepo.codeMetrics?.complexityMetrics?.score) || 0,
                    fileCount: (primaryRepo && 'codeMetrics' in primaryRepo && primaryRepo.codeMetrics?.complexityMetrics?.fileCount) || 0,
                    folderCount: (primaryRepo && 'codeMetrics' in primaryRepo && primaryRepo.codeMetrics?.complexityMetrics?.folderCount) || 0,
                    dependencyCount: (primaryRepo && 'codeMetrics' in primaryRepo && primaryRepo.codeMetrics?.complexityMetrics?.dependencyCount) || 0
                  }
                }
              }}
            />
          </TabsContent>

          <TabsContent value="code-quality">
            <DashboardCodeQualityTab 
              codeQualityStats={{
                overallScore: 85,
                maintainabilityScore: dashboardMockData.codeQualityStats?.avgCommitQuality || 0,
                readabilityScore: dashboardMockData.codeQualityStats?.codeOrganizationScore || 0,
                efficiencyScore: 78,
                modularityScore: 82,
                testCoverage: dashboardMockData.codeQualityStats?.testCoverage || 0,
                codeReviewStats: [],
                recentImprovements: []
              }}
              documentationStats={{
                coverage: dashboardMockData.documentationStats?.inlineDocumentationCoverage || 0
              }}
            />
          </TabsContent>

          <TabsContent value="technical">
            <DashboardTechnicalTab 
              technicalProfile={{
                languageSpecificFields: (dashboardMockData.technicalProfile?.languageSpecificFields || []).map(field => ({
                  name: field.name,
                  category: field.category as 'LANGUAGE' | 'FRAMEWORK' | 'LIBRARY' | 'TOOL',
                  firstUsed: field.firstUsed,
                  lastUsed: field.lastUsed,
                  frequency: parseFloat(field.frequency.toString()),
                  projectCount: field.projectCount,
                  proficiencyLevel: field.proficiencyLevel.toUpperCase() as 'EXPERT' | 'ADVANCED' | 'INTERMEDIATE' | 'BEGINNER',
                  linesOfCode: field.linesOfCode,
                  yearsOfExperience: field.yearsOfExperience,
                  trend: parseFloat(field.trend.toString()),
                  fileCount: field.fileCount,
                  percentageOfCodebase: field.percentageOfCodebase
                }))
              }}
              developerImpactMetrics={dashboardMockData.developerImpactMetrics}
              repositoryAnalytics={dashboardMockData.repositoryAnalytics}
            />
          </TabsContent>

          <TabsContent value="progression">
            <DashboardSkillProgressionTab 
              skillProgressionMetrics={{
                newTechnologiesAdoptedByYear: dashboardMockData.skillProgressionMetrics?.newTechnologiesAdoptedByYear || 0,
                learningRate: dashboardMockData.skillProgressionMetrics?.learningRate || 0,
                experimentationRate: dashboardMockData.skillProgressionMetrics?.experimentationRate || 0,
                lastUpdated: dashboardMockData.skillProgressionMetrics?.lastUpdated || new Date().toISOString(),
                recommendations: dashboardMockData.skillProgressionMetrics?.recommendations || []
              }}
              languageProgressions={(dashboardMockData.languageProgressions || []).map(lang => ({
                ...lang,
                proficiencyLevel: lang.proficiencyLevel?.toUpperCase() as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
              }))}
              technologyProgressions={dashboardMockData.technologyProgressions || []}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  const params = useParams();
  const username = typeof params.username === 'string' ? params.username : '';
  
  return (
    <ApiStatusProvider username={username}>
      <DashboardContent />
    </ApiStatusProvider>
  );
}
