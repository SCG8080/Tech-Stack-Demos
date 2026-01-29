'use client';

import Link from 'next/link';
import { useState } from 'react';
import TechnicalExplainer from '@/app/components/TechnicalExplainer';

export default function TailwindPage() {
    const [width, setWidth] = useState(100);

    return (
        <div className="space-y-12">
            <div className="flex items-center gap-4">
                <Link
                    href="/features"
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                >
                    ← Back to Demos
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Tailwind CSS</h1>
                    <p className="text-slate-600">Utility-first CSS framework for rapid UI development.</p>
                </div>
            </div>

            {/* Performance Section */}
            <section className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <span className="text-3xl">⚡</span> Why is it so fast?
                    </h2>
                    <p className="text-slate-600 leading-relaxed">
                        Tailwind generates CSS at <strong>build time</strong> using a Just-In-Time (JIT) compiler.
                        It scans your HTML/JS files for class names and generates styles <u>on demand</u>.
                    </p>
                    <ul className="space-y-3 mt-4">
                        <li className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">📦</div>
                            <div>
                                <strong className="block text-slate-900">Tiny Bundle Size</strong>
                                <span className="text-sm text-slate-500">Only the classes you actually use are included in the final CSS file. No unused styles.</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">🚀</div>
                            <div>
                                <strong className="block text-slate-900">No Runtime Overhead</strong>
                                <span className="text-sm text-slate-500">Unlike CSS-in-JS libraries (styled-components), expensive calculations don&apos;t happen in the browser.</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">JIT ENGINE</div>
                    <code className="block text-sm font-mono text-slate-300">
                        <span className="text-slate-500">{`// Your Code`}</span><br />
                        &lt;div class=&quot;<span className="text-sky-400">text-center p-4</span>&quot;&gt;<br /><br />
                        <span className="text-slate-500">{`// Generated CSS`}</span><br />
                        <span className="text-purple-400">.text-center</span> {'{'} <span className="text-sky-300">text-align: center;</span> {'}'}<br />
                        <span className="text-purple-400">.p-4</span> {'{'} <span className="text-sky-300">padding: 1rem;</span> {'}'}
                    </code>
                </div>
            </section>

            {/* Responsive Design Playground */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <span className="text-3xl">📱</span> Responsive Design
                    </h2>
                    <p className="text-slate-600">
                        Mobile-first breakpoints allow you to build complex adaptive layouts without writing a single media query.
                    </p>
                </div>

                <div className="bg-slate-100 p-8 rounded-3xl border border-slate-200">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Resize Container Width ({width}%)</label>
                        <input
                            type="range"
                            min="30"
                            max="100"
                            value={width}
                            onChange={(e) => setWidth(Number(e.target.value))}
                            className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1 font-mono">
                            <span>Mobile</span>
                            <span>Tablet (md)</span>
                            <span>Desktop (lg)</span>
                        </div>
                    </div>

                    <div
                        className="mx-auto bg-white rounded-xl shadow-lg border border-slate-300 overflow-hidden transition-all duration-300 relative"
                        style={{ width: `${width}%` }}
                    >
                        <div className="absolute top-2 right-2 flex gap-1">
                            <span className="px-2 py-1 bg-slate-100 rounded text-xs font-mono text-slate-500 border border-slate-200 block sm:hidden">default</span>
                            <span className="px-2 py-1 bg-indigo-100 rounded text-xs font-mono text-indigo-600 border border-indigo-200 hidden sm:block md:hidden">sm</span>
                            <span className="px-2 py-1 bg-purple-100 rounded text-xs font-mono text-purple-600 border border-purple-200 hidden md:block lg:hidden">md</span>
                            <span className="px-2 py-1 bg-emerald-100 rounded text-xs font-mono text-emerald-600 border border-emerald-200 hidden lg:block">lg</span>
                        </div>

                        <div className="p-6">
                            <div className="h-32 bg-slate-200 rounded-lg mb-4 flex items-center justify-center text-slate-400 font-bold text-xl">
                                Hero Image
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-24 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center text-indigo-300 font-bold">
                                        Item {i}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <code className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-mono inline-block">
                            grid-cols-1 <span className="text-indigo-400">sm:grid-cols-2</span> <span className="text-emerald-400">lg:grid-cols-4</span>
                        </code>
                    </div>
                </div>
            </section>

            {/* Adoption */}
            <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 text-white text-center">
                <h2 className="text-2xl font-bold mb-6">Industry Adoption</h2>
                <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                    Tailwind is used by modern tech companies for its scalability and design consistency.
                </p>
                <div className="flex flex-wrap justify-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Simple text placeholders for logos for demo purposes */}
                    <span className="text-xl font-bold tracking-tighter">OpenAI</span>
                    <span className="text-xl font-bold tracking-tighter">Shopify</span>
                    <span className="text-xl font-bold tracking-tighter">Netflix</span>
                    <span className="text-xl font-bold tracking-tighter">Vercel</span>
                    <span className="text-xl font-bold tracking-tighter">NASA</span>
                </div>
            </section>

            <TechnicalExplainer
                title="Utility-First Fundamentals"
                points={[
                    "Composition: Build complex components from primitive utilities.",
                    "Consistency: Values (colors, spacing) come from a central config file (tailwind.config.ts).",
                    "Maintainability: No more 'append-only' CSS files that grow forever. Changing HTML changes the style."
                ]}
                codeSnippet={`// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        brand: '#FF4154', // Custom color
      }
    }
  }
}`}
            />
        </div>
    );
}
