'use client';

import { useLibrary } from '@/hooks/useLibrary';
import LibraryGrid from '@/components/library/LibraryGrid';
import LibraryStatusSections from '@/components/library/LibraryStatusSections';

const EMPTY_MESSAGES = {
    all: 'Your library is empty. Start adding some movies/games to your library.',
    movies: 'No movies in your library.',
    tv: 'No TV series in your library.',
    games: 'No games in your library.',
};

function filterLibraryItems(libraryItems, type) {
    if (type === 'games') {
        return libraryItems.filter((item) => Boolean(item.game));
    }

    if (type === 'movies') {
        return libraryItems.filter(
            (item) => item.media_item?.media_type === 'movie',
        );
    }

    if (type === 'tv') {
        return libraryItems.filter((item) =>
            ['tv', 'series'].includes(item.media_item?.media_type),
        );
    }

    return libraryItems;
}

export default function LibraryPageContent({
    type = 'all',
    groupByStatus = false,
}) {
    const { data: libraryItems = [], isLoading, error } = useLibrary();

    if (isLoading) {
        return (
            <div className="p-8 text-center text-gray-400">
                Loading your library...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-500">
                Error loading library.
            </div>
        );
    }

    const filteredItems = filterLibraryItems(libraryItems, type);

    if (groupByStatus) {
        return (
            <LibraryStatusSections
                items={filteredItems}
                emptyLabel={type === 'tv' ? 'TV series' : type}
                disableDrag={type === 'all'}
            />
        );
    }

    return (
        <LibraryGrid
            items={filteredItems}
            emptyMessage={EMPTY_MESSAGES[type] || EMPTY_MESSAGES.all}
            disableDrag={type === 'all'}
        />
    );
}
