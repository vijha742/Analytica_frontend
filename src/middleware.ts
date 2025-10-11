import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

const PUBLIC_PATHS = ['/', '/about', '/api/auth', '/_next', '/favicon.ico', '/auth'];


type decodedJwt = {
    sub: string;
    iat: number;
    exp: number;
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Allow public paths
    if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // Check for JWT cookie
    const jwt = req.cookies.get('jwt')?.value;
    const refreshToken = req.cookies.get('refreshToken')?.value;

    let isJwtValid = false;
    if (jwt) {
        try {
            const decoded: decodedJwt = jwtDecode(jwt);
            // JWT exp is in seconds
            const now = Math.floor(Date.now() / 1000);
            if (decoded.exp && decoded.exp > now) {
                isJwtValid = true;
            }
        } catch (e) {
            console.log("Invalid JWT" + e)
        }
    }

    if (!isJwtValid && refreshToken) {
        // Try to refresh JWT
        try {
            const refreshRes = await fetch(`${req.nextUrl.origin}/api/auth/refresh-jwt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': req.headers.get('cookie') || ''
                },
            });
            if (refreshRes.ok) {
                // Get new cookies from response
                const res = NextResponse.next();
                const setCookieHeaders = refreshRes.headers.getSetCookie();
                if (setCookieHeaders.length > 0) {
                    // Set cookies from refresh response
                    setCookieHeaders.forEach(cookie => {
                        res.headers.append('set-cookie', cookie);
                    });
                }
                return res;
            } else {
                // Refresh failed, redirect to sign-in
                const signInUrl = new URL('/api/auth/signin', req.url);
                signInUrl.searchParams.set('callbackUrl', req.url);
                return NextResponse.redirect(signInUrl);
            }
        } catch (e) {
            // Error during refresh, redirect to sign-in
            console.log("Redirecting to sign-in, error log: " + e)
            const signInUrl = new URL('/api/auth/signin', req.url);
            signInUrl.searchParams.set('callbackUrl', req.url);
            return NextResponse.redirect(signInUrl);
        }
    }

    if (!isJwtValid) {
        // No valid JWT and no refresh token, redirect to sign-in
        const signInUrl = new URL('/api/auth/signin', req.url);
        signInUrl.searchParams.set('callbackUrl', req.url);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
