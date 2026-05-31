'use client';

export default function SearchMoviesSeriesResults({ movies, loading }) {
    if (loading) return <p>Loading movies and series...</p>;
    if (!movies.length) return <p>No movies or series found.</p>;

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Филми и сериали</h2>
            <div className="grid grid-cols-3 gap-4">
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
                    >
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-full h-64 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold line-clamp-1">
                                {movie.title}
                            </h3>
                            <p className="text-gray-400 text-sm">
                                {movie.release_year}
                            </p>
                            <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                                ⭐ {movie.rating}
                            </span>
                            <p className="text-gray-300 mt-3 text-sm line-clamp-3">
                                {movie.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
