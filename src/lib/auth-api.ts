import { getSession } from "next-auth/react";

export async function makeAuthenticatedRequest(url: string, options: RequestInit = {}) {

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
        const backendUrl = process.env.NEXT_PUBLIC_SPRING_BOOT_BACKEND_URL || 'http://localhost:8080';
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

// Specific function for backend API calls with automatic JWT inclusion
export async function backendApiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const session = await getSession();

    if (!session?.backendJWT) {
        throw new Error('No backend JWT token available');
    }

    const backendUrl = process.env.NEXT_PUBLIC_SPRING_BOOT_BACKEND_URL || 'http://localhost:8080';
    const url = endpoint.startsWith('http') ? endpoint : `${backendUrl}${endpoint}`;

    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.backendJWT}`,
        ...(options.headers as Record<string, string> || {}),
    };

    const response = await fetch(url, {
        ...options,
        headers: defaultHeaders,
    });

    if (response.status === 401) {
        throw new Error('Backend authentication failed - JWT may be expired');
    }

    if (!response.ok) {
        throw new Error(`Backend API request failed: ${response.statusText}`);
    }

    return response.json();
}
