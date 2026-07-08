import LibraryItemCard from '@/components/library/LibraryItemCard';
import { useState } from 'react';
import ReactPaginate from 'react-paginate';

const STATUS_SECTIONS = [
    { key: 'watching', label: 'Watching' },
    { key: 'completed', label: 'Completed' },
    { key: 'planned', label: 'Planned' },
    { key: 'dropped', label: 'Dropped' },
];

const ITEMS_PER_PAGE = 4;

export default function LibraryStatusSections({
    items,
    emptyLabel = 'movies',
}) {
    const [pageByStatus, setPageByStatus] = useState({});

    if (!items || items.length === 0) {
        return (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-lg">
                    No {emptyLabel} in your library.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {STATUS_SECTIONS.map((status) => {
                const statusItems = items.filter(
                    (item) => item.status === status.key,
                );

                const currentPage = pageByStatus[status.key] ?? 0;

                const offset = currentPage * ITEMS_PER_PAGE;

                const currentItems = statusItems.slice(
                    offset,
                    offset + ITEMS_PER_PAGE,
                );

                const pageCount = Math.ceil(
                    statusItems.length / ITEMS_PER_PAGE,
                );

                return (
                    <section
                        key={status.key}
                        className="rounded-xl border border-white/10 bg-white/5 p-4"
                    >
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <h2 className="text-lg font-semibold text-white">
                                {status.label}
                            </h2>

                            <span className="rounded-full bg-black/30 px-3 py-1 text-sm text-gray-300">
                                {statusItems.length}
                            </span>
                        </div>

                        {statusItems.length === 0 ? (
                            <p className="rounded-lg border border-dashed border-white/10 px-3 py-8 text-center text-sm text-gray-500">
                                No items
                            </p>
                        ) : (
                            <div>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                    {currentItems.map((libraryItem) => (
                                        <li
                                            key={`movie-${libraryItem.id}`}
                                            className="min-w-0"
                                        >
                                            <LibraryItemCard
                                                libraryItem={libraryItem}
                                            />
                                        </li>
                                    ))}
                                </ul>

                                {pageCount > 1 && (
                                    <ReactPaginate
                                        breakLabel="..."
                                        nextLabel=">"
                                        previousLabel="<"
                                        pageRangeDisplayed={3}
                                        marginPagesDisplayed={1}
                                        pageCount={pageCount}
                                           forcePage={currentPage}
                                        onPageChange={(event) =>
                                            setPageByStatus((prev) => ({
                                                ...prev,
                                                [status.key]: event.selected,
                                            }))
                                        }
                                        containerClassName="flex justify-center items-center gap-2 mt-6"
                                        pageClassName="rounded bg-white/10 cursor-pointer select-none"
                                        pageLinkClassName="flex h-10 w-10 items-center justify-center text-white"
                                        activeClassName="bg-white/30"
                                        previousClassName="rounded bg-white/10 select-none"
                                        previousLinkClassName="flex h-10 w-10 items-center justify-center text-white cursor-pointer"
                                        nextClassName="rounded bg-white/10 select-none"
                                        nextLinkClassName="flex h-10 w-10 items-center justify-center text-white cursor-pointer"
                                        disabledClassName="opacity-50"
                                    />
                                )}
                            </div>
                        )}
                    </section>
                );
            })}
        </div>
    );
}
