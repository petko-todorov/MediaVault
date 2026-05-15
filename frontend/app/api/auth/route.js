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

        return NextResponse.json({ user: response.data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
});
