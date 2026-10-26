'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { useActivities } from '@/hooks/useActivities';
import ActivityCard from '@/components/activity/ActivityCard';
import {
    MdFeed,
    MdPerson,
    MdSearch,
    MdMovie,
    MdTv,
    MdSportsEsports,
    MdApps,
    MdCheckCircle,
} from 'react-icons/md';

const TYPE_TABS = [
    { key: 'all', label: 'All Media', icon: MdApps },
    { key: 'movie', label: 'Movies', icon: MdMovie },
    { key: 'tv', label: 'TV Series', icon: MdTv },
    { key: 'game', label: 'Games', icon: MdSportsEsports },
];

export default function Home() {
    const user = useStore((state) => state.user);
    const [scope, setScope] = useState('all'); // 'all' or 'me'
    const [mediaType, setMediaType] = useState('all');
    const loadMoreRef = useRef(null);

    const {
        data,
        isLoading,
        isError,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useActivities({
        scope,
        mediaType,
    });

    const activities =
        data?.pages?.flatMap((page) => page?.results || []) ?? [];
    const totalCount = data?.pages?.[0]?.count ?? 0;

    const handleObserver = useCallback(
        (entries) => {
            const [target] = entries;
            if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        [hasNextPage, isFetchingNextPage, fetchNextPage],
    );

    useEffect(() => {
        const element = loadMoreRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            threshold: 0.1,
            rootMargin: '250px',
        });

        observer.observe(element);
        return () => observer.disconnect();
    }, [handleObserver]);

    if (!user) return null;

    const userDisplayName = user.first_name
        ? `${user.first_name}`
        : user.username?.split('@')[0] || 'there';

    return (
        <div className="py-6 max-w-5xl mx-auto space-y-8">
            <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-950/70 via-[#161C26] to-[#0E131E] border border-white/10 p-6 sm:p-8 shadow-2xl">
                <div className="relative z-10 max-w-2xl">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
                        <MdFeed size={15} />
                        Activity Feed
                    </span>
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                        Welcome back, {userDisplayName}! 👋
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-gray-300">
                        Stay updated with what you and the community are adding
                        to libraries, watching, and completing.
                    </p>
                </div>

                <div className="absolute right-0 top-0 -bottom-10 w-96 bg-linear-to-l from-indigo-600/10 via-purple-600/5 to-transparent pointer-events-none" />
            </section>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="inline-flex rounded-xl bg-white/5 p-1 border border-white/10">
                    <button
                        onClick={() => setScope('all')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            scope === 'all'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <MdFeed size={18} />
                        Community
                    </button>
                    <button
                        onClick={() => setScope('me')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            scope === 'me'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <MdPerson size={18} />
                        My Activity
                    </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                    {TYPE_TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = mediaType === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setMediaType(tab.key)}
                                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
                                    isActive
                                        ? 'bg-white/20 text-white border border-white/20'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200 border border-transparent'
                                }`}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <section className="space-y-4">
                {isLoading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-44 rounded-2xl bg-white/5 border border-white/10 animate-pulse p-4"
                            />
                        ))}
                    </div>
                )}

                {isError && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-300">
                        <p className="font-semibold">
                            Could not load the activity feed.
                        </p>
                        <button
                            onClick={() => refetch()}
                            className="mt-3 px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!isLoading && !isError && activities.length === 0 && (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center max-w-lg mx-auto">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 mb-4">
                            <MdFeed size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-white">
                            No activities yet
                        </h3>
                        <p className="mt-2 text-sm text-gray-400">
                            {scope === 'me'
                                ? "You haven't added or updated any items in this category yet."
                                : 'No activity records found for this category yet.'}
                        </p>
                        <div className="mt-6 flex justify-center gap-3">
                            <Link
                                href="/search"
                                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 transition-colors"
                            >
                                <MdSearch size={18} />
                                Find & Add Media
                            </Link>
                            <Link
                                href="/library"
                                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-gray-200 hover:bg-white/15 transition-colors"
                            >
                                Go to Library
                            </Link>
                        </div>
                    </div>
                )}

                {!isLoading && !isError && activities.length > 0 && (
                    <div className="space-y-4">
                        {activities.map((activity, index) => (
                            <ActivityCard
                                key={`${activity.id}-${index}`}
                                activity={activity}
                            />
                        ))}

                        <div ref={loadMoreRef} className="h-6 w-full" />

                        {isFetchingNextPage && (
                            <div className="space-y-4 pt-2">
                                <div className="h-40 rounded-2xl bg-white/5 border border-white/10 animate-pulse p-4 flex items-center justify-center text-sm text-gray-400">
                                    Loading more activities...
                                </div>
                            </div>
                        )}

                        {!hasNextPage && activities.length > 0 && (
                            <div className="py-8 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                                <MdCheckCircle
                                    className="text-emerald-500"
                                    size={18}
                                />
                                <span>
                                    You&apos;re all caught up! (
                                    {activities.length} of {totalCount}{' '}
                                    activities)
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
