import axios from 'axios';
import { requireAuth } from '@/lib/requireAuth';
import { NextResponse } from 'next/server';

export const POST = requireAuth(async (request, { accessToken }) => {
    try {
        const body = await request.json();

        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/add-game/`,
            body,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            },
        );
        return NextResponse.json(res.data, { status: 201 });
    } catch (error) {
        const backendError = error.response?.data;

        return NextResponse.json(
            backendError || { error: 'Failed to add game to library' },
            { status: error.response?.status || 500 },
        );
    }
});
