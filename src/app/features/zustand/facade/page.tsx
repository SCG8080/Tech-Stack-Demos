'use client';

import Link from 'next/link';

export default function FacadePatternPage() {
    return (
        <div className="space-y-12">
            <div className="flex items-center gap-4">
                <Link
                    href="/features/zustand"
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                >
                    ← Back
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">The Store Facade Pattern</h1>
                    <p className="text-slate-600">Architecting "Dumb" UIs with a Smart Data Layer.</p>
                </div>
            </div>

            {/* Architecture Explanation */}
            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-900">Why separate the Store?</h2>
                    <p className="text-slate-600 leading-relaxed">
                        In a scalable frontend architecture, your UI components should ideally be <strong>"Presentation Only"</strong>.
                        They shouldn't contain complex logic about <em>how</em> to fetch data, <em>when</em> to cache it, or <em>how</em> to transform it.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        The <strong>Store Facade Pattern</strong> treats your Global Store (Zustand) as the single source of truth and interaction for the UI.
                    </p>

                    <ul className="space-y-4 mt-6">
                        <li className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0">1</div>
                            <div>
                                <strong className="block text-slate-900">Selectors (Read)</strong>
                                <span className="text-sm text-slate-500">Components "subscribe" to specific slices of state. They re-render ONLY when that specific slice changes.</span>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">2</div>
                            <div>
                                <strong className="block text-slate-900">Actions (Write)</strong>
                                <span className="text-sm text-slate-500">Components trigger semantic actions (e.g., `loginUser`) rather than calling APIs directly. The store handles the async complexity.</span>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="inline-block p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                            <code className="text-sm font-mono text-purple-600">useUserStore(selectUser)</code>
                        </div>
                        <div className="text-slate-300 text-2xl">⬇️</div>
                        <div className="inline-block p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                            <code className="text-sm font-mono text-slate-600">&lt;UserProfile user={'{user}'} /&gt;</code>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Diagram */}
            <section className="bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-bl-xl">ARCHITECTURE FLOW</div>

                <div className="flex flex-col gap-12 relative z-10">
                    {/* Layer 1: UI */}
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-full md:w-48 text-right md:text-right text-slate-400 font-bold uppercase tracking-wider text-sm">Presentation Layer</div>
                        <div className="flex-1 p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white">
                            <strong className="block text-lg mb-2">UI Components</strong>
                            <p className="text-slate-300 text-sm">"I need the current user."</p>
                            <p className="text-slate-300 text-sm">"I want to update the profile."</p>
                        </div>
                    </div>

                    {/* Connector */}
                    <div className="absolute left-[8.5rem] top-[6rem] bottom-[6rem] w-0.5 border-l-2 border-dashed border-slate-700 hidden md:block"></div>

                    {/* Layer 2: Facade */}
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-full md:w-48 text-right md:text-right text-indigo-400 font-bold uppercase tracking-wider text-sm">The Store (Facade)</div>
                        <div className="flex-1 grid md:grid-cols-2 gap-6">
                            <div className="p-6 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-300">
                                <strong className="block text-white mb-2">Selectors</strong>
                                <code className="text-xs font-mono bg-black/30 px-2 py-1 rounded block mb-2">state.user</code>
                                <span className="text-sm">Transforms raw data for the UI.</span>
                            </div>
                            <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300">
                                <strong className="block text-white mb-2">Actions</strong>
                                <code className="text-xs font-mono bg-black/30 px-2 py-1 rounded block mb-2">updateProfile(formData)</code>
                                <span className="text-sm">Orchestrates API calls, optimistic updates, and error handling.</span>
                            </div>
                        </div>
                    </div>

                    {/* Layer 3: Data */}
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-full md:w-48 text-right md:text-right text-slate-500 font-bold uppercase tracking-wider text-sm">Infrastructure</div>
                        <div className="flex-1 flex gap-4">
                            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 text-slate-400 text-sm flex-1 text-center">
                                Live Data (WebSocket)
                            </div>
                            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 text-slate-400 text-sm flex-1 text-center">
                                REST API
                            </div>
                            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 text-slate-400 text-sm flex-1 text-center">
                                Persistence (Storage)
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
