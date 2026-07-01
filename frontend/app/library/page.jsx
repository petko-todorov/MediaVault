'use client';

import { useLibrary } from '@/hooks/useLibrary';
import LibraryItemCard from '@/components/library/LibraryItemCard';
import { useState } from 'react';
import ActiveTypeButton from '@/components/library/ActiveTypeButton';

export default function LibraryPage() {
    const { data: libraryItems, isLoading, error } = useLibrary();
    const [activeType, setActiveType] = useState('all');

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

    const filteredItems = libraryItems.filter((item) => {
        if (activeType === 'all') return true;

        if (activeType === 'games') {
            return Boolean(item.game);
        }

        if (activeType === 'movies') {
            return item.media_item?.media_type === 'movie';
        }

        if (activeType === 'tv') {
            return item.media_item?.media_type === 'series';
        }

        return true;
    });

    return (
        <section className="p-4 sm:p-8">
            <h1 className="text-3xl font-bold mb-8 text-white">My Library</h1>

            <div className="flex flex-wrap gap-4 mb-8">
                <ActiveTypeButton
                    activeType={activeType}
                    setActiveType={setActiveType}
                    buttonText="All"
                    type="all"
                />
                <ActiveTypeButton
                    activeType={activeType}
                    setActiveType={setActiveType}
                    buttonText="Movies"
                    type="movies"
                />
                <ActiveTypeButton
                    activeType={activeType}
                    setActiveType={setActiveType}
                    buttonText="TV Series"
                    type="tv"
                />
                <ActiveTypeButton
                    activeType={activeType}
                    setActiveType={setActiveType}
                    buttonText="Games"
                    type="games"
                />
            </div>

            {!libraryItems || libraryItems.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-gray-400 text-lg">
                        Your library is empty. Start adding some movies/games to
                        your library.
                    </p>
                </div>
            ) : (
                <ul className="grid grid-cols-3 gap-6">
                    {filteredItems.map((libraryItem) => {
                        const type = libraryItem.game
                            ? 'game'
                            : libraryItem.media_item?.media_type || 'media';

                        return (
                            <LibraryItemCard
                                key={`${type}-${libraryItem.id}`}
                                libraryItem={libraryItem}
                            />
                        );
                    })}
                </ul>
            )}
        </section>
    );
}
