'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SearchInput() {
    const [inputSearch, setInputSearch] = useState('');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const query = searchParams.get('q');
        if (pathname === '/search' && query) {
            setInputSearch(query);
        } else {
            setInputSearch('');
        }
    }, [pathname, searchParams]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!inputSearch.trim()) return;

        router.push(`/search/?q=${encodeURIComponent(inputSearch)}`);
    };

    return (
        <form onSubmit={handleSearch}>
            <input
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
                type="search"
                placeholder="Search"
                className="h-10 pl-12 rounded-lg px-4 bg-[#161C26] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full md:w-64"
            />
        </form>
    );
}
