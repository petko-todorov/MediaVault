import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchGames = async (q) => {
    const res = await axios.post('/api/search/games', { q });
    return res.data;
};

export function useSearchGames(q) {
    return useQuery({
        queryKey: ['games', q],
        queryFn: () => fetchGames(q),
        enabled: !!q,
        retry: false,
    });
}
