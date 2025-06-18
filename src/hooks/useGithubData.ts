import { useState, useEffect } from 'react';
import { 
  fetchTechAnalysis, 
  fetchReadmeAnalysis,
  fetchCodeAnalysis,
  TechAnalysisResponse,
  ReadmeAnalysis,
  CodeAnalysisItem,
  fallbackTechAnalysis,
  fallbackReadmeAnalysis,
  fallbackCodeAnalysis
} from '@/lib/api-client';

// Custom hook for tech analysis with fallback
export function useTechAnalysis(username: string) {
  const [data, setData] = useState<TechAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const result = await fetchTechAnalysis(username);
        setData(result);
        setError(null);
      } catch (error) {
        console.error('Error in useTechAnalysis:', error);
        setData(fallbackTechAnalysis);
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }

    if (username) {
      loadData();
    } else {
      setData(fallbackTechAnalysis);
      setIsLoading(false);
    }
  }, [username]);

  return { data, isLoading, error, isUsingFallback: error !== null };
}

// Custom hook for readme analysis with fallback
export function useReadmeAnalysis(username: string) {
  const [data, setData] = useState<ReadmeAnalysis[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const result = await fetchReadmeAnalysis(username);
        setData(result);
        setError(null);
      } catch (error) {
        console.error('Error in useReadmeAnalysis:', error);
        setData(fallbackReadmeAnalysis);
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }

    if (username) {
      loadData();
    } else {
      setData(fallbackReadmeAnalysis);
      setIsLoading(false);
    }
  }, [username]);

  return { data, isLoading, error, isUsingFallback: error !== null };
}

// Custom hook for code analysis with fallback
export function useCodeAnalysis(username: string) {
  const [data, setData] = useState<CodeAnalysisItem[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const result = await fetchCodeAnalysis(username);
        setData(result);
        setError(null);
      } catch (error) {
        console.error('Error in useCodeAnalysis:', error);
        setData(fallbackCodeAnalysis);
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }

    if (username) {
      loadData();
    } else {
      setData(fallbackCodeAnalysis);
      setIsLoading(false);
    }
  }, [username]);

  return { data, isLoading, error, isUsingFallback: error !== null };
}
