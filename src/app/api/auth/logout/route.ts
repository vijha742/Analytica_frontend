import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const response = NextResponse.json({ success: true });

        response.cookies.set('jwt', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: new Date(0),
            path: '/'
        });

        return response;
    } catch (error) {
        console.error('Error clearing JWT cookie:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
