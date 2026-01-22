'use client';

import Link from 'next/link';
import { create } from 'zustand';

// Simple store WITHOUT persistence middleware
interface CounterStore {
    count: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
}

const useInMemoryStore = create<CounterStore>((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
    reset: () => set({ count: 0 }),
}));

export default function InMemoryStatePage() {
    const { count, increment, decrement, reset } = useInMemoryStore();

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex items-center gap-4">
                <Link
                    href="/features/zustand"
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                >
                    ← Back
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">In-Memory State</h1>
                    <p className="text-slate-600">Standard Zustand store without persistence middleware.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-slate-800">Counter Demo</h2>
                        <p className="text-slate-500">
                            Increment the counter, then <span className="font-semibold text-indigo-600">refresh the page</span>.
                            The value will reset to 0 because it&apos;s only stored in memory.
                        </p>
                    </div>

                    <div className="flex items-center justify-center p-12 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-6xl font-mono font-bold text-slate-800 tabular-nums">
                            {count}
                        </span>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={decrement}
                            className="flex-1 px-4 py-3 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 rounded-lg font-medium transition-all active:scale-95"
                        >
                            - Decrease
                        </button>
                        <button
                            onClick={increment}
                            className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 rounded-lg font-medium transition-all active:scale-95"
                        >
                            + Increase
                        </button>
                    </div>

                    <button
                        onClick={reset}
                        className="w-full px-4 py-2 text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
                    >
                        Reset to Zero
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                        <h3 className="font-semibold text-indigo-900 mb-2">Think of it like...</h3>
                        <p className="text-indigo-800 text-sm mb-4 leading-relaxed">
                            <strong>A Classroom Whiteboard</strong>. You can write on it during class (the session). But when the class ends and the janitor comes (refresh), it gets wiped clean.
                        </p>
                        <p className="text-indigo-800 text-sm leading-relaxed">
                            (If you want it to stay, you need a Notebook... aka Database or LocalStorage).
                        </p>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-xl overflow-x-auto text-sm">
                        <code className="language-typescript text-slate-300">
                            <span className="text-purple-400">const</span> <span className="text-blue-400">useSTORE</span> = <span className="text-yellow-400">create</span>((<span className="text-orange-400">set</span>) {'=>'} ({'{'}{'\n'}
                            {'  '}count: <span className="text-red-400">0</span>,{'\n'}
                            {'  '}inc: () {'=>'} <span className="text-yellow-400">set</span>(s {'=>'} ({'{ c: s.c + 1 }'})),{'\n'}
                            {'}'}));
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
}
