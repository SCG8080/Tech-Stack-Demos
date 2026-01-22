'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import TechnicalExplainer from '@/app/components/TechnicalExplainer';

const fetchTime = async () => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 500));
    const now = new Date();
    return { formatted: now.toLocaleTimeString() };
};

export default function PollingPage() {
    const [enabled, setEnabled] = useState(false);
    const [intervalMs, setIntervalMs] = useState(2000);

    const { data, isFetching } = useQuery({
        queryKey: ['polling-demo'],
        queryFn: fetchTime,
        refetchInterval: enabled ? intervalMs : false,
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Auto-Polling</h1>
                <p className="text-slate-600 mt-2">
                    Keep your UI in sync with the server automatically using `refetchInterval`.
                </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center gap-8">
                <div className="flex flex-col items-center">
                    <div className="text-sm text-slate-500 font-medium mb-1">LIVE SERVER TIME</div>
                    <div className="text-5xl font-mono font-bold text-slate-900 tabular-nums tracking-tight">
                        {data?.formatted || '--:--:--'}
                    </div>
                    <div className={`mt-4 h-6 text-sm font-medium text-emerald-600 transition-opacity duration-300 ${isFetching ? 'opacity-100' : 'opacity-0'}`}>
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            Updating...
                        </span>
                    </div>
                </div>

                <div className="w-full max-w-md bg-white p-6 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                        <span className="font-semibold text-slate-700">Polling Enabled</span>
                        <button
                            onClick={() => setEnabled(!enabled)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${enabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                        >
                            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <div className="space-y-2 opacity-90">
                        <label className="text-sm font-medium text-slate-600">Interval: {intervalMs}ms</label>
                        <input
                            type="range"
                            min="1000"
                            max="10000"
                            step="1000"
                            value={intervalMs}
                            onChange={(e) => setIntervalMs(Number(e.target.value))}
                            className="w-full accent-indigo-600"
                            disabled={!enabled}
                        />
                    </div>
                </div>
            </div>

            <TechnicalExplainer
                title="Interval-Based Refetching"
                points={[
                    "Auto-Sync: Useful for dashboards, tickers, or live status updates.",
                    "Window Focus Refetching: By default, TanStack Query also refetches when the user returns to the tab (focus), ensuring data is fresh even without polling.",
                    "Pause on Background: Polling automagically pauses when the tab is in the background to save resources."
                ]}
                codeSnippet={`useQuery({
  queryKey: ['polling-demo'],
  queryFn: fetchTime,
  // Polls every 2 seconds if enabled
  refetchInterval: enabled ? 2000 : false,
});`}
            />
        </div>
    );
}
