import { getSession } from "next-auth/react";

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshJWT(): Promise<boolean> {
    if (isRefreshing && refreshPromise) {
        return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = (async () => {
        try {
            const response = await fetch('/api/auth/refresh-jwt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                // Force NextAuth to refetch the session with new tokens
                const event = new Event('visibilitychange');
                document.dispatchEvent(event);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error refreshing JWT:', error);
            return false;
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

export async function makeAuthenticatedRequest(url: string, options: RequestInit = {}, retryCount = 0): Promise<Response> {
    const session = await getSession();

    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    if (session?.backendJWT) {
        defaultHeaders['Authorization'] = `Bearer ${session.backendJWT}`;
    }

    const response = await fetch(url, {
        ...options,
        headers: defaultHeaders,
        credentials: 'include',
    });

    // If we get a 401 and haven't retried yet, try to refresh the JWT
    if (response.status === 401 && retryCount === 0 && session?.refreshToken) {
        const refreshSuccess = await refreshJWT();

        if (refreshSuccess) {
            // Retry the request with new JWT
            return makeAuthenticatedRequest(url, options, 1);
        }
    }

    if (response.status === 401) {
        throw new Error('Authentication required');
    }

    return response;
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Ensure the endpoint starts with the backend URL for backend calls
    let url = endpoint;
    if (endpoint.startsWith('/api/') && !endpoint.startsWith('/api/auth/')) {
        // This is a backend API call, prepend the backend URL
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        url = `${backendUrl}${endpoint}`;
    } else if (!endpoint.startsWith('http')) {
        // This is a frontend API call
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
        url = `${baseURL}${endpoint}`;
    }

    const response = await makeAuthenticatedRequest(url, options);

    if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
}

// Specific function for backend API calls with automatic JWT inclusion and refresh
export async function backendApiRequest<T>(endpoint: string, options: RequestInit = {}, retryCount = 0): Promise<T> {
    const session = await getSession();

    if (!session?.backendJWT) {
        throw new Error('No backend JWT token available');
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const url = endpoint.startsWith('http') ? endpoint : `${backendUrl}${endpoint}`;

    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.backendJWT}`,
        ...(options.headers as Record<string, string> || {}),
    };

    const response = await fetch(url, {
        ...options,
        headers: defaultHeaders,
        credentials: 'include',
    });

    // If we get a 401 and haven't retried yet, try to refresh the JWT
    if (response.status === 401 && retryCount === 0 && session?.refreshToken) {
        const refreshSuccess = await refreshJWT();

        if (refreshSuccess) {
            // Retry the request with new JWT
            return backendApiRequest<T>(endpoint, options, 1);
        }
        throw new Error('Backend authentication failed - JWT refresh failed');
    }

    if (response.status === 401) {
        throw new Error('Backend authentication failed - JWT may be expired');
    }

    if (!response.ok) {
        throw new Error(`Backend API request failed: ${response.statusText}`);
    }

    return response.json();
}
