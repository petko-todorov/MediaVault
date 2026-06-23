'use client';

import { MdLibraryAdd } from 'react-icons/md';
import { useAddToLibrary } from '@/hooks/useAddToLibrary';

export default function AddToLibrary({ item, mediaType = item.media_type }) {
    const { mutate, isPending } = useAddToLibrary();

    const handleAdd = () => {
        mutate({ item, mediaType });
    };

    return (
        <button
            onClick={handleAdd}
            disabled={isPending}
            className="py-3 w-full flex justify-center items-center gap-1 bg-white/10 hover:bg-slate-800 text-gray-300 duration-200 backdrop-blur-md rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <MdLibraryAdd />
            {isPending ? 'Adding...' : 'Add to Library'}
        </button>
    );
}
