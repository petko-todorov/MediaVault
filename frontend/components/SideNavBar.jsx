'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Logout from './Logout';
import { useStore } from '@/store/useStore';
import { MdHomeFilled, MdVideoLibrary } from 'react-icons/md';
import Link from 'next/link';

const LINKS = [
    {
        name: 'Home',
        href: '/',
        icon: <MdHomeFilled className="text-blue-200" size={25} />,
    },
    {
        name: 'Library',
        href: '/library',
        icon: <MdVideoLibrary className="text-indigo-200" size={25} />,
    },
    {
        name: 'test',
        href: '#',
        icon: <MdHomeFilled className="text-blue-200" />,
    },
];

export default function SideNavBar() {
    const pathname = usePathname();
    const user = useStore((state) => state.user);

    const isWelcomePage = pathname === '/welcome' || pathname === '/welcome/';

    if (isWelcomePage || !user) {
        return null;
    }

    return (
        <aside className="hidden md:flex flex-col items-center w-64 h-full bg-[#161C26] text-white p-5 shrink-0">
            <Image
                src="/logo.webp"
                alt="Logo"
                width={500}
                height={400}
                loading="eager"
                className="w-3/4 mb-10"
            />
            <nav className="flex-1 flex flex-col gap-3 w-full">
                {LINKS.map((link, index) => {
                    const isActive = link.href === pathname;

                    return (
                        <Link
                            key={index}
                            href={link.href}
                            className={`flex justify-start items-center space-x-3 rounded-xl px-4 py-3 transition-colors ${
                                isActive
                                    ? 'bg-slate-700 text-white border-r-2 border-slate-300'
                                    : 'hover:bg-slate-800 text-gray-300'
                            }`}
                        >
                            {link.icon}
                            <span className="font-medium">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="w-full px-4 py-3">
                <Logout />
            </div>
        </aside>
    );
}
