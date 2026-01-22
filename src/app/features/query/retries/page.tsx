'use client';

import { useQuery, useQueryErrorResetBoundary } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import TechnicalExplainer from '@/app/components/TechnicalExplainer';

// deterministically fail X times then succeed
let failCount = 0;
const MAX_FAILURES = 3;

const fetchFlaky = async () => {
    // Artificial delay
    await new Promise(r => setTimeout(r, 1000));

    // Simulate failure
    if (failCount < MAX_FAILURES) {
        failCount++;
        throw new Error('Server overloaded (Simulated Error)');
    }

    return {
        id: Math.random().toString(36).substr(2, 9),
        message: 'Success! You persisted.',
        timestamp: new Date().toLocaleTimeString()
    };
};

export default function RetriesPage() {
    const { reset } = useQueryErrorResetBoundary();
    const [key, setKey] = useState(0); // To reset the demo completely

    const { data, isLoading, isError, failureCount, failureReason, isSuccess } = useQuery({
        queryKey: ['retries-demo', key],
        queryFn: fetchFlaky,
        retry: 5, // retry 5 times
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff: 1s, 2s, 4s...
    });

    const resetDemo = () => {
        failCount = 0;
        setKey(k => k + 1);
        reset(); // clear error boundaries if any
    };

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
                    <h1 className="text-3xl font-bold text-slate-900">Automatic Retries</h1>
                    <p className="text-slate-600">Smart error handling with exponential backoff strategies.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg relative overflow-hidden">

                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold text-slate-800">Status Monitor</h2>
                            <button
                                onClick={resetDemo}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 underline"
                            >
                                Reset Demo
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {/* Visual Timeline */}
                            <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-2 px-2">
                                <span>Start</span>
                                <span>Attempt 1</span>
                                <span>Attempt 2</span>
                                <span>Attempt 3</span>
                                <span>Success</span>
                            </div>
                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                                <div className={`h-full transition-all duration-500 ease-out ${failureCount >= 0 && isLoading ? 'bg-amber-400' : isError ? 'bg-red-500' : 'bg-slate-200'}`} style={{ width: '20%' }} />
                                <div className={`h-full transition-all duration-500 ease-out border-l border-white ${failureCount >= 1 ? 'bg-amber-400' : 'bg-transparent'}`} style={{ width: '20%' }} />
                                <div className={`h-full transition-all duration-500 ease-out border-l border-white ${failureCount >= 2 ? 'bg-amber-400' : 'bg-transparent'}`} style={{ width: '20%' }} />
                                <div className={`h-full transition-all duration-500 ease-out border-l border-white ${failureCount >= 3 ? 'bg-emerald-500' : 'bg-transparent'}`} style={{ width: '40%' }} />
                            </div>

                            {isLoading && (
                                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                                    <div>
                                        <div className="font-bold text-amber-900">Attempting to connect...</div>
                                        <div className="text-xs text-amber-700">Failure Count: {failureCount}</div>
                                        <div className="text-xs text-amber-600 font-mono mt-1">
                                            {failureReason ? `Last Error: ${failureReason.message}` : 'Connecting...'}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isSuccess && (
                                <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">✓</div>
                                    <div>
                                        <div className="font-bold text-emerald-900">Connection Established</div>
                                        <div className="text-xs text-emerald-700">{data.message}</div>
                                    </div>
                                </div>
                            )}

                            {isError && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <div className="font-bold text-red-900">Fatal Error</div>
                                    <div className="text-xs text-red-700">Max retries exceeded. The server is unreachable.</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 p-6 rounded-xl shadow-inner text-slate-300 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                        <pre className="font-mono text-xs overflow-x-auto">
                            {`useQuery({
  queryKey: ['flaky-api'],
  queryFn: fetchFlaky,
  // Retry 3 times (default is 3)
  retry: 3, 
  
  // Exponential Backoff
  retryDelay: (attempt) => 
    Math.min(1000 * 2 ** attempt, 30000),
})`}
                        </pre>
                    </div>
                </div>
            </div>

            <TechnicalExplainer
                title="Retry Strategies"
                analogy="Knocking on a friend&apos;s door. You knock once. No answer. You wait 5 seconds. Knock again loudly. Wait 10 seconds. Knock really loud. If still no answer, you leave. You don&apos;t just rapid-fire knock 100 times in 1 second!"
                points={[
                    "Default Behavior: TanStack Query automatically retries failed queries 3 times before showing an error.",
                    "Exponential Backoff: It waits longer between each attempt (1s, 2s, 4s...) to avoid overwhelming a struggling server.",
                    "Configuration: You can customize `retry`, `retryDelay`, or turn it off entirely for 404s."
                ]}
                codeSnippet=""
            />
        </div>
    );
}
