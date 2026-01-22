'use client';

import { useState } from 'react';
import Link from 'next/link';
import TechnicalExplainer from '@/app/components/TechnicalExplainer';

function BrowserFrame({ title, children, isLoading }: { title: string, children: React.ReactNode, isLoading: boolean }) {
    return (
        <div className="bg-white rounded-xl overflow-hidden border border-slate-300 shadow-xl flex flex-col h-80">
            {/* Fake Browser Bar */}
            <div className="bg-slate-100 border-b border-slate-200 p-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-slate-500 font-mono text-center truncate">
                    https://example.com/{title.toLowerCase()}
                </div>
            </div>
            {/* Viewport */}
            <div className="flex-1 p-6 overflow-auto relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 backdrop-blur-sm">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}

function SourceCodeFrame({ code }: { code: string }) {
    return (
        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-xl flex flex-col h-80">
            <div className="bg-slate-800 p-2 flex items-center justify-between px-4">
                <span className="text-xs text-slate-400 font-mono">view-source:</span>
            </div>
            <pre className="flex-1 p-4 text-xs font-mono text-green-400 overflow-auto whitespace-pre-wrap">
                {code}
            </pre>
        </div>
    );
}

export default function RenderingModesPage() {
    const [mode, setMode] = useState<'SSR' | 'CSR'>('SSR');
    const [isLoading, setIsLoading] = useState(false);

    // Simulated reloading
    const reload = (newMode: 'SSR' | 'CSR') => {
        setMode(newMode);
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), newMode === 'SSR' ? 400 : 1200); // CSR is "slower" to interactive
    };

    const data = {
        title: "Product: Super Widget",
        price: "$99.99",
        desc: "Best widget ever."
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
                <Link href="/features/next" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                    ← Back
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Rendering Patterns</h1>
                    <p className="text-slate-600">Interact to feel the difference between Server (SSR) and Client (CSR) rendering.</p>
                </div>
            </div>

            {/* CONTROL PANEL */}
            <div className="flex justify-center gap-4 mb-8">
                <button
                    onClick={() => reload('SSR')}
                    className={`px-6 py-3 rounded-lg font-bold transition-all ${mode === 'SSR' ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                >
                    SSR / Static (Server)
                </button>
                <button
                    onClick={() => reload('CSR')}
                    className={`px-6 py-3 rounded-lg font-bold transition-all ${mode === 'CSR' ? 'bg-pink-600 text-white shadow-lg scale-105' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                >
                    CSR (Client)
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">

                {/* LEFT: WHAT THE USER SEES */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        👁️ What the User Sees
                        {mode === 'SSR'
                            ? <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Instant Content</span>
                            : <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">Loading Spinner First</span>
                        }
                    </h3>
                    <BrowserFrame title={mode} isLoading={isLoading}>
                        {mode === 'CSR' && isLoading ? null : (
                            <div className="space-y-4 animate-in fade-in duration-500">
                                <div className="h-32 bg-slate-100 rounded-lg mb-4 flex items-center justify-center text-4xl">📦</div>
                                <h1 className="text-2xl font-bold text-slate-900">{data.title}</h1>
                                <div className="text-xl font-bold text-green-600">{data.price}</div>
                                <p className="text-slate-500">{data.desc}</p>
                            </div>
                        )}
                    </BrowserFrame>
                </div>

                {/* RIGHT: WHAT RYAN (THE BOT) SEES (Source Code) */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        🤖 What Google/SEO Bot Sees (View Source)
                        {mode === 'SSR'
                            ? <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Good for SEO</span>
                            : <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Bad for SEO</span>
                        }
                    </h3>
                    <SourceCodeFrame
                        code={mode === 'SSR'
                            ? `<html>
  <body>
    <h1>${data.title}</h1>
    <div>${data.price}</div>
    <p>${data.desc}</p>
  </body>
</html>`
                            : `<html>
  <body>
    <div id="root"></div>
    <script src="bundle.js"></script>
    <!-- Content is empty until JS loads! -->
  </body>
</html>`}
                    />
                </div>
            </div>

            <div className="mt-12">
                <TechnicalExplainer
                    title={mode === 'SSR' ? "Server-Side Rendering (SSR) / Static (SSG)" : "Client-Side Rendering (CSR)"}
                    analogy={mode === 'SSR'
                        ? "Like buying a completed painting. You unwrap it and it's already done. The artist painted it before shipping it to you."
                        : "Like buying a 'Paint by Numbers' kit. You get a blank canvas (empty HTML) and instructions (JS). You have to paint it yourself before you see the picture."
                    }
                    points={mode === 'SSR' ? [
                        "HTML is generated on the Server (or at Build time).",
                        "Browser receives full content immediately.",
                        "Great for SEO (Bots can read it).",
                        "Faster 'First Contentful Paint' (FCP)."
                    ] : [
                        "HTML is empty initially.",
                        "Browser downloads JS, executes it, then fetches data.",
                        "User sees a blank screen or spinner first.",
                        "Cheaper for the server (your device does the work), but slower for the user."
                    ]}
                />
            </div>
        </div>
    );
}
