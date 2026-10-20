'use client';

import { usePathname } from 'next/navigation';

export default function MainContent({ children }) {
    const pathname = usePathname();

    return (
        <main className={pathname === '/welcome' ? '' : 'px-6'}>
            {children}
        </main>
    );
}
