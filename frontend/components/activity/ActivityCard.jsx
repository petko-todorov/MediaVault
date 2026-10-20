'use client';

import Link from 'next/link';
import {
    MdAccessTime,
    MdArrowForward,
    MdLibraryAdd,
    MdOutlineCompareArrows,
    MdCheck,
} from 'react-icons/md';
import { IoLink } from 'react-icons/io5';

const STATUS_LABELS = {
    watching: 'Watching',
    playing: 'Playing',
    completed: 'Completed',
    planned: 'Planned',
    dropped: 'Dropped',
};

const STATUS_STYLES = {
    watching: 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
    playing: 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
    completed: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    planned: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    dropped: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
};

const MEDIA_STYLES = {
    game: 'bg-orange-800/60 text-amber-300',
    tv: 'bg-violet-600/80 text-purple-100',
    series: 'bg-violet-600/80 text-purple-100',
    movie: 'bg-sky-500/80 text-blue-100',
};

function formatRelativeTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
}

function getUserInitials(user) {
    if (!user) return '?';
    if (user.first_name) {
        return (
            user.first_name[0] + (user.last_name ? user.last_name[0] : '')
        ).toUpperCase();
    }
    if (user.username) {
        return user.username.slice(0, 2).toUpperCase();
    }
    return 'U';
}

function getUserDisplayName(user) {
    if (!user) return 'Anonymous';
    if (user.first_name) {
        return `${user.first_name} ${user.last_name || ''}`.trim();
    }
    if (user.username) {
        return user.username.split('@')[0];
    }
    return 'User';
}

export default function ActivityCard({ activity }) {
    const isGame = activity.media_type === 'game' || !!activity.game;
    const item = isGame ? activity.game : activity.media_item;

    if (!item) return null;

    const mediaType = isGame
        ? 'game'
        : item.media_type || activity.media_type || 'movie';

    const mediaLabel =
        mediaType === 'game'
            ? 'Game'
            : ['tv', 'series'].includes(mediaType)
              ? 'TV Series'
              : 'Movie';

    const isStatusChange = activity.activity_type === 'status_change';
    const userName = getUserDisplayName(activity.user);
    const initials = getUserInitials(activity.user);
    const timeAgo = formatRelativeTime(activity.created_at);

    return (
        <article className="rounded-2xl border border-white/10 bg-[#161C26]/80 p-4 sm:p-5 transition-all duration-200 hover:border-white/20 hover:bg-[#161C26] shadow-lg">
            {/* Header: User & Action */}
            <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-sm font-bold text-white shadow-md">
                        {initials}
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-white truncate text-sm sm:text-base">
                                {userName}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-400 flex items-center gap-1.5">
                                {isStatusChange ? (
                                    <>
                                        <MdOutlineCompareArrows className="text-indigo-400 shrink-0" />
                                        updated status
                                    </>
                                ) : (
                                    <>
                                        <MdLibraryAdd className="text-emerald-400 shrink-0" />
                                        added to library
                                    </>
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                    <MdAccessTime className="text-gray-500" />
                    <span>{timeAgo}</span>
                </div>
            </div>

            {/* Media details card */}
            <div className="flex gap-4 rounded-xl bg-white/5 border border-white/5 p-3 sm:p-4 hover:border-white/10 transition-colors">
                {/* Poster Thumbnail */}
                <div className="relative w-20 sm:w-24 h-28 sm:h-32 shrink-0 overflow-hidden rounded-lg bg-black/40 shadow-inner">
                    {item.poster ? (
                        <img
                            src={item.poster}
                            alt={item.title}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-500 text-center p-2">
                            No image
                        </div>
                    )}
                </div>

                {/* Info & Badges */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        {/* Top Badges Row */}
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span
                                className={`text-xs px-2.5 py-0.5 rounded-md font-medium ${
                                    MEDIA_STYLES[mediaType] || MEDIA_STYLES.movie
                                }`}
                            >
                                {mediaLabel}
                            </span>

                            {/* Status Change Transition or Initial Added Status */}
                            {isStatusChange ? (
                                <div className="inline-flex items-center gap-1 text-xs">
                                    {activity.from_status && (
                                        <span
                                            className={`px-2 py-0.5 rounded-md font-medium ${
                                                STATUS_STYLES[activity.from_status] ||
                                                'bg-gray-700 text-gray-300'
                                            }`}
                                        >
                                            {STATUS_LABELS[activity.from_status] ||
                                                activity.from_status}
                                        </span>
                                    )}
                                    <MdArrowForward className="text-gray-400" />
                                    <span
                                        className={`px-2 py-0.5 rounded-md font-medium ${
                                            STATUS_STYLES[activity.to_status] ||
                                            'bg-emerald-500/20 text-emerald-400'
                                        }`}
                                    >
                                        {STATUS_LABELS[activity.to_status] ||
                                            activity.to_status}
                                    </span>
                                </div>
                            ) : (
                                activity.to_status && (
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                                            STATUS_STYLES[activity.to_status] ||
                                            'bg-sky-500/20 text-sky-400'
                                        }`}
                                    >
                                        {STATUS_LABELS[activity.to_status] ||
                                            activity.to_status}
                                    </span>
                                )
                            )}
                        </div>

                        {/* Item Title */}
                        <h4 className="font-bold text-white text-base sm:text-lg line-clamp-1">
                            {item.title}
                        </h4>

                        {/* Year & Rating */}
                        <div className="text-xs sm:text-sm text-gray-300 mt-1 flex items-center gap-2">
                            {item.release_year && (
                                <span>{item.release_year}</span>
                            )}
                            {item.rating ? (
                                <span className="text-amber-400 flex items-center gap-0.5">
                                    ⭐ {Number(item.rating).toFixed(1)}
                                </span>
                            ) : null}
                        </div>

                        {/* Game Tags (if any) */}
                        {isGame && item.tags && item.tags.length > 0 && (
                            <div className="hidden sm:flex flex-wrap gap-1 mt-2">
                                {item.tags.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 capitalize"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bottom Links / Actions */}
                    <div className="mt-2 flex items-center gap-3">
                        {item.tmdb_url && (
                            <Link
                                href={item.tmdb_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                            >
                                <IoLink />
                                <span>TMDB</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}
