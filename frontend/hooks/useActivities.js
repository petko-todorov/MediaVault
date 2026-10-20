import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { activityKeys } from '@/lib/queryKeys';

const fetchActivities = async ({ scope, mediaType, page = 1 }) => {
    const params = new URLSearchParams();
    if (scope && scope !== 'all') {
        params.append('scope', scope);
    }
    if (mediaType && mediaType !== 'all') {
        params.append('media_type', mediaType);
    }
    if (page) {
        params.append('page', String(page));
    }

    const queryString = params.toString();
    const url = `/api/activities${queryString ? `?${queryString}` : ''}`;
    const response = await axios.get(url);
    return response.data;
};

export function useActivities({ scope = 'all', mediaType = 'all' } = {}) {
    return useInfiniteQuery({
        queryKey: activityKeys.list({ scope, mediaType }),
        queryFn: ({ pageParam = 1 }) =>
            fetchActivities({ scope, mediaType, page: pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage?.next) {
                return allPages.length + 1;
            }
            return undefined;
        },
    });
}
