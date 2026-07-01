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

    const res = await axios.post(endpoint, payload);
    return res.data;
};

export function useAddToLibrary() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addToLibrary,
        onSuccess: async (newItem) => {
            queryClient.setQueryData(libraryKeys.all, (oldData) => {
                const itemType = newItem.game ? 'game' : 'media';
                const withoutDuplicate = oldData
                    ? oldData.filter((item) => {
                          const currentType = item.game ? 'game' : 'media';
                          return !(
                              currentType === itemType && item.id === newItem.id
                          );
                      })
                    : [];

                return [newItem, ...withoutDuplicate].sort(
                    (a, b) => new Date(b.added_at) - new Date(a.added_at),
                );
            });
            await queryClient.invalidateQueries({ queryKey: libraryKeys.all });
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
