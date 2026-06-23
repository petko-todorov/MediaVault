import { libraryKeys } from '@/lib/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const addToLibrary = async ({ item, mediaType }) => {
    const isGame = mediaType === 'game';
    const endpoint = isGame
        ? '/api/media/games/add'
        : '/api/media/moviesSeries/add';
    const payload = isGame ? { game: item.id } : { media_item: item.id };

    await axios.post(endpoint, payload);
    return item;
};

export function useAddToLibrary() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addToLibrary,
        onSuccess: (newItem) => {
            queryClient.setQueryData(libraryKeys.all, (oldData) => {
                return oldData ? [newItem, ...oldData] : [newItem];
            });
            router.push('/library');
        },
        onError: (error) => {
            console.error(
                'Error adding to library:',
                error.response?.data || error.message,
            );
        },
    });
}
