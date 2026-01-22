'use client';

import { useState } from 'react';
import TechnicalExplainer from '@/app/components/TechnicalExplainer';

// Simulate Server Action logic for Static Export
async function mockRevalidate() {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { formatted: new Date().toLocaleTimeString() };
}

export default function CacheRevalidatePage() {
    // Initial state simulating cached server data
    const [data, setData] = useState({ formatted: new Date().toLocaleTimeString() });
    const [loading, setLoading] = useState(false);

    const handleRevalidate = async () => {
        setLoading(true);
        // Simulate network/server action delay
        const newData = await mockRevalidate();
        setData(newData);
        setLoading(false);
    };

    return (
        <div className="space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Caching & Revalidation</h1>
                <p className="text-slate-600 mt-2">
                    (Static Export Mode) Simulating Next.js Data Cache and Server Actions.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Server Time Card */}
                <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                        SIMULATED SERVER
                    </div>
                    <h2 className="text-lg font-semibold text-slate-500 mb-2">Cached Time</h2>
                    <div className="text-4xl font-mono font-bold text-slate-900 tracking-tight">
                        {data.formatted}
                    </div>
                    <p className="text-xs text-slate-400 mt-4">
                        In a real server environment, this timestamp is cached on the server.
                    </p>
                </div>

                {/* Control Card */}
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 dashed border-2 flex flex-col items-center justify-center text-center">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Control Plane</h2>
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={handleRevalidate}
                            disabled={loading}
                            className={`px-6 py-3 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 transition-all ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105 active:scale-95'}`}
                        >
                            {loading ? 'Revalidating...' : 'Revalidate Path'}
                        </button>
                    </div>
                    <p className="text-sm text-slate-500 mt-4 max-w-xs">
                        Calls a simulated Server Action to purge the cache and fetch fresh data.
                    </p>
                </div>
            </div>

            <TechnicalExplainer
                title="Next.js Data Cache & Server Actions"
                points={[
                    "Data Cache: Next.js extends the native fetch API to include caching. By default, fetches are cached indefinitely unless opted out.",
                    "Server Actions: Functions that run on the server, callable from Client Components. They are the standard way to handle mutations.",
                    "Static Export Note: Since this demo is running as a static export (GitHub Pages), we are simulating the server-side behavior using client-side promises."
                ]}
                codeSnippet={`// 1. Fetch with Cache Tags
const res = await fetch('/api/...', {
  next: { tags: ['time-data'] } 
});

// 2. Server Action
'use server'
export async function revalidate() {
  revalidatePath('/path/to/page');
}`}
            />
        </div>
    );
}
