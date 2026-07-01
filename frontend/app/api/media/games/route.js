import axios from 'axios';
import { requireAuth } from '@/lib/requireAuth';
import { NextResponse } from 'next/server';

export const GET = requireAuth(async (request, { accessToken }) => {
    try {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            },
        );
        return NextResponse.json(res.data, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch games library' },
            { status: error.response?.status || 500 },
        );
    }
});
