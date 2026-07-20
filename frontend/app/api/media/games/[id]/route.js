import axios from 'axios';
import { requireAuth } from '@/lib/requireAuth';
import { NextResponse } from 'next/server';

export const PATCH = requireAuth(async (request, { accessToken, params }) => {
    try {
        const body = await request.json();
        const { id } = await params;
        console.log('id', id);

        const res = await axios.patch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/update-game/${id}/`,
            body,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            },
        );

        return NextResponse.json(res.data, { status: 200 });
    } catch (error) {
        const backendError = error.response?.data;

        return NextResponse.json(
            backendError || { error: 'Failed to update game library item' },
            { status: error.response?.status || 500 },
        );
    }
});
