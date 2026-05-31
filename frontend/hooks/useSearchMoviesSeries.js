import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchMoviesSeries = async (q) => {
    const res = await axios.post('/api/search/movies', { q });
    return res.data;
};

export function useSearchMoviesSeries(q) {
    return useQuery({
        queryKey: ['movies', q],
        queryFn: () => fetchMoviesSeries(q),
        enabled: !!q,
        retry: false,
    });
}
