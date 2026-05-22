import axios from 'axios';
import { requireAuth } from '@/lib/requireAuth';
import { NextResponse } from 'next/server';

export const GET = requireAuth(async (_, { accessToken }) => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me/`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            },
        );
        const nextResponse = NextResponse.json(
            { user: response.data },
            { status: 200 },
        );

        const djangoCookie = response.headers.get('set-cookie');
        if (djangoCookie) {
            djangoCookie.forEach((cookie) => {
                nextResponse.headers.append('Set-Cookie', cookie);
            });
        }

        return nextResponse;
    } catch (error) {
        const response = NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 },
        );

        response.cookies.delete('access_token');
        response.cookies.delete('refresh_token');
        response.cookies.delete('csrftoken');

        return response;
    }
});
