"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTechAnalysis, useReadmeAnalysis } from '@/hooks/useGithubData';
import { useUserData } from '@/hooks/useUserData';

export type ApiStatus = 'connected' | 'fallback' | 'error';

interface ApiStatusContextType {
    userApiStatus: ApiStatus;
    techApiStatus: ApiStatus;
    readmeApiStatus: ApiStatus;
    setUserApiStatus: (status: ApiStatus) => void;
    setTechApiStatus: (status: ApiStatus) => void;
    setReadmeApiStatus: (status: ApiStatus) => void;
}

const ApiStatusContext = createContext<ApiStatusContextType>({
    userApiStatus: 'fallback',
    techApiStatus: 'fallback',
    readmeApiStatus: 'fallback',
    setUserApiStatus: () => { },
    setTechApiStatus: () => { },
    setReadmeApiStatus: () => { },
});

export const useApiStatus = () => useContext(ApiStatusContext);

export function ApiStatusProvider({
    children,
    username
}: {
    children: React.ReactNode;
    username: string;
}) {
    const [userApiStatus, setUserApiStatus] = useState<ApiStatus>('fallback');
    const [techApiStatus, setTechApiStatus] = useState<ApiStatus>('fallback');
    const [readmeApiStatus, setReadmeApiStatus] = useState<ApiStatus>('fallback');

    const { isUsingFallback: userUsingFallback, error: userError } = useUserData(username);
    const { isUsingFallback: techUsingFallback, error: techError } = useTechAnalysis(username);
    const { isUsingFallback: readmeUsingFallback, error: readmeError } = useReadmeAnalysis(username);

    useEffect(() => {
        if (userError) {
            setUserApiStatus('error');
        } else if (userUsingFallback) {
            setUserApiStatus('fallback');
        } else {
            setUserApiStatus('connected');
        }

        if (techError) {
            setTechApiStatus('error');
        } else if (techUsingFallback) {
            setTechApiStatus('fallback');
        } else {
            setTechApiStatus('connected');
        }

        if (readmeError) {
            setReadmeApiStatus('error');
        } else if (readmeUsingFallback) {
            setReadmeApiStatus('fallback');
        } else {
            setReadmeApiStatus('connected');
        }
    }, [userUsingFallback, userError, techUsingFallback, techError, readmeUsingFallback, readmeError]);

    return (
        <ApiStatusContext.Provider
            value={{
                userApiStatus,
                techApiStatus,
                readmeApiStatus,
                setUserApiStatus,
                setTechApiStatus,
                setReadmeApiStatus
            }}
        >
            {children}
        </ApiStatusContext.Provider>
    );
}
