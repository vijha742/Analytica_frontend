import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_request: NextRequest) {
    try {
        const response = NextResponse.json({ success: true });

        // Clear JWT cookie
        response.cookies.set('jwt', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: new Date(0),
            path: '/'
        });

        // STATE-004: Also clear the refresh token so the middleware
        // does not attempt a silent re-auth after logout.
        response.cookies.set('refreshToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: new Date(0),
            path: '/'
        });

        return response;
    } catch (error) {
        logger.error('Error clearing auth cookies:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
