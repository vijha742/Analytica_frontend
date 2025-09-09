import { useState, useEffect } from 'react';
import { getSupplementingUser } from '@/lib/api-client';
import { SupplementingUserMatch } from '@/types/github';

// Mock data for fallback when API fails or returns empty
const MOCK_DATA: SupplementingUserMatch[] = [
    {
        "matchedUser": {
            "id": "2e2f12c1-62e1-4443-957e-dc0fd612b05e",
            "githubUsername": "vijha742",
            "name": "Vikas Jha",
            "avatarUrl": "https://avatars.githubusercontent.com/u/143775545?v=4",
            "bio": "Goofing around computer coding my quirks, lurking about books, writing stories, quotes all are my hobbies. B.Tech @ SDIET ",
            "followersCount": 14,
            "followingCount": 20,
            "publicReposCount": 21,
            "totalContributions": 365,
            "createdAt": "2023-09-01",
            "teams": [
                "Classmates",
                "Friends",
                "Colleagues"
            ],
            "technicalProfile": {
                "primaryLanguages": [
                    {
                        "language": "TypeScript",
                        "linesOfCode": 6013,
                        "yearsOfExperience": 0.25188228,
                        "lastUsed": "2025-08-18T10:23:55Z",
                        "firstUsed": "2025-05-18T06:17:57Z",
                        "proficiencyLevel": "BEGINNER",
                        "projectCount": 1,
                        "trendIndicator": "STABLE"
                    },
                    {
                        "language": "Java",
                        "linesOfCode": 15618,
                        "yearsOfExperience": 0.52019167,
                        "lastUsed": "2025-08-18T12:14:46Z",
                        "firstUsed": "2024-04-14T19:22:46Z",
                        "proficiencyLevel": "BEGINNER",
                        "projectCount": 9,
                        "trendIndicator": "STABLE"
                    },
                    {
                        "language": "JavaScript",
                        "linesOfCode": 10083,
                        "yearsOfExperience": 0.5831622,
                        "lastUsed": "2025-08-18T10:23:55Z",
                        "firstUsed": "2024-08-21T03:34:32Z",
                        "proficiencyLevel": "BEGINNER",
                        "projectCount": 3,
                        "trendIndicator": "STABLE"
                    }
                ],
                "frameworksUsed": [],
                "librariesUsed": [],
                "toolingPreferences": [],
                "specializationScore": 0.44897372,
                "versatilityScore": 0.6,
                "learningRate": 0.0,
                "experimentationFrequency": 0.0
            },
            "userTech": {
                "projectTimeList": [],
                "technologyUsageList": [
                    {
                        "name": "TypeScript",
                        "firstUsed": "2025-05-18",
                        "lastUsed": "2025-08-18",
                        "frequency": 0.0,
                        "projectCount": 1
                    },
                    {
                        "name": "Java",
                        "firstUsed": "2024-04-14",
                        "lastUsed": "2025-08-18",
                        "frequency": 0.0,
                        "projectCount": 9
                    }
                ]
            },
            "lastUpdated": "2025-08-18T14:02:22.538415Z"
        },
        "matchScore": 0.9999999999999999
    },
    {
        "matchedUser": {
            "id": "594396f1-f5ec-40fe-9903-c51c1b8f0511",
            "githubUsername": "iamchirag06",
            "name": "Chirag Singh",
            "avatarUrl": "https://avatars.githubusercontent.com/u/161302248?v=4",
            "bio": "Currently pursuing BTech Computer Science from Satyug Darshan Institute of Engineering and Technology (SDIET)",
            "followersCount": 9,
            "followingCount": 23,
            "publicReposCount": 13,
            "totalContributions": 124,
            "createdAt": "2024-02-26",
            "teams": [
                "Classmates",
                "Friends",
                "Colleagues"
            ],
            "technicalProfile": {
                "primaryLanguages": [
                    {
                        "language": "TypeScript",
                        "linesOfCode": 3519,
                        "yearsOfExperience": 0.0,
                        "lastUsed": "2025-05-30T10:03:05Z",
                        "firstUsed": "2025-05-30T09:58:29Z",
                        "proficiencyLevel": "BEGINNER",
                        "projectCount": 1,
                        "trendIndicator": "STABLE"
                    },
                    {
                        "language": "Java",
                        "linesOfCode": 2730,
                        "yearsOfExperience": 0.54757017,
                        "lastUsed": "2025-08-17T14:35:52Z",
                        "firstUsed": "2024-12-10T15:04:30Z",
                        "proficiencyLevel": "BEGINNER",
                        "projectCount": 6,
                        "trendIndicator": "STABLE"
                    },
                    {
                        "language": "JavaScript",
                        "linesOfCode": 4307,
                        "yearsOfExperience": 0.5831622,
                        "lastUsed": "2025-05-30T10:03:05Z",
                        "firstUsed": "2024-08-21T03:34:32Z",
                        "proficiencyLevel": "BEGINNER",
                        "projectCount": 4,
                        "trendIndicator": "STABLE"
                    }
                ],
                "frameworksUsed": [],
                "librariesUsed": [],
                "toolingPreferences": [],
                "specializationScore": 0.39578077,
                "versatilityScore": 0.6,
                "learningRate": 0.0,
                "experimentationFrequency": 0.0
            },
            "userTech": {
                "projectTimeList": [],
                "technologyUsageList": [
                    {
                        "name": "TypeScript",
                        "firstUsed": "2025-05-30",
                        "lastUsed": "2025-05-30",
                        "frequency": 0.0,
                        "projectCount": 1
                    },
                    {
                        "name": "Java",
                        "firstUsed": "2024-12-10",
                        "lastUsed": "2025-08-17",
                        "frequency": 0.0,
                        "projectCount": 6
                    }
                ]
            },
            "lastUpdated": "2025-08-18T14:11:01.816271Z"
        },
        "matchScore": 0.4294388102036982
    }
];

export function useSupplementingUsers() {
    const [matches, setMatches] = useState<SupplementingUserMatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUsingMockData, setIsUsingMockData] = useState(false);

    const fetchMatches = async () => {
        try {
            setLoading(true);
            setError(null);
            setIsUsingMockData(false);

            const data = await getSupplementingUser();

            if (data && data.length > 0) {
                setMatches(data);
            } else {
                // Use mock data if API returns empty array
                console.warn('API returned no data, using mock data');
                setMatches(MOCK_DATA);
                setIsUsingMockData(true);
            }
        } catch (err) {
            console.warn('API call failed, using mock data:', err);
            setMatches(MOCK_DATA);
            setIsUsingMockData(true);
            setError('Using sample data - API unavailable');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, []);

    return {
        matches,
        loading,
        error,
        isUsingMockData,
        refetch: fetchMatches,
        currentUser: matches[0]?.matchedUser,
        otherMatches: matches.slice(1),
    };
}
