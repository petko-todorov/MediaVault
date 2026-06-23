'use client';

import { use } from 'react';
import { useSearchMoviesSeries } from '@/hooks/useSearchMoviesSeries';
import { useSearchGames } from '@/hooks/useSearchGames';
import SearchMoviesSeriesResults from '@/components/search/SearchMoviesSeriesResults';
import SearchGameResults from '@/components/search/SearchGameResults';

export default function SearchResultPage({ searchParams }) {
    const resolvedSearchParams = use(searchParams);
    const q = resolvedSearchParams.q.trim() || '';

    const { data: movies = [], isLoading: loadingMovies } =
        useSearchMoviesSeries(q);
    const { data: games = [], isLoading: loadingGames } = useSearchGames(q);
    console.log('games', games);

    return (
        <section className="p-2 text-white">
            <h1 className="text-4xl font-bold mb-4">
                Results for
                <span className="text-blue-200 italic"> "{q}" </span>
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
