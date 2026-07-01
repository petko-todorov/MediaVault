'use client';

import AddToLibrary from './AddToLibrary';

export default function SearchGameResults({ games, loading }) {
    console.log(games);

    if (loading) return <p>Loading games...</p>;
    if (!games.length) return <p>No games found.</p>;

    return (
        <>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {games.map((game) => (
                <li key={game.id}>
                    <article className="relative group overflow-hidden rounded-xl h-64 flex flex-col justify-end px-3 py-2 text-white shadow-lg">
                        <img
                            src={game.poster}
                            alt={game.title}
                            className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 duration-300"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
                        <div className="relative z-10">
                            <span className="capitalize px-2 py-1 rounded-md text-sm bg-orange-800/60 text-amber-300">
                                game
                            </span>
                            <h3 className="line-clamp-1">{game.title}</h3>
                            <div className="text-sm">
                                <time dateTime={game.release_year}>{game.release_year}</time>
                                {game.rating && (
                                    <span className="pl-1">
                                        ●⭐{game.rating}
                                    </span>
                                )}
                                <div className="flex flex-wrap pb-2">
                                    {game.tags?.map((tag) => (
                                        <span
                                            key={tag}
                                            className="capitalize mr-1 border-2 border-white p-1 rounded-lg text-xs mt-1"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <AddToLibrary item={game} mediaType="game" />
                            </div>
                        </div>
                    </article>
                </li>
            ))}
        </ul>
        </>
    );
}
