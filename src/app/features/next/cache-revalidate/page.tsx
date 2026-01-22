'use client';

import { useState, useEffect } from 'react';
import TechnicalExplainer from '@/app/components/TechnicalExplainer';

// Simulate Server Data Generation
const generateStock = () => {
    const brands = ['Cola', 'Sprite', 'Fanta', 'Water', 'Tea'];
    const randomBrand = brands[Math.floor(Math.random() * brands.length)];
    const stockCode = Math.floor(Math.random() * 9999);
    return {
        product: randomBrand,
        stockId: `#${stockCode}`,
        lastRestocked: Date.now() // Store as timestamp for ISR math
    };
};

export default function CacheRevalidatePage() {
    const [inventory, setInventory] = useState<any>(null);
    const [isRestocking, setIsRestocking] = useState(false);
    const [isClient, setIsClient] = useState(false);

    // New State for ISR Policy
    const [revalidatePolicy, setRevalidatePolicy] = useState<number | 'force-cache'>('force-cache');
    // 'force-cache' = Forever
    // number = ISR duration in seconds

    useEffect(() => {
        setIsClient(true);

        // Load policy from local storage to persist across reloads
        const savedPolicy = localStorage.getItem('simulated-isr-policy');
        if (savedPolicy) {
            setRevalidatePolicy(savedPolicy === 'force-cache' ? 'force-cache' : Number(savedPolicy));
        }

        // Check "Server Cache"
        const cachedDataStr = localStorage.getItem('simulated-next-cache');

        if (cachedDataStr) {
            const cachedData = JSON.parse(cachedDataStr);
            const now = Date.now();
            const ageSeconds = (now - cachedData.lastRestocked) / 1000;

            // ISR CHECK: Is the data "stale"?
            let isStale = false;
            if (savedPolicy && savedPolicy !== 'force-cache') {
                const maxAge = Number(savedPolicy);
                if (ageSeconds > maxAge) {
                    isStale = true;
                }
            }

            if (isStale) {
                // EXPIRED: Auto-revalidate
                const newData = generateStock();
                localStorage.setItem('simulated-next-cache', JSON.stringify(newData));
                setInventory(newData);
            } else {
                // HIT: Use cached data
                setInventory(cachedData);
            }
        } else {
            // MISS: Generate new data and cache it
            const newData = generateStock();
            localStorage.setItem('simulated-next-cache', JSON.stringify(newData));
            setInventory(newData);
        }
    }, []);

    const handleRevalidate = async () => {
        setIsRestocking(true);
        await new Promise(r => setTimeout(r, 800));
        const newData = generateStock();
        localStorage.setItem('simulated-next-cache', JSON.stringify(newData));
        setInventory(newData);
        setIsRestocking(false);
    };

    const updatePolicy = (policy: number | 'force-cache') => {
        setRevalidatePolicy(policy);
        localStorage.setItem('simulated-isr-policy', String(policy));
    };

    if (!isClient || !inventory) return <div className="p-8 text-center text-slate-500">Loading Cache...</div>;

    const lastRestockDate = new Date(inventory.lastRestocked);
    const timeString = lastRestockDate.toLocaleTimeString();

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Caching & Revalidation</h1>
                <p className="text-slate-600 mt-2 text-lg">
                    Control the "Freshness Policy" of your data.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">

                {/* Visual Analogy - The Vending Machine */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-indigo-500 rounded-3xl rotate-1 group-hover:rotate-2 transition-transform opacity-20"></div>
                    <div className="relative bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-700 uppercase tracking-widest text-sm">Vending Machine</h3>
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                        </div>

                        <div className="bg-slate-100 rounded-xl p-6 text-center border-inset border-4 border-slate-200 mb-6">
                            <div className="text-5xl mb-2 animation-bounce">{inventory.product === 'Cola' ? '🥤' : inventory.product === 'Water' ? '💧' : '🧃'}</div>
                            <div className="text-2xl font-bold text-slate-800">{inventory.product}</div>
                            <div className="text-xs font-mono text-slate-400 mt-1">{inventory.stockId}</div>
                        </div>

                        <div className="bg-slate-900 text-green-400 font-mono text-xs p-3 rounded-lg flex justify-between">
                            <span>RESTOCKED:</span>
                            <span>{timeString}</span>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-6">
                    {/* Policy Selector */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            ⏱️ Cache Duration Policy
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => updatePolicy('force-cache')}
                                className={`p-3 rounded-lg text-sm font-medium border transition-all ${revalidatePolicy === 'force-cache' ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                            >
                                Forever (Default)
                            </button>
                            <button
                                onClick={() => updatePolicy(10)}
                                className={`p-3 rounded-lg text-sm font-medium border transition-all ${revalidatePolicy === 10 ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                            >
                                10 Seconds (ISR)
                            </button>
                            <button
                                onClick={() => updatePolicy(30)}
                                className={`p-3 rounded-lg text-sm font-medium border transition-all ${revalidatePolicy === 30 ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                            >
                                30 Seconds (ISR)
                            </button>
                            <button
                                onClick={() => updatePolicy(60)}
                                className={`p-3 rounded-lg text-sm font-medium border transition-all ${revalidatePolicy === 60 ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                            >
                                1 Minute (ISR)
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                            {revalidatePolicy === 'force-cache'
                                ? "Data persists indefinitely until you click Manual Revalidate."
                                : <span><strong>ISR (Incremental Static Regeneration):</strong> Next.js will rebuild this page in the background if a user visits after <strong>{revalidatePolicy} seconds</strong> have passed.</span>}
                        </p>
                    </div>


                    <button
                        onClick={handleRevalidate}
                        disabled={isRestocking}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${isRestocking
                            ? 'bg-slate-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                    >
                        {isRestocking ? 'Restocking...' : '🚚 Manual Revalidate'}
                    </button>

                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-3 px-6 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all border border-slate-200"
                    >
                        🔄 Reload Page
                    </button>
                </div>
            </div>

            <TechnicalExplainer
                title="Configuring Freshness"
                analogy="Default is like non-perishable food (lasts forever). ISR (Time-based) is like bread (fresh for 1 day, then needs replacing)."
                points={[
                    "force-cache (Default): Cache indefinitely. Usage: `fetch('/api', { cache: 'force-cache' })`",
                    "Time-Based (ISR): Valid for X seconds. Usage: `fetch('/api', { next: { revalidate: 3600 } })`",
                    "ISR = Incremental Static Regeneration: A fancy way of saying 'Keep the page static/fast, but rebuild it in the background every X seconds.'."
                ]}
            />
        </div>
    );
}
