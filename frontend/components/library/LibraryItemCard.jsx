export default function LibraryItemCard({ libraryItem }) {
    const isGame = !!libraryItem.game;

    const item = isGame ? libraryItem.game : libraryItem.media_item;

    if (!item) return null;

    const type = isGame ? 'game' : item.media_type;

    const label =
        type === 'game'
            ? 'Game'
            : type === 'series'
              ? 'TV Series'
              : 'Movie';

    const badgeClass =
        type === 'game'
            ? 'bg-orange-800/60 text-amber-300'
            : type === 'series'
              ? 'bg-violet-600/80 text-purple-100'
              : 'bg-sky-500/80 text-blue-100';

    return (
        <article className="relative group overflow-hidden rounded-xl h-64 flex flex-col justify-end px-3 py-2 text-white shadow-lg">
            <img
                src={item.poster}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 duration-300"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/55 to-transparent" />

            <div className="relative z-10">
                <span className={`inline-flex px-2 py-1 rounded-md text-sm font-medium ${badgeClass}`}>
                    {label}
                </span>

                <h3 className="line-clamp-1 mt-2 font-semibold">
                    {item.title}
                </h3>

                <div className="text-sm text-gray-200">
                    <time dateTime={String(item.release_year)}>
                        {item.release_year}
                    </time>

                    {item.rating ? (
                        <span className="pl-1">
                            ● ⭐ {Number(item.rating).toFixed(1)}
                        </span>
                    ) : null}
                </div>

                <p className="text-xs text-gray-300 mt-1">
                    Added {new Date(libraryItem.added_at).toLocaleDateString()}
                </p>
            </div>
        </article>
    );
}