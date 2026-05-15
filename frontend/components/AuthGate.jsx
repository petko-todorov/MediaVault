'use client';

import { useAuth } from '@/hooks/useAuth';

export default function AuthGate({ children }) {
    const { isLoading } = useAuth();

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
