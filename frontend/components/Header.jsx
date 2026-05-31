'use client';

import { useStore } from '@/store/useStore';
import { FaSearch } from 'react-icons/fa';
import { Suspense } from 'react';
import SearchInput from './SearchInput';

export default function Header() {
    const user = useStore((state) => state.user);

    if (!user) {
        return null;
    }

    return (
        <header className="sticky top-0 z-40 h-20 w-full bg-[#0E131E]/40 backdrop-blur-md flex items-center px-6">
            <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <Suspense
                    fallback={
                        <div className="h-10 w-64 bg-[#161C26] rounded-lg animate-pulse" />
                    }
                >
                    <SearchInput />
                </Suspense>
            </div>
        </header>
    );
}
