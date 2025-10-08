import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'No valid authorization header' }, { status: 401 });
        }

        const jwt = authHeader.split(' ')[1];
        if (!jwt) {
            return NextResponse.json({ error: 'No JWT token found' }, { status: 401 });
        }
        try {
            const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/validate`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json',
                },
            });
            if (backendResponse.ok) {
                return NextResponse.json({
                    status: 'valid',
                    message: 'JWT is valid and backend is reachable'
                });
            } else {
                return NextResponse.json({
                    error: 'Backend validation failed',
                    status: backendResponse.status
                }, { status: 401 });
            }
        } catch (error) {
            return NextResponse.json({
                error: 'Backend server unreachable. JWT validation failed.',
                detail: error instanceof Error ? error.message : 'Unknown error'
            }, { status: 503 });
        }
    } catch (error) {
        console.error('Error in test-backend route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
