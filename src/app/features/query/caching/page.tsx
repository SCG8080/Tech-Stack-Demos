'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';

const fetchRandom = async () => {
    // Artificial delay to make loading state visible
    await new Promise(r => setTimeout(r, 1000));
    return Math.random().toString(36).substring(7).toUpperCase();
};

function CachedData() {
    const { data, isLoading, isStale, isFetching, dataUpdatedAt } = useQuery({
        queryKey: ['caching-demo'],
        queryFn: fetchRandom,
        staleTime: 5000, // Considered fresh for 5 seconds
        gcTime: 10000,   // Kept in memory for 10 seconds
    });

    // eslint-disable-next-line react-hooks/purity
    const timeSinceUpdate = dataUpdatedAt ? Date.now() - dataUpdatedAt : 0;

    return (
        <div className="space-y-4">
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Data ID</div>
                        {isLoading ? (
                            <div className="h-8 w-24 bg-slate-200 animate-pulse rounded mt-1" />
                        ) : (
                            <div className="text-3xl font-mono font-bold text-slate-900">{data}</div>
                        )}
                    </div>
                    <div className="text-right">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                            {isLoading ? 'Loading' : isFetching ? 'Background Refetch' : isStale ? 'Stale (Cached)' : 'Fresh (Cached)'}
                        </div>
                    </div>
                </div>

                <div className="text-xs text-slate-500 font-mono">
                    Last Updated: {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'Never'}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="text-sm text-slate-600 bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <strong className="text-blue-900 block mb-2">Experiment:</strong>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Click "Unmount" below.</li>
                        <li>Return within <strong>5s</strong>: Data shows instantly (Fresh).</li>
                        <li>Return between <strong>5-10s</strong>: Data shows instantly (Stale) then updates.</li>
                        <li>Return after <strong>10s</strong>: Hard loading state (Cache Garbage Collected).</li>
                    </ul>
                </div>

                <div className="text-sm text-stone-600 bg-stone-50 p-4 rounded-lg border border-stone-100">
                    <strong className="text-stone-900 block mb-2">Think of it like food...</strong>
                    <ul className="space-y-2">
                        <li>
                            <code className="bg-white px-1 rounded border border-stone-200 font-bold">staleTime</code> = <strong>Best Before Date</strong>.<br />
                            Food is still in the fridge. You can eat it, but maybe check if there's a fresh one at the store (refetch).
                        </li>
                        <li>
                            <code className="bg-white px-1 rounded border border-stone-200 font-bold">gcTime</code> = <strong>Trash Day</strong>.<br />
                            If you haven't eaten it by now, it gets thrown out. If you want it again, you have to go buy brand new food (hard loading).
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default function CachingPage() {
    const [showDemo, setShowDemo] = useState(true);

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link
                    href="/features/query"
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                >
                    ← Back
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Caching: TTL vs Garbage Collection</h1>
                    <p className="text-slate-600 mt-2">
                        Understanding the difference between <strong>Stale Time</strong> (Frequency of updates) and <strong>GC Time</strong> (Memory persistence).
                    </p>
                </div>
            </div>

            <div className="glass-panel p-8 rounded-2xl min-h-[400px]">
                {showDemo ? (
                    <div className="space-y-8">
                        <CachedData />
                        <button
                            onClick={() => setShowDemo(false)}
                            className="w-full py-3 border-2 border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300 transition-colors"
                        >
                            Unmount Component (Simulate Navigation Away)
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-center space-y-6">
                        <div className="text-slate-400">
                            Component Unmounted. Cache timer is ticking...
                        </div>
                        <button
                            onClick={() => setShowDemo(true)}
                            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-transform active:scale-95"
                        >
                            Mount Component (Simulate Navigation Back)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
