import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    const cookieStore = await cookies();
    const allCookies = cookieStore.toString();

    try {
        await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout/`,
            {},
            {
                headers: {
                    Cookie: allCookies,
                },
            },
        );
    } catch (error) {
        console.error(
            'Django logout failed:',
            error.response?.data || error.message,
        );
    }

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
