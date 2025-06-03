export const dashboardMockData = {
  user: {
    id: '12345',
    name: 'Vikas Kumar',
    username: 'vikaskumar',
    email: 'vikas@example.com',
    profilePicture: 'https://avatars.githubusercontent.com/u/12345678',
    bio: 'Full-stack developer passionate about creating intuitive and scalable applications',
    followersCount: 248,
    followingCount: 132,
    totalContributions: 1824,
    publicReposCount: 42,
    contributions: 
      [{
        id: 1232,
        date: "28-06-2025 16:48:56",
        count: 1386,
        type: "COMMIT",
      },{
        id: 1233,
        date: "28-06-2025 16:48:56",
        count: 176,
        type: "ISSUE",
      },{
        id: 1234,
        date: "28-06-2025 16:48:56",
        count: 284,
        type: "PULL_REQUEST",
      }
      ],
    collaborationMetrics: {
      teamCollaborationScore: 87,
      codeReviewParticipation: 78,
      issueResolutionRate: 92,
      avgResponseTime: 8.5
    },
    collaborationStyleMetrics: {
      pullRequestsCreated: 284,
      pullRequestReviewed: 312,
      issueCreated: 176,
      issueResolved: 162,
      contributedRepositoryCount: 28,
      ownRepositoriesCount: 42,
      codeReviewParticipation: 78,
      issueReviewParticipation: 65,
      soloVsTeamScore: 68,
      communityCollaborationScore: 76,
      mainlyMaintainer: false
    },
    communityEngagementMetrics: {
      discussionParticipation: 124,
      issueResponses: 248,
      pullRequestsReviewed: 312,
      avgReviewQuality: 8.7,
      helpfulnessRating: 9.2
    }
  },
  repositories: [
    {
      id: 1,
      name: 'analytics-dashboard',
      description: 'A comprehensive analytics dashboard for developers',
      language: 'TypeScript',
      stargazerCount: 128,
      forkCount: 45,
      isPrivate: false,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2025-05-20T14:22:00Z',
      topics: ['analytics', 'dashboard', 'typescript', 'react'],
      codeMetrics: {
        totalLines: 15230,
        avgFileSize: 245,
        languageDistribution: {
          'TypeScript': 70,
          'JavaScript': 15,
          'CSS': 10,
          'HTML': 5
        },
        complexityMetrics: {
          score: 68,
          factorsUsed: ['Cyclomatic Complexity', 'Nesting Depth', 'Function Length'],
          size: 15230,
          fileCount: 62,
          folderCount: 14,
          dependencyCount: 24,
          fileTypesDistribution: {
            '.tsx': 40,
            '.ts': 30,
            '.css': 20,
            '.html': 10
          },
          languageFileCount: {
            'TypeScript': 45,
            'JavaScript': 8,
            'CSS': 6,
            'HTML': 3
          },
          primaryLanguage: 'TypeScript'
        }
      },
      codeQuality: {
        codeQualityIndicators: ['Good Test Coverage', 'Consistent Style', 'Few Code Smells'],
        codeOrganizationScore: 85,
        avgCommitMessageLength: 72,
        conventionalCommitsPercentage: 92,
        commentToCodeRatio: 0.18,
        lastUpdated: '2025-05-20T14:22:00Z',
        testCoverage: 78
      },
      licenseInfo: {
        name: 'MIT License',
        spdxId: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      },
      readmeInfo: {
        score: 92,
        lastUpdated: '2025-04-15T09:18:00Z',
        wordCount: 1250,
        hasIntro: true,
        hasInstallationGuide: true,
        hasUsageExamples: true,
        hasMaintainerInfo: true
      }
    },
    {
      id: 2,
      name: 'api-gateway-service',
      description: 'A microservice API gateway with authentication and rate limiting',
      language: 'Go',
      stargazerCount: 324,
      forkCount: 87,
      isPrivate: false,
      createdAt: '2023-08-22T08:45:00Z',
      updatedAt: '2025-04-10T11:32:00Z',
      topics: ['microservices', 'api-gateway', 'golang', 'authentication'],
      codeMetrics: {
        totalLines: 8732,
        avgFileSize: 178,
        languageDistribution: {
          'Go': 92,
          'YAML': 6,
          'Shell': 2
        },
        complexityMetrics: {
          score: 54,
          factorsUsed: ['Cyclomatic Complexity', 'Function Length', 'Interface Count'],
          size: 8732,
          fileCount: 49,
          folderCount: 8,
          dependencyCount: 16,
          fileTypesDistribution: {
            '.go': 85,
            '.yaml': 10,
            '.sh': 5
          },
          languageFileCount: {
            'Go': 42,
            'YAML': 5,
            'Shell': 2
          },
          primaryLanguage: 'Go'
        }
      },
      codeQuality: {
        codeQualityIndicators: ['Well-Tested', 'Consistent Error Handling', 'Clean Interfaces'],
        codeOrganizationScore: 92,
        avgCommitMessageLength: 84,
        conventionalCommitsPercentage: 97,
        commentToCodeRatio: 0.22,
        lastUpdated: '2025-04-10T11:32:00Z',
        testCoverage: 87
      },
      licenseInfo: {
        name: 'Apache License 2.0',
        spdxId: 'Apache-2.0',
        url: 'https://opensource.org/licenses/Apache-2.0'
      },
      readmeInfo: {
        score: 88,
        lastUpdated: '2025-03-22T14:10:00Z',
        wordCount: 1450,
        hasIntro: true,
        hasInstallationGuide: true,
        hasUsageExamples: true,
        hasMaintainerInfo: false
      }
    },
    {
      id: 3,
      name: 'ml-workflow-pipeline',
      description: 'End-to-end machine learning workflow pipeline with automated training and deployment',
      language: 'Python',
      stargazerCount: 256,
      forkCount: 63,
      isPrivate: false,
      createdAt: '2024-03-10T15:20:00Z',
      updatedAt: '2025-05-28T09:45:00Z',
      topics: ['machine-learning', 'mlops', 'pipeline', 'python', 'automation'],
      codeMetrics: {
        totalLines: 12380,
        avgFileSize: 210,
        languageDistribution: {
          'Python': 82,
          'YAML': 10,
          'Jupyter Notebook': 5,
          'Shell': 3
        },
        complexityMetrics: {
          score: 62,
          factorsUsed: ['Cyclomatic Complexity', 'Function Length', 'Class Hierarchy Depth'],
          size: 12380,
          fileCount: 59,
          folderCount: 12,
          dependencyCount: 28,
          fileTypesDistribution: {
            '.py': 75,
            '.yaml': 12,
            '.ipynb': 8,
            '.sh': 5
          },
          languageFileCount: {
            'Python': 48,
            'YAML': 6,
            'Jupyter Notebook': 3,
            'Shell': 2
          },
          primaryLanguage: 'Python'
        }
      },
      codeQuality: {
        codeQualityIndicators: ['Well-Documented', 'Type Hints', 'Comprehensive Tests'],
        codeOrganizationScore: 78,
        avgCommitMessageLength: 68,
        conventionalCommitsPercentage: 85,
        commentToCodeRatio: 0.24,
        lastUpdated: '2025-05-28T09:45:00Z',
        testCoverage: 82
      },
      licenseInfo: {
        name: 'MIT License',
        spdxId: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      },
      readmeInfo: {
        score: 94,
        lastUpdated: '2025-05-15T08:30:00Z',
        wordCount: 1850,
        hasIntro: true,
        hasInstallationGuide: true,
        hasUsageExamples: true,
        hasMaintainerInfo: true
      }
    },
    {
      id: 4,
      name: 'react-component-library',
      description: 'A modern React component library with TypeScript support and Storybook documentation',
      language: 'TypeScript',
      stargazerCount: 187,
      forkCount: 42,
      isPrivate: false,
      createdAt: '2023-11-05T12:15:00Z',
      updatedAt: '2025-05-10T16:20:00Z',
      topics: ['react', 'components', 'ui-library', 'typescript', 'storybook'],
      codeMetrics: {
        totalLines: 9540,
        avgFileSize: 165,
        languageDistribution: {
          'TypeScript': 75,
          'CSS': 15,
          'JavaScript': 8,
          'MDX': 2
        },
        complexityMetrics: {
          score: 45,
          factorsUsed: ['Component Complexity', 'Props Count', 'Nesting Depth'],
          size: 9540,
          fileCount: 58,
          folderCount: 15,
          dependencyCount: 32,
          fileTypesDistribution: {
            '.tsx': 50,
            '.ts': 25,
            '.css': 15,
            '.js': 8,
            '.mdx': 2
          },
          languageFileCount: {
            'TypeScript': 44,
            'CSS': 8,
            'JavaScript': 4,
            'MDX': 2
          },
          primaryLanguage: 'TypeScript'
        }
      },
      codeQuality: {
        codeQualityIndicators: ['Well-Tested', 'Storybook Documentation', 'Consistent Styling'],
        codeOrganizationScore: 90,
        avgCommitMessageLength: 75,
        conventionalCommitsPercentage: 94,
        commentToCodeRatio: 0.16,
        lastUpdated: '2025-05-10T16:20:00Z',
        testCoverage: 85
      },
      licenseInfo: {
        name: 'MIT License',
        spdxId: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      },
      readmeInfo: {
        score: 96,
        lastUpdated: '2025-04-28T10:15:00Z',
        wordCount: 1620,
        hasIntro: true,
        hasInstallationGuide: true,
        hasUsageExamples: true,
        hasMaintainerInfo: true
      }
    }
  ],
  technicalProfile: {
    languageSpecificFields: [
      {
        name: 'TypeScript',
        category: 'LANGUAGE',
        firstUsed: '2019-05-10',
        lastUsed: '2025-05-30',
        frequency: 'FREQUENT',
        projectCount: 28,
        proficiencyLevel: 'EXPERT',
        linesOfCode: 128500,
        yearsOfExperience: 6,
        trend: 'INCREASING',
        fileCount: 520,
        percentageOfCodebase: 35
      },
      {
        name: 'Python',
        category: 'LANGUAGE',
        firstUsed: '2017-08-15',
        lastUsed: '2025-05-25',
        frequency: 'FREQUENT',
        projectCount: 18,
        proficiencyLevel: 'ADVANCED',
        linesOfCode: 85000,
        yearsOfExperience: 8,
        trend: 'STABLE',
        fileCount: 320,
        percentageOfCodebase: 22
      },
      {
        name: 'React',
        category: 'FRAMEWORK',
        firstUsed: '2018-03-22',
        lastUsed: '2025-05-30',
        frequency: 'VERY_FREQUENT',
        projectCount: 24,
        proficiencyLevel: 'EXPERT',
        linesOfCode: 95000,
        yearsOfExperience: 7,
        trend: 'INCREASING',
        fileCount: 380,
        percentageOfCodebase: 26
      },
      {
        name: 'Go',
        category: 'LANGUAGE',
        firstUsed: '2021-02-10',
        lastUsed: '2025-05-20',
        frequency: 'OCCASIONAL',
        projectCount: 8,
        proficiencyLevel: 'INTERMEDIATE',
        linesOfCode: 35000,
        yearsOfExperience: 4,
        trend: 'INCREASING',
        fileCount: 120,
        percentageOfCodebase: 10
      },
      {
        name: 'Docker',
        category: 'TOOL',
        firstUsed: '2020-05-15',
        lastUsed: '2025-05-28',
        frequency: 'FREQUENT',
        projectCount: 22,
        proficiencyLevel: 'ADVANCED',
        linesOfCode: 18000,
        yearsOfExperience: 5,
        trend: 'STABLE',
        fileCount: 85,
        percentageOfCodebase: 5
      },
      {
        name: 'Node.js',
        category: 'FRAMEWORK',
        firstUsed: '2018-01-10',
        lastUsed: '2025-05-30',
        frequency: 'FREQUENT',
        projectCount: 26,
        proficiencyLevel: 'EXPERT',
        linesOfCode: 78000,
        yearsOfExperience: 7,
        trend: 'STABLE',
        fileCount: 310,
        percentageOfCodebase: 20
      }
    ]
  },
  developerImpactMetrics: {
    totalStars: 965,
    totalForks: 237,
    totalWatchers: 148,
    dependentRepoCount: 42,
    communityImpactScore: 78,
    mostImpactfulRepositories: [
      { name: 'api-gateway-service', stars: 324 },
      { name: 'ml-workflow-pipeline', stars: 256 },
      { name: 'react-component-library', stars: 187 }
    ],
    starsTrend: 'INCREASING',
    forksTrend: 'INCREASING',
    specializationScore: 82,
    generalizationScore: 75,
    lastUpdated: '2025-05-30T10:15:00Z'
  },
  repositoryAnalytics: {
    totalRepositories: 42,
    activeRepositories: 28,
    abandonedRepositories: 14,
    avgProjectDuration: 186,
    completionRate: 67,
    topicsDistribution: {
      'typescript': 18,
      'react': 15,
      'api': 12,
      'python': 10,
      'machine-learning': 8,
      'node': 7,
      'docker': 6,
      'microservices': 5,
      'frontend': 5,
      'backend': 4,
      'database': 4,
      'testing': 3
    }
  },
  codeQualityStats: {
    avgCommitQuality: 8.4,
    codeOrganizationScore: 86,
    testCoverage: 82,
    maintainabilityIndex: 78
  },
  documentationStats: {
    avgReadmeScore: 88,
    wikiUsageRate: 42,
    inlineDocumentationCoverage: 68,
    documentationConsistency: 7.5
  },
  skillProgressionMetrics: {
    newTechnologiesAdoptedByYear: 8,
    learningRate: 8.5,
    experimentationRate: 7.8,
    lastUpdated: new Date().toISOString(),
    recommendations: [
      'Consider exploring Rust for systems programming',
      'Deepen knowledge of cloud-native development',
      'Focus on AI/ML integration in applications'
    ]
  },
  languageProgressions: [
    {
      name: 'TypeScript',
      category: 'LANGUAGE',
      proficiencyLevel: 'EXPERT',
      progress: 95,
      year: 2023,
      proficiencyPercentage: 95,
      growth: 12
    },
    {
      name: 'Python',
      category: 'LANGUAGE',
      proficiencyLevel: 'ADVANCED',
      progress: 85,
      year: 2022,
      proficiencyPercentage: 85,
      growth: 8
    },
    {
      name: 'Rust',
      category: 'LANGUAGE',
      proficiencyLevel: 'INTERMEDIATE',
      progress: 65,
      year: 2024,
      proficiencyPercentage: 65,
      growth: -5
    }
  ],
  technologyProgressions: [
    {
      name: 'React',
      category: 'FRAMEWORK',
      adoptionRate: 92,
      year: 2022,
      repositoryCount: 15,
      experienceLevel: 'Expert',
      lastUsed: '2025-06-03'
    },
    {
      name: 'Next.js',
      category: 'FRAMEWORK',
      adoptionRate: 88,
      year: 2023,
      repositoryCount: 12,
      experienceLevel: 'Advanced',
      lastUsed: '2025-06-03'
    },
    {
      name: 'Docker',
      category: 'TOOL',
      adoptionRate: 78,
      year: 2023,
      repositoryCount: 18,
      experienceLevel: 'Intermediate',
      lastUsed: '2025-06-02'
    }
  ]
};
