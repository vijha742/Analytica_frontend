import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_TTL_SECONDS } from '@/constants/app';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
    try {
        // Get refreshToken from cookies
        const refreshToken = request.cookies.get('refreshToken')?.value;
        if (!refreshToken) {
            return NextResponse.json({ error: 'No refresh token found' }, { status: 401 });
        }

        // Call backend to refresh JWT - backend expects refreshToken as cookie
        const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-jwt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `refreshToken=${refreshToken}`
            }
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
                maxAge: TOKEN_TTL_SECONDS.JWT,
                path: '/'
            });
        }
        if (backendData.refreshToken) {
            response.cookies.set('refreshToken', backendData.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: TOKEN_TTL_SECONDS.REFRESH_TOKEN,
                path: '/'
            });
        }

        return response;
    } catch (error) {
        logger.error('Error refreshing JWT:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
