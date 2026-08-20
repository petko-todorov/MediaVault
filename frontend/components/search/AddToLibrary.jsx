'use client';

import { MdLibraryAdd, MdCheck } from 'react-icons/md';
import { useAddToLibrary } from '@/hooks/useAddToLibrary';
import { useLibrary } from '@/hooks/useLibrary';

export default function AddToLibrary({ item, mediaType = item.media_type }) {
    const { mutate, isPending } = useAddToLibrary();
    const { data: libraryItems = [] } = useLibrary();

    const isAlreadyAdded = libraryItems.some((libItem) => {
        if (mediaType === 'game') {
            return (
                libItem.game?.id === item.id ||
                (item.rawg_id && libItem.game?.rawg_id === item.rawg_id)
            );
        }
        return (
            libItem.media_item?.id === item.id ||
            (item.tmdb_id && libItem.media_item?.tmdb_id === item.tmdb_id)
        );
    });

    const handleAdd = () => {
        if (isAlreadyAdded) return;
        mutate({ item, mediaType });
    };

    return (
        <button
            onClick={handleAdd}
            disabled={isPending || isAlreadyAdded}
            className={`py-3 w-full flex justify-center items-center gap-1 duration-200 backdrop-blur-md rounded-lg font-semibold ${
                isAlreadyAdded
                    ? 'bg-green-600/20 text-green-400 cursor-default border border-green-500/30'
                    : 'bg-white/10 hover:bg-slate-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
        >
            {isAlreadyAdded ? (
                <>
                    <MdCheck />
                    In Library
                </>
            ) : (
                <>
                    <MdLibraryAdd />
                    {isPending ? 'Adding...' : 'Add to Library'}
                </>
            )}
        </button>
    );
}

