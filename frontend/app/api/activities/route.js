import axios from 'axios';
import { requireAuth } from '@/lib/requireAuth';
import { NextResponse } from 'next/server';

export const GET = requireAuth(async (request, { accessToken }) => {
    try {
        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/activities/${
            queryString ? `?${queryString}` : ''
        }`;

        const res = await axios.get(url, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        return NextResponse.json(res.data, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch activities' },
            { status: error.response?.status || 500 },
        );
    }
});
