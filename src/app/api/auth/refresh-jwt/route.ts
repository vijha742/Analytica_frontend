import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Get refreshToken from cookies
        const refreshToken = request.cookies.get('refreshToken')?.value;
        if (!refreshToken) {
            return NextResponse.json({ error: 'No refresh token found' }, { status: 401 });
        }

        // Call backend to refresh JWT
        const backendResponse = await fetch(`${process.env.SPRING_BOOT_BACKEND_URL}/auth/refresh-jwt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!backendResponse.ok) {
            return NextResponse.json({ error: 'Failed to refresh JWT' }, { status: 401 });
        }

        const backendData = await backendResponse.json();
        const response = NextResponse.json({ success: true });

        // Update JWT and refreshToken cookies
        if (backendData.jwtToken) {
            response.cookies.set('jwt', backendData.jwtToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000,
                path: '/'
            });
        }
        if (backendData.refreshToken) {
            response.cookies.set('refreshToken', backendData.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/'
            });
        }

        return response;
    } catch (error) {
        console.error('Error refreshing JWT:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
