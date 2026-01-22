'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import TechnicalExplainer from '@/app/components/TechnicalExplainer';

// Track actual network requests
let requestCounter = 0;

// Use a real external API endpoint with artificial delay to demonstrate deduplication
const fetchSlowData = async () => {
    // Increment the counter BEFORE the request
    requestCounter++;
    const currentRequestId = requestCounter;

    console.log(`🌐 Network Request #${currentRequestId} STARTED`);

    // Artificial delay to create a clear "in-flight" window for deduplication
    await new Promise(resolve => setTimeout(resolve, 2000));

    const res = await fetch('https://jsonplaceholder.typicode.com/todos/' + Math.floor(Math.random() * 200));
    const data = await res.json();

    console.log(`✅ Network Request #${currentRequestId} COMPLETED`);

    return {
        id: data.id,
        timestamp: new Date().toLocaleTimeString(),
        title: data.title,
        requestId: currentRequestId
    };
};

function DataBox({ title, color, fetchTrigger }: { title: string, color: string, fetchTrigger: number }) {
    // Both components use the SAME query key with fetchTrigger
    // When fetchTrigger changes, both components request new data simultaneously
    // React Query automatically deduplicates these into ONE network request!
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['dedupe-demo', fetchTrigger],
        queryFn: fetchSlowData,
        staleTime: 0,
    });

    return (
        <div className={`p-6 rounded-xl border-2 transition-all ${isFetching ? 'border-dashed border-amber-400 bg-amber-50 animate-pulse' : isLoading ? 'border-dashed border-slate-300' : 'border-solid border-' + color + '-500 bg-' + color + '-50'}`}>
            <div className="flex items-center justify-between mb-3">
                <h3 className={`font-bold text-${color}-700`}>{title}</h3>
                {isFetching && <span className="text-xs text-amber-600 font-semibold animate-pulse">🔄 Fetching...</span>}
            </div>
            {isLoading ? (
                <div className="flex items-center gap-2 text-slate-500 animate-pulse">
                    <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                    Loading...
                </div>
            ) : (
                <div className="space-y-1">
                    <div className={`text-2xl font-mono font-bold text-${color}-900`}>#{data?.id ?? 'N/A'}</div>
                    <div className="text-xs text-slate-500">Fetched at: {data?.timestamp ?? 'N/A'}</div>
                    <div className="text-xs font-bold text-amber-600">Request ID: {data?.requestId ?? 'N/A'}</div>
                </div>
            )}
        </div>
    );
}

export default function DedupePage() {
    const [showSecond, setShowSecond] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [actualRequests, setActualRequests] = useState(0);
    const [fetchTrigger, setFetchTrigger] = useState(0);

    const handleSpamClick = () => {
        const beforeCount = requestCounter;
        setClickCount(c => c + 1);

        // Change fetchTrigger to cause BOTH components to fetch simultaneously
        // React Query will see they have the same query key and deduplicate!
        setFetchTrigger(Date.now());

        // Update the actual request count after a short delay
        setTimeout(() => {
            const newRequests = requestCounter - beforeCount;
            setActualRequests(prev => prev + newRequests);
        }, 100);
    };

    const resetCounters = () => {
        setClickCount(0);
        setActualRequests(0);
        requestCounter = 0;
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">In-flight Deduplication</h1>
                <p className="text-slate-600 mt-2">
                    TanStack Query automatically shares the same promise for simultaneous requests.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Demo */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-panel p-6 rounded-2xl">
                        <div className="flex gap-4 mb-6 sticky top-4 z-10 bg-white/50 backdrop-blur p-2 rounded-xl border border-white/20">
                            <button
                                onClick={() => setFetchTrigger(Date.now())}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
                            >
                                Refetch Both
                            </button>
                            <button
                                onClick={() => setShowSecond(!showSecond)}
                                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition bg-white"
                            >
                                {showSecond ? 'Hide' : 'Show'} Component B
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <DataBox title="Component A" color="indigo" fetchTrigger={fetchTrigger} />

                            {showSecond && (
                                <DataBox title="Component B" color="emerald" fetchTrigger={fetchTrigger} />
                            )}
                        </div>

                        <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100 text-sm text-indigo-800">
                            <strong>✨ The Magic:</strong> Click "Refetch Both" or use individual buttons while both components are visible.
                            Notice both components show the <strong>same Request ID</strong> - proving only ONE network call was made!
                        </div>
                    </div>
                </div>

                {/* Spam Experiment */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-bl-xl">
                            LIVE DEMO
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Request Coalescing</h3>
                        <p className="text-sm text-slate-500 mb-4">
                            Click rapidly (10+ times) while the request is loading. Watch the magic happen!
                        </p>

                        <button
                            onClick={handleSpamClick}
                            className="w-full py-4 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-200 transition-all active:scale-95 flex flex-col items-center gap-1"
                        >
                            <span>🔥 SPAM CLICK ME 🔥</span>
                            <span className="text-xs font-normal opacity-90">(Click 10+ times fast!)</span>
                        </button>

                        <div className="mt-6 space-y-3">
                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-100">
                                <div className="text-center flex-1">
                                    <div className="text-3xl font-bold text-slate-700">{clickCount}</div>
                                    <div className="text-xs text-slate-400 uppercase font-semibold">Button Clicks</div>
                                </div>
                                <div className="text-2xl text-slate-300">→</div>
                                <div className="text-center flex-1">
                                    <div className="text-3xl font-bold text-emerald-600">{actualRequests || requestCounter}</div>
                                    <div className="text-xs text-emerald-600 uppercase font-semibold">Network Requests</div>
                                </div>
                            </div>

                            <button
                                onClick={resetCounters}
                                className="w-full py-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition"
                            >
                                Reset Counters
                            </button>
                        </div>

                        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <p className="text-xs text-amber-800">
                                <strong>💡 Tip:</strong> Each request takes 2 seconds. Click the button 10 times within those 2 seconds to see deduplication in action!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <TechnicalExplainer
                title="Request Coalescing (Deduplication)"
                analogy="Ordering Pizza. If you and 5 friends all shout &apos;I want pizza!&apos; at the same specific time, you don&apos;t call the pizza place 5 times. You just make ONE call. Everyone gets happy when the pizza arrives."
                points={[
                    "Shared Promises: When multiple parts of your app ask for the same data while a request is in-flight, they share that request.",
                    "One Request: During the 2-second loading window, all clicks are deduplicated into a single network call.",
                    "Instant Updates: When the answer comes back, everyone who asked gets it at the exact same millisecond.",
                    "Observable: The Request ID proves both components received data from the same network call!"
                ]}
                codeSnippet={`// Even if called 100 times during loading:
queryClient.invalidateQueries(['dedupe']);

// TanStack Query checks:
// "Is there already a request in flight for ['dedupe']?"
// YES -> Do nothing, wait for that one to finish.
// NO -> Start a new request.`}
            />
        </div>
    );
}
