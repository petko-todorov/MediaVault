'use client';

import Link from 'next/link';
import { IoLink } from 'react-icons/io5';
import AddToLibrary from './AddToLibrary';

export default function SearchMoviesSeriesResults({ movies, loading }) {
    const mediaColors = {
        movie: 'text-blue-100 bg-sky-500/80',
        series: 'text-purple-100 bg-violet-600/80',
    };

    if (loading) return <p>Loading movies and series...</p>;
    if (!movies.length) return <p>No movies or series found.</p>;

    return (
        <>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {movies.map((movie) => (
                <li key={movie.id}>
                    <article className="relative group overflow-hidden rounded-xl h-64 flex flex-col justify-end px-3 py-2 text-white shadow-lg">
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 duration-300"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
                        <div className="relative z-10">
                            <span
                                className={`capitalize px-2 py-1 rounded-md text-sm ${mediaColors[movie.media_type]}`}
                            >
                                {movie.media_type}
                            </span>
                            <h3 className="line-clamp-1">{movie.title}</h3>
                            <div className="text-sm">
                                <time dateTime={movie.release_year}>{movie.release_year}</time>
                                {movie.rating !== 0 && (
                                    <span className="pl-1">
                                        ●⭐{movie.rating.toFixed(1)}
                                    </span>
                                )}
                                {/* <p className="text-gray-300 line-clamp-3">
                                    {movie.description}
                                </p> */}
                            </div>

                            {movie.tmdb_url && (
                                <Link
                                    href={movie.tmdb_url}
                                    className="inline-flex items-center bg-black/30 p-1 text-xs gap-1 hover:bg-black/40 rounded-md"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <IoLink />
                                    <span>TMDB</span>
                                </Link>
                            )}
                            <AddToLibrary item={movie} />
                        </div>
                    </article>
                </li>
            ))}
        </ul>
        </>
    );
}
