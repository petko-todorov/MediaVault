'use client';

import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store/useStore';
import { useEffect } from 'react';

export default function AuthGate({ children }) {
    const { data, isLoading } = useAuth();
    const setUser = useStore((state) => state.setUser);

    useEffect(() => {
        if (data && data.user) {
            setUser(data.user);
        }
    }, [data, setUser]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                {/* <Loader2 className="text-muted-foreground mr-1 size-5 animate-spin" /> */}
                Authorizing
            </div>
        );
    }

    return <>{children}</>;
}
