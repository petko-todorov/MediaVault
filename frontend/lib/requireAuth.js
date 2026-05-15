import {  NextResponse } from 'next/server';

import axios from 'axios';

export function requireAuth(handler) {
    return async (req, ctx) => {
        const accessToken = req.cookies.get('access_token')?.value;
        const refreshToken = req.cookies.get('refresh_token')?.value;

        if (accessToken) {
            return handler(req, { ...ctx, accessToken });
        }

        if (!refreshToken) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );
        }

        let newAccessToken = null;
        let newRefreshToken = null;
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh/`,
                { refresh: refreshToken },
            );
            newAccessToken = response.data.access;
            newRefreshToken = response.data.refresh;
        } catch (error) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );
        }

        const response = await handler(req, {
            ...ctx,
            accessToken: newAccessToken,
        });

        if (newAccessToken && response instanceof NextResponse) {
            response.cookies.set('access_token', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 15, // 15 minutes
            });
        }

        if (newRefreshToken && response instanceof NextResponse) {
            response.cookies.set('refresh_token', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days
            });
        }

        return response;
    };
}
