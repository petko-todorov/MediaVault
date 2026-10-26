'use client';

import { use } from 'react';
import { useSearchMoviesSeries } from '@/hooks/useSearchMoviesSeries';
import { useSearchGames } from '@/hooks/useSearchGames';
import SearchMoviesSeriesResults from '@/components/search/SearchMoviesSeriesResults';
import SearchGameResults from '@/components/search/SearchGameResults';
import { MdSearch } from 'react-icons/md';

export default function SearchResultPage({ searchParams }) {
    const resolvedSearchParams = use(searchParams);
    const q = (resolvedSearchParams?.q || '').trim();

    const { data: movies = [], isLoading: loadingMovies } =
        useSearchMoviesSeries(q);
    const { data: games = [], isLoading: loadingGames } = useSearchGames(q);

    if (!q) {
        return (
            <div className="py-20 text-center">
                <div className="max-w-md mx-auto rounded-3xl bg-white/5 border border-white/10 p-10 shadow-xl">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 mb-4">
                        <MdSearch size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Search MediaVault
                    </h2>
                    <p className="text-gray-400 text-sm">
                        Type in the search bar above to look up movies, TV series, or games and add them to your library.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <section className="p-2 text-white">
            <h1 className="text-4xl font-bold mb-4">
                Results for
                <span className="text-blue-200 italic"> &quot;{q}&quot; </span>
            </h1>

            <div className="flex justify-between">
                <section className="w-5/11">
                    <h2 className="text-slate-300 text-xl font-semibold mb-2">
                        Movies & TV Shows - {movies.length} Results
                    </h2>
                    <SearchMoviesSeriesResults
                        movies={movies}
                        loading={loadingMovies}
                    />
                </section>
                <section className="w-5/11">
                    <h2 className="text-slate-300 text-xl font-semibold mb-2">
                        Games - {games.length} Results
                    </h2>
                    <SearchGameResults games={games} loading={loadingGames} />
                </section>
            </div>
        </section>
    );
}
