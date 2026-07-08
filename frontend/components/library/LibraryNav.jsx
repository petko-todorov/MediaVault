'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
    { href: '/library', label: 'All', activeColor: 'bg-blue-600 text-white' },
    { href: '/library/movies', label: 'Movies', activeColor: 'bg-sky-500/80 text-white' },
    { href: '/library/tv', label: 'TV Series', activeColor: 'bg-violet-600/80 text-white' },
    { href: '/library/games', label: 'Games', activeColor: 'bg-orange-800/60 text-white' },
];

export default function LibraryNav() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-wrap gap-2 mb-8" aria-label="Library views">
            {LINKS.map((link) => {
                const isActive = pathname === link.href;

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            isActive
                                ? link.activeColor
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </nav>
    );
}