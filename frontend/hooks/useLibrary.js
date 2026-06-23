import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { libraryKeys } from '@/lib/queryKeys';

const fetchLibrary = async () => {
    const res = await axios.get('/api/media/moviesSeries');
    return res.data;
};

export function useLibrary(enabled = true) {
    return useQuery({
        queryKey: libraryKeys.all,
        queryFn: fetchLibrary,
        enabled: enabled,
    });
}
