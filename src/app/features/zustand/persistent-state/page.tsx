'use client';

import { usePreferencesStore } from '@/app/store/usePreferencesStore';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import TechnicalExplainer from '@/app/components/TechnicalExplainer';

// Hydration helper to avoid checking window/localStorage on server
function useStoreHydrated<T>(useStore: (callback: (state: T) => unknown) => unknown) {
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHydrated(true);
    }, []);
    return hydrated;
}

export default function ZustandDemoPage() {
    const settings = usePreferencesStore((state) => state);
    const hydrated = useStoreHydrated(usePreferencesStore);

    // Avoid hydration mismatch by waiting for client mount
    if (!hydrated) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-4 w-32 bg-slate-200 rounded mb-4"></div>
                    <div className="h-32 w-full bg-slate-100 rounded-xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link
                    href="/features/zustand"
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                >
                    ← Back
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Client State Persistence</h1>
                    <p className="text-slate-600 mt-2">
                        Demonstrating `zustand` with `persist` middleware. Changes here save to `localStorage` and survive refreshes.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Configuration Panel */}
                <div className="glass-panel p-6 rounded-2xl space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">Preferences</h2>

                    {/* Layout Toggle */}
                    <div className="flex items-center justify-between">
                        <span className="text-slate-600 font-medium">Layout Mode</span>
                        <div className="flex p-1 bg-slate-100 rounded-lg">
                            <button
                                onClick={() => settings.setLayout('grid')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${settings.layout === 'grid' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Grid
                            </button>
                            <button
                                onClick={() => settings.setLayout('list')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${settings.layout === 'list' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                List
                            </button>
                        </div>
                    </div>

                    {/* Notification Toggle */}
                    <div className="flex items-center justify-between">
                        <span className="text-slate-600 font-medium">Notifications</span>
                        <button
                            onClick={settings.toggleNotifications}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.notificationsEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                        >
                            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    {/* Sidebar Toggle */}
                    <div className="flex items-center justify-between">
                        <span className="text-slate-600 font-medium">Sidebar</span>
                        <button
                            onClick={settings.toggleSidebar}
                            className={`w-12 h-6 rounded-full transition-colors relative ${!settings.sidebarCollapsed ? 'bg-indigo-500' : 'bg-slate-300'}`}
                        >
                            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${!settings.sidebarCollapsed ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <button
                        onClick={settings.resetPreferences}
                        className="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    >
                        Reset to Defaults
                    </button>
                </div>

                {/* Live Preview */}
                <div className="bg-slate-900 text-slate-200 p-8 rounded-2xl shadow-xl font-mono text-sm relative overflow-hidden">
                    <div className="absolute top-4 right-4 text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">
                        localStorage
                    </div>
                    <pre className="z-10 relative">
                        {JSON.stringify({
                            state: {
                                layout: settings.layout,
                                theme: settings.theme,
                                sidebarCollapsed: settings.sidebarCollapsed,
                                notificationsEnabled: settings.notificationsEnabled,
                                widgets: settings.widgets
                            },
                            version: 0
                        }, null, 2)}
                    </pre>
                    <p className="mt-8 text-slate-500 text-xs italic">
                        Try refreshing the page! This state is persisted automatically.
                    </p>
                </div>
            </div>

            <TechnicalExplainer
                title="Async Storage Persistence"
                points={[
                    "Middleware: We use the `persist` middleware to automatically synchronize the store with storage (localStorage on web, AsyncStorage on Native).",
                    "Hydration Handling: Next.js renders HTML on the server. If we accessed localStorage immediately, the server HTML (empty/default) wouldn't match the client HTML (persisted data), causing hydration errors.",
                    "Solution: We use a lightweight hydration check (`useStoreHydrated`) or `useEffect` to only render the persisted state once mounted on the client."
                ]}
                codeSnippet={`export const useStore = create(
  persist(
    (set) => ({ ... }),
    {
      name: 'storage-key',
      storage: createJSONStorage(() => localStorage),
    }
  )
);`}
            />
        </div>
    );
}
