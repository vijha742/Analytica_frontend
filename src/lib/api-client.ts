// API Types based on the backend endpoints
export interface TechAnalysisLanguage {
  language: string;
  linesOfCode: number;
  yearsOfExperience: number;
  lastUsed: string;
  proficiencyLevel: string;
  projectCount: number;
  trendIndicator: string;
}

export interface TechAnalysisResponse {
  languages: TechAnalysisLanguage[];
  frameworksUsed: any[];
  librariesUsed: any[];
  toolingPreferences: any[];
  specializationScore: number;
  versatilityScore: number;
  learningRate: number;
  experimentationFrequency: number;
}

export interface LanguageDistribution {
  language: string;
  linesOfCode: number;
  percentage: number;
  fileCount: number;
}

export interface CodeAnalysisItem {
  title: string;
  totalLines: number;
  languageDistribution: LanguageDistribution[];
  averageFileSize: number;
  complexityScore: number;
  complexityFactors: string[];
}

export interface CodeAnalysisResponse {
  codeAnalysis: CodeAnalysisItem[];
}

export interface ReadmeAnalysis {
  title: string;
  score: number;
  hasIntroduction: boolean;
  hasInstallationGuide: boolean;
  hasUsageExamples: boolean;
  hasMaintainerSection: boolean;
  wordCount: number;
  lastUpdated?: string;
}

// Fallback data for tech analysis
export const fallbackTechAnalysis: TechAnalysisResponse = {
  languages: [
    {
      language: "JavaScript",
      linesOfCode: 15436,
      yearsOfExperience: 2.3,
      lastUsed: "2025-05-30T10:23:18Z",
      proficiencyLevel: "ADVANCED",
      projectCount: 8,
      trendIndicator: "RISING"
    },
    {
      language: "TypeScript",
      linesOfCode: 8732,
      yearsOfExperience: 1.7,
      lastUsed: "2025-06-02T14:37:22Z",
      proficiencyLevel: "INTERMEDIATE",
      projectCount: 5,
      trendIndicator: "RISING"
    },
    {
      language: "Python",
      linesOfCode: 6281,
      yearsOfExperience: 3.1,
      lastUsed: "2025-04-18T09:12:44Z",
      proficiencyLevel: "ADVANCED",
      projectCount: 6,
      trendIndicator: "STABLE"
    }
  ],
  frameworksUsed: [],
  librariesUsed: [],
  toolingPreferences: [],
  specializationScore: 0.72,
  versatilityScore: 0.65,
  learningRate: 0.8,
  experimentationFrequency: 0.6
};

// Fallback data for code analysis
export const fallbackCodeAnalysis: CodeAnalysisItem[] = [
  {
    title: "Analytica_frontend",
    totalLines: 2503,
    languageDistribution: [
      {
        language: "TypeScript",
        linesOfCode: 2245,
        percentage: 91.22779,
        fileCount: 4561
      },
      {
        language: "CSS",
        linesOfCode: 247,
        percentage: 8.290851,
        fileCount: 414
      },
      {
        language: "JavaScript",
        linesOfCode: 11,
        percentage: 0.48136488,
        fileCount: 24
      }
    ],
    averageFileSize: 19,
    complexityScore: 99,
    complexityFactors: [
      "Large number of files"
    ]
  },
  {
    title: "AnalyticaGithub",
    totalLines: 1510,
    languageDistribution: [
      {
        language: "Java",
        linesOfCode: 1510,
        percentage: 100.0,
        fileCount: 5000
      }
    ],
    averageFileSize: 15,
    complexityScore: 83,
    complexityFactors: [
      "Large number of files"
    ]
  }
];

// Fallback data for readme analysis
export const fallbackReadmeAnalysis: ReadmeAnalysis[] = [
  {
    title: "E-commerce Platform",
    score: 85,
    hasIntroduction: true,
    hasInstallationGuide: true,
    hasUsageExamples: true,
    hasMaintainerSection: true,
    wordCount: 1245,
    lastUpdated: "2025-05-15T11:32:40Z"
  },
  {
    title: "Weather App",
    score: 65,
    hasIntroduction: true,
    hasInstallationGuide: true,
    hasUsageExamples: false,
    hasMaintainerSection: false,
    wordCount: 620,
    lastUpdated: "2025-03-22T16:44:12Z"
  },
  {
    title: "Task Manager",
    score: 75,
    hasIntroduction: true,
    hasInstallationGuide: true,
    hasUsageExamples: true,
    hasMaintainerSection: false,
    wordCount: 830,
    lastUpdated: "2025-04-08T09:17:32Z"
  }
];

// API client functions
export async function fetchTechAnalysis(username: string): Promise<TechAnalysisResponse> {
  try {
    const response = await fetch(`http://localhost:8080/api/u/${username}/tech-analysis`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching tech analysis:', error);
    throw error;
  }
}

export async function fetchReadmeAnalysis(username: string): Promise<ReadmeAnalysis[]> {
  try {
    const response = await fetch(`http://localhost:8080/api/u/${username}/readme-analysis`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching readme analysis:', error);
    throw error;
  }
}

export async function fetchCodeAnalysis(username: string): Promise<CodeAnalysisItem[]> {
  try {
    const response = await fetch(`http://localhost:8080/api/u/${username}/code-analysis`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching code analysis:', error);
    throw error;
  }
}
