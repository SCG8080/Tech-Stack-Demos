'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import TechnicalExplainer from '@/app/components/TechnicalExplainer';

// Simulate network request for Static Export
const fetchSlowData = async () => {
    // Artificial delay to allow user to see "Loading..." state and test dedupe
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
        id: Math.floor(Math.random() * 10000),
        timestamp: new Date().toLocaleTimeString()
    };
};

function DataBox({ title, color }: { title: string, color: string }) {
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['dedupe-demo'],
        queryFn: fetchSlowData,
    });

    return (
        <div className={`p-6 rounded-xl border-2 ${isLoading ? 'border-dashed border-slate-300' : 'border-solid border-' + color + '-500 bg-' + color + '-50'}`}>
            <h3 className={`font-bold text-${color}-700 mb-2`}>{title}</h3>
            {isLoading ? (
                <div className="flex items-center gap-2 text-slate-500 animate-pulse">
                    <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                    Loading...
                </div>
            ) : (
                <div className="space-y-1">
                    <div className={`text-2xl font-mono font-bold text-${color}-900`}>{data?.id ?? 'N/A'}</div>
                    <div className="text-xs text-slate-500">Fetched at: {data?.timestamp ?? 'N/A'}</div>
                    {isFetching && <div className="text-xs text-amber-600 font-semibold animate-pulse">Refetching in background...</div>}
                </div>
            )}
        </div>
    );
}

export default function DedupePage() {
    const queryClient = useQueryClient();
    const [showSecond, setShowSecond] = useState(false);
    const [clickCount, setClickCount] = useState(0);

    const handleSpamClick = () => {
        setClickCount(c => c + 1);
        queryClient.invalidateQueries({ queryKey: ['dedupe-demo'] });
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
                                onClick={() => queryClient.invalidateQueries({ queryKey: ['dedupe-demo'] })}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
                            >
                                Refetch Once
                            </button>
                            <button
                                onClick={() => setShowSecond(!showSecond)}
                                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition bg-white"
                            >
                                {showSecond ? 'Hide' : 'Show'} Component B
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <DataBox title="Component A" color="indigo" />

                            {showSecond && (
                                <DataBox title="Component B" color="emerald" />
                            )}
                        </div>

                        <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-100 text-sm text-amber-800">
                            <strong>Observe:</strong> If you trigger a refetch while both are visible, they will both go into &quot;Loading/Fetching&quot; state simultaneously.
                            They will resolve at the exact same time with the exact same Random ID - proving only <strong>ONE</strong> function call executed.
                        </div>
                    </div>
                </div>

                {/* Spam Experiment */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-bl-xl">
                            EXPERIMENT
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Request Coalescing</h3>
                        <p className="text-sm text-slate-500 mb-6">
                            Click the button below rapidly. Even if you click it 10 times, if a request is already pending, Query won&apos;t send another one.
                        </p>

                        <button
                            onClick={handleSpamClick}
                            className="w-full py-4 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-200 transition-all active:scale-95 flex flex-col items-center gap-1"
                        >
                            <span>🔥 SPAM REFETCH 🔥</span>
                            <span className="text-xs font-normal opacity-90">(Click me fast!)</span>
                        </button>

                        <div className="mt-6 flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-slate-700">{clickCount}</div>
                                <div className="text-xs text-slate-400 uppercase font-semibold">Clicks</div>
                            </div>
                            <div className="text-slate-300">vs</div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-indigo-600">1</div>
                                <div className="text-xs text-indigo-400 uppercase font-semibold">Request</div>
                            </div>
                        </div>
                        <p className="text-xs text-center text-slate-400 mt-2">
                            (Simulated: Watch both components get the SAME Random ID at the SAME time!)
                        </p>
                    </div>
                </div>
            </div>

            <TechnicalExplainer
                title="Request Coalescing (Deduplication)"
                analogy="Ordering Pizza. If you and 5 friends all shout &apos;I want pizza!&apos; at the same specific time, you don&apos;t call the pizza place 5 times. You just make ONE call. Everyone gets happy when the pizza arrives."
                points={[
                    "Shared Promises: When multiple parts of your app ask for the same data at the same time, we group them.",
                    "One Request: We only send ONE message to the server, saving battery and data.",
                    "Instant Updates: When the answer comes back, everyone who asked gets it at the exact same millisecond."
                ]}
                codeSnippet={`// Even if called 100 times:
queryClient.invalidateQueries(['dedupe']);

// TanStack Query checks:
// "Is there already a request in flight for ['dedupe']?"
// YES -> Do nothing, wait for that one to finish.
// NO -> Start a new request.`}
            />
        </div>
    );
}
