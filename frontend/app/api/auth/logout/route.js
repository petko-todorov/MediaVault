import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ success: true });

    response.cookies.set('access_token', '', {
        path: '/',
        maxAge: 0,
        httpOnly: true,
    });
    response.cookies.set('refresh_token', '', {
        path: '/',
        maxAge: 0,
        httpOnly: true,
    });
    response.cookies.set('csrftoken', '', {
        path: '/',
        maxAge: 0,
        httpOnly: true,
    });

    return response;
}
