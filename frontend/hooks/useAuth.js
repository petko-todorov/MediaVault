import { useQuery } from '@tanstack/react-query';

// async function fetchMe() {
//     const res = await fetch('/api/auth');
//     if (res.status === 401) return null;
//     if (!res.ok) throw new Error('Failed to fetch session');
//     return res.json();
// }

async function fetchMe() {
    const res = await fetch('/api/auth');
    
    if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error('Failed to fetch session');
    }

    const data = await res.json();
    
    if (data.user === null) return null;

    return data;
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
