import { moviesSeriesKeys } from '@/lib/queryKeys';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchMoviesSeries = async (q) => {
    const res = await axios.get('/api/search/movies', { params: { q } });
    return res.data;
};

export function useSearchMoviesSeries(q) {
    return useQuery({
        queryKey: moviesSeriesKeys.moviesSeriesQuery(q),
        queryFn: () => fetchMoviesSeries(q),
        enabled: !!q,
        retry: false,
    });
}
