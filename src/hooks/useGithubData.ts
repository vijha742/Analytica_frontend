import { useState, useEffect } from 'react';
import {
    fetchTechAnalysis,
    fetchReadmeAnalysis,
    fetchCodeAnalysis,
} from '@/lib/api-client';
import {
    TechAnalysis,
    ReadmeAnalysis,
    CodeAnalysis,
} from '@/types/github';

export function useTechAnalysis(username: string) {
    const [data, setData] = useState<TechAnalysis | null>(null);
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
                setData(null);
                setError(error instanceof Error ? error : new Error('Unknown error'));
            } finally {
                setIsLoading(false);
            }
        }

        if (username) {
            loadData();
        } else {
            setData(null);
            setIsLoading(false);
        }
    }, [username]);

    return { data, isLoading, error, isUsingFallback: error !== null };
}

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
                setData(null);
                setError(error instanceof Error ? error : new Error('Unknown error'));
            } finally {
                setIsLoading(false);
            }
        }

        if (username) {
            loadData();
        } else {
            setData(null);
            setIsLoading(false);
        }
    }, [username]);

    return { data, isLoading, error, isUsingFallback: error !== null };
}

export function useCodeAnalysis(username: string) {
    const [data, setData] = useState<CodeAnalysis[] | null>(null);
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
                setData(null);
                setError(error instanceof Error ? error : new Error('Unknown error'));
            } finally {
                setIsLoading(false);
            }
        }

        if (username) {
            loadData();
        } else {
            setData(null);
            setIsLoading(false);
        }
    }, [username]);

    return { data, isLoading, error, isUsingFallback: error !== null };
}
