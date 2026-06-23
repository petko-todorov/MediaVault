import { gamesKeys } from '@/lib/queryKeys';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchGames = async (q) => {
    const res = await axios.get('/api/search/games', { params: { q } });
    return res.data;
};

export function useSearchGames(q) {
    return useQuery({
        queryKey: gamesKeys.gamesQuery(q),
        queryFn: () => fetchGames(q),
        enabled: !!q,
        retry: false,
    });
}
