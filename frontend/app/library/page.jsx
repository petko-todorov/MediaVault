'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { libraryKeys } from '@/lib/queryKeys';

const fetchLibrary = async () => {
    const res = await axios.get('/api/media/moviesSeries');
    return res.data;
};

export default function LibraryPage() {
    const {
        data: libraryItems,
        isLoading,
        error,
    } = useQuery({
        queryKey: libraryKeys.all,
        queryFn: fetchLibrary,
    });

    console.log(libraryItems);

    if (isLoading)
        return (
            <div className="p-8 text-center text-gray-400">
                Loading your library...
            </div>
        );

    if (error)
        return (
            <div className="p-8 text-center text-red-500">
                Error loading library.
            </div>
        );

    return (
        <section className="p-4 sm:p-8">
            <h1 className="text-3xl font-bold mb-8 text-white">My Library</h1>

            {!libraryItems || libraryItems.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-gray-400 text-lg">
                        Your library is empty. Start adding some movies/games to
                        your library.
                    </p>
                </div>
            ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {libraryItems.map((item, index) => (
                        <div key={index}></div>
                    ))}
                </ul>
            )}
        </section>
    );
}
