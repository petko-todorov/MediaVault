import axios from 'axios';
import { requireAuth } from '@/lib/requireAuth';
import { NextResponse } from 'next/server';

export const GET = requireAuth(async (request, { accessToken }) => {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    try {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/search-games/`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: { q },
            },
        );
        return NextResponse.json(res.data, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch games' },
            { status: error.response?.status || 500 },
        );
    }
});
