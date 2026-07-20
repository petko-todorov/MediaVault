import Droppable from '@/components/draganddrop/Droppable';
import LibraryItemCard from '@/components/library/LibraryItemCard';
import { DragDropProvider } from '@dnd-kit/react';
import axios from 'axios';
import { useState } from 'react';
import ReactPaginate from 'react-paginate';

const MEDIA_STATUS_SECTIONS = [
    { key: 'watching', label: 'Watching' },
    { key: 'completed', label: 'Completed' },
    { key: 'planned', label: 'Planned' },
    { key: 'dropped', label: 'Dropped' },
];

const GAME_STATUS_SECTIONS = [
    { key: 'playing', label: 'Playing' },
    { key: 'completed', label: 'Completed' },
    { key: 'planned', label: 'Planned' },
    { key: 'dropped', label: 'Dropped' },
];

const ITEMS_PER_PAGE = 4;

function getLibraryItemType(item) {
    return item?.game ? 'game' : 'media';
}

function getLibraryItemKey(item) {
    return `${getLibraryItemType(item)}-${item?.id}`;
}

export default function LibraryStatusSections({
    items,
    emptyLabel = 'movies',
}) {
    const [pageByStatus, setPageByStatus] = useState({});
    const [statusOverrides, setStatusOverrides] = useState({});
    const statusSections =
        emptyLabel === 'games' ? GAME_STATUS_SECTIONS : MEDIA_STATUS_SECTIONS;

    const localItems = (items || []).map((item) => {
        const itemKey = getLibraryItemKey(item);
        const status = statusOverrides[itemKey] || item.status;

        return status === item.status ? item : { ...item, status };
    });

    const handleDragEnd = async (event) => {
        const libraryItem = event.operation?.source?.data?.libraryItem;
        const nextStatus = event.operation?.target?.data?.status;
        const itemType = getLibraryItemType(libraryItem);
        const itemKey = getLibraryItemKey(libraryItem);
        const currentStatus = statusOverrides[itemKey] || libraryItem?.status;

        if (
            !libraryItem ||
            !nextStatus ||
            currentStatus === nextStatus
        ) {
            return;
        }

        setStatusOverrides((currentOverrides) => {
            return {
                ...currentOverrides,
                [itemKey]: nextStatus,
            };
        });

        setPageByStatus((currentPages) => {
            return {
                ...currentPages,
                [nextStatus]: 0,
                [currentStatus]: 0,
            };
        });

        try {
            const endpoint =
                itemType === 'game'
                    ? `/api/media/games/${libraryItem.id}`
                    : `/api/media/moviesSeries/${libraryItem.id}`;

            const response = await axios.patch(endpoint, {
                status: nextStatus,
            });

            setStatusOverrides((currentOverrides) => ({
                ...currentOverrides,
                [itemKey]: response.data.status,
            }));
        } catch (error) {
            setStatusOverrides((currentOverrides) => ({
                ...currentOverrides,
                [itemKey]: currentStatus,
            }));

            setPageByStatus((currentPages) => ({
                ...currentPages,
                [nextStatus]: 0,
                [currentStatus]: 0,
            }));
        }
    };

    if (!localItems || localItems.length === 0) {
        return (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-lg">
                    No {emptyLabel} in your library.
                </p>
            </div>
        );
    }

    return (
        <DragDropProvider onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 gap-6">
                {statusSections.map((status) => {
                    const statusItems = localItems.filter(
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
                        <Droppable
                            key={status.key}
                            id={`status-${status.key}`}
                            data={{ status: status.key }}
                            className="min-h-44 rounded-xl border border-white/10 bg-white/5 p-4 transition-shadow"
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
                                                key={`library-${libraryItem.game ? 'game' : 'media'}-${libraryItem.id}`}
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
                                                    [status.key]:
                                                        event.selected,
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
                        </Droppable>
                    );
                })}
            </div>
        </DragDropProvider>
    );
}
