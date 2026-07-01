import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { libraryKeys } from '@/lib/queryKeys';

const fetchLibrary = async () => {
    const [moviesSeriesRes, gamesRes] = await Promise.all([
        axios.get('/api/media/moviesSeries'),
        axios.get('/api/media/games'),
    ]);

    return [...moviesSeriesRes.data, ...gamesRes.data].sort(
        (a, b) => new Date(b.added_at) - new Date(a.added_at),
    );
};

export function useLibrary(enabled = true) {
    return useQuery({
        queryKey: libraryKeys.all,
        queryFn: fetchLibrary,
        enabled: enabled,
    });
}
