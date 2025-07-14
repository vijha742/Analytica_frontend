import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function POST(request: NextRequest) {
    try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

        if (!token || !token.githubAccessToken) {
            return NextResponse.json({ error: 'No GitHub access token found' }, { status: 401 });
        }

        const backendResponse = await fetch(`${process.env.SPRING_BOOT_BACKEND_URL}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                access_token: token.githubAccessToken,
                userObject: {
                    email: token.email,
                    name: token.name,
                    imageUrl: token.picture,
                    githubId: token.sub
                }
            }),
        });

        if (!backendResponse.ok) {
            return NextResponse.json({ error: 'Backend authentication failed' }, { status: 401 });
        }

        const backendData = await backendResponse.json();
        const response = NextResponse.json({ success: true, user: backendData.user });

        if (backendData.jwtToken) {
            response.cookies.set('jwt', backendData.jwtToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000,
                path: '/'
            });
        }

        return response;
    } catch (error) {
        console.error('Error in backend JWT exchange:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
