'use client';

import { use } from 'react';
import { useSearchMoviesSeries } from '@/hooks/useSearchMoviesSeries';
import { useSearchGames } from '@/hooks/useSearchGames';
import SearchMoviesSeriesResults from '@/components/SearchMoviesSeriesResults';
import SearchGameResults from '@/components/SearchGameResults';

export default function SearchResultPage({ searchParams }) {
    const resolvedSearchParams = use(searchParams);
    const q = resolvedSearchParams.q || '';

    const { data: movies = [], isLoading: loadingMovies } =
        useSearchMoviesSeries(q);
    const { data: games = [], isLoading: loadingGames } = useSearchGames(q);

    return (
        <div className="p-6 text-white">
            <SearchMoviesSeriesResults
                movies={movies}
                loading={loadingMovies}
            />
            <SearchGameResults games={games} loading={loadingGames} />
        </div>
    );
}
