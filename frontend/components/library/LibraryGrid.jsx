import LibraryItemCard from '@/components/library/LibraryItemCard';

export default function LibraryGrid({ items, emptyMessage, disableDrag = false }) {
    if (!items || items.length === 0) {
        return (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-lg">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((libraryItem) => {
                const type = libraryItem.game
                    ? 'game'
                    : libraryItem.media_item?.media_type || 'media';

                return (
                    <LibraryItemCard
                        key={`${type}-${libraryItem.id}`}
                        libraryItem={libraryItem}
                        disableDrag={disableDrag}
                    />
                );
            })}
        </ul>
    );
}
