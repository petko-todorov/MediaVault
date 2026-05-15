import { useQuery } from '@tanstack/react-query';

async function fetchMe() {
    const res = await fetch('/api/auth');
    if (res.status === 401) return null;
    if (!res.ok) throw new Error('Failed to fetch session');
    return res.json();
}

export function useAuth() {
    return useQuery({
        queryKey: ['me'],
        queryFn: fetchMe,
        retry: false,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });
}
