import { NextResponse } from 'next/server';
import axios from 'axios';

export function requireAuth(handler) {
    return async (req, ctx) => {
        let accessToken = req.cookies.get('access_token')?.value;
        const refreshToken = req.cookies.get('refresh_token')?.value;

        const refreshTokens = async () => {
            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh/`,
                    { refresh: refreshToken },
                );
                return {
                    accessToken: response.data.access,
                    refreshToken: response.data.refresh,
                };
            } catch (error) {
                console.error('Token refresh failed:', error.response?.data || error.message);
                if (error.response?.status === 401 || error.response?.status === 400) {
                    return { error: 'Unauthorized' };
                }
                return { error: 'NetworkError', status: error.response?.status || 500 };
            }
        };

        let newAccessToken = null;
        let newRefreshToken = null;

        if (!accessToken && refreshToken) {
            const result = await refreshTokens();
            if (result.error === 'Unauthorized') {
                const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                response.cookies.delete('access_token');
                response.cookies.delete('refresh_token');
                return response;
            } else if (result.error) {
                return NextResponse.json({ error: 'Authentication service unavailable' }, { status: result.status });
            }
            newAccessToken = result.accessToken;
            newRefreshToken = result.refreshToken;
            accessToken = newAccessToken;
        }

        if (!accessToken && !refreshToken) {
            return NextResponse.json(
                { user: null, authenticated: false },
                { status: 200 },
            );
        }

        let response = await handler(req, { ...ctx, accessToken });

        if (response.status === 401 && refreshToken && !newAccessToken) {
            const result = await refreshTokens();
            if (result.accessToken) {
                newAccessToken = result.accessToken;
                newRefreshToken = result.refreshToken;
                response = await handler(req, { ...ctx, accessToken: newAccessToken });
            } else if (result.error === 'Unauthorized') {
                const errorResponse = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                errorResponse.cookies.delete('access_token');
                errorResponse.cookies.delete('refresh_token');
                return errorResponse;
            }
        }

        if (response.status === 401 && response instanceof NextResponse) {
            response.cookies.delete('access_token');
            response.cookies.delete('refresh_token');
        }

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
                maxAge: 60 * 60 * 24 * 7, // 1 week
            });
        }

        return response;
    };
}
