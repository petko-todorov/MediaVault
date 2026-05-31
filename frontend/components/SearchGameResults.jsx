'use client';

export default function SearchGameResults({ games, loading }) {
    if (loading) return <p>Loading games...</p>;
    if (!games.length) return <p>No games found.</p>;

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Игри</h2>
            <div className="grid grid-cols-3 gap-4">
                {games.map((game) => (
                    <div
                        key={game.id}
                        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
                    >
                        <img
                            src={game.poster}
                            alt={game.title}
                            className="w-full h-64 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold line-clamp-1">
                                {game.title}
                            </h3>
                            <p className="text-gray-400 text-sm">
                                {game.release_year}
                            </p>
                            <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                                ⭐ {game.rating}
                            </span>
                            <div className="flex gap-1 mt-2 flex-wrap">
                                {game.tags?.map((tag) => (
                                    <span
                                        key={tag}
                                        className="bg-gray-600 text-xs px-2 py-1 rounded"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
