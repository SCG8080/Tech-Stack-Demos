'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HistoryPage() {
    const milestones = [
        {
            year: '2025', version: 'v16', title: 'The Cache Era',
            desc: 'A complete re-engineering of the caching heuristics. The new `<Cache>` component allows for declarative, granular control over component-level caching strategies, decoupling data fetching from caching (Dynamic IO). Turbopack reached 1.0 stability, becoming the default bundler for all projects.',
            features: ['React 19 Stable', 'Cache Components', 'Dynamic IO (Granular Caching)', 'Turbopack 1.0 (Default)'],
            code: `// Next.js 16: "use cache" directive
// Automatically cache complex computations or data fetches
import { db } from './db';

export async function getUserDashboard(id: string) {
  'use cache';
  cacheLife('1 hour'); // Declarative lifetime
  
  const user = await db.user.findUnique({ id });
  const metrics = await computeHeavyMetrics(user);
  return { user, metrics };
}`
        },
        {
            year: '2024', version: 'v15', title: 'Async Request APIs',
            desc: 'The transition to asynchronous Request APIs (`headers()`, `cookies()`) paved the way for better rendering optimization and security. The React Compiler entered Beta, automatically optimizing re-renders by effectively "forgetting" manual memoization hooks like `useMemo` and `useCallback`.',
            features: ['Async Cookies/Headers', 'React Compiler (Beta)', 'Standardized Interception', 'instrumentation.js Hook'],
            code: `// Next.js 15: Async Request APIs
import { headers, cookies } from 'next/headers';

export default async function Page() {
  // Awaiting headers opts-out of static rendering only when needed
  const headerList = await headers();
  const token = (await cookies()).get('auth-token');
  
  return <Dashboard token={token} userAgent={headerList.get('user-agent')} />;
}`
        },
        {
            year: '2023', version: 'v14', title: 'Server Actions Stable',
            desc: 'Mutations became first-class citizens. Instead of creating separate API routes (`pages/api/...`), developers could simply export async functions with `"use server"` to execute server-side logic directly from form submissions or event handlers, fully typed and integrated.',
            features: ['Server Actions (Stable)', 'Partial Prerendering (Preview)', 'Lazy Metadata', 'Turbopack improvements'],
            code: `// Next.js 14: Server Actions
async function create(formData: FormData) {
  'use server';
  // Code here runs ONLY on the server
  const id = await db.create({ text: formData.get('text') });
  revalidatePath('/posts'); // Instant UI update
  redirect(\`/post/\${id}\`);
}

// Wired up directly to the form
<form action={create} />`
        },
        {
            year: '2022', version: 'v13', title: 'The App Router Revolution',
            desc: 'The biggest paradigm shift in the framework\'s history. The `pages/` directory was succeeded by `app/`, introducing React Server Components (RSC) as the default. This enabled preventing waterfalls via parallel fetching, nested layouts without re-rendering, and streaming UI parts instantly.',
            features: ['App Router (Beta)', 'React Server Components', 'Nested Layouts', 'Streaming', 'New Image/Link Components'],
            code: `// Next.js 13: Server Components & Streaming
import { Suspense } from 'react';

export default function Page() {
  return (
    <section>
      <h1>My Feed</h1>
      {/* Stream in the feed without blocking the title */}
      <Suspense fallback={<Skeleton />}>
        <Feed /> 
      </Suspense>
    </section>
  );
}`
        },
        {
            year: '2021', version: 'v12', title: 'Rust Compiler & Middleware',
            desc: 'Performance took center stage. Next.js replaced Babel with SWC (a Rust-based compiler), resulting in 3x faster refresh times and 5x faster builds. Middleware was introduced, allowing code execution before a request completes to modify responses, rewrite paths, or handle auth at the Edge.',
            features: ['Rust Compiler (SWC)', 'Middleware (Beta)', 'React 18 Alpha Support', 'AVIF Image Support'],
            code: `// Next.js 12: Middleware (_middleware.ts -> middleware.ts)
import { NextResponse } from 'next/server';

export function middleware(req) {
  // Intercept requests at the Edge
  const country = req.geo?.country || 'US';
  
  if (req.nextUrl.pathname === '/home') {
    return NextResponse.rewrite(new URL(\`/\${country}/home\`, req.url));
  }
}`
        },
        {
            year: '2021', version: 'v11', title: 'DX & Optimization',
            desc: 'A release focused on Developer Experience. Webpack 5 became the default, improving disk caching. The generic `<Script>` component allowed third-party scripts to be loaded with strategies like `lazyOnload` to prevent blocking the main thread.',
            features: ['Webpack 5 Default', 'Script Component', 'Conformance Engine', 'Next.js Live (Preview)'],
            code: `// Next.js 11: Script Optimization
import Script from 'next/script';

<Script 
  src="https://third-party-analytics.js" 
  strategy="lazyOnload" 
  onLoad={() => console.log('Analytics loaded!')}
/>`
        },
        {
            year: '2020', version: 'v10', title: 'Image Optimization',
            desc: 'Solved the Web\'s largest contentful paint (LCP) problem. The `<Image>` component automatically handled resizing, optimizing, and serving images in modern formats like WebP. Internationalized Routing (i18n) was also built-in primarily for e-commerce.',
            features: ['Automatic Image Optimization', 'Internationalized Routing (i18n)', 'Next.js Analytics', 'React 17 Support'],
            code: `// Next.js 10: Automatic Image Optimization
import Image from 'next/image';

<Image 
  src="/hero.jpg" 
  width={800} 
  height={600} 
  priority // Preload critical images
/>`
        },
        {
            year: '2019', version: 'v9', title: 'API Routes & Static Optimization',
            desc: 'The point where Next.js became a true full-stack framework. "API Routes" allowed writing backend endpoints in the same project. Automatic Static Optimization meant pages without blocking data requirements were automatically prerendered to static HTML.',
            features: ['API Routes', 'Dynamic Routing ([slug])', 'TypeScript Zero Config', 'Automatic Static Optimization'],
            code: `// Next.js 9: API Routes (pages/api/user/[id].js)
export default function handler(req, res) {
  const { id } = req.query;
  
  if (req.method === 'POST') {
    saveUser(id, req.body);
    res.status(200).json({ success: true });
  }
}`
        },
        {
            year: '2019', version: 'v8', title: 'Serverless Next.js',
            desc: 'Prepared the framework for the serverless revolution. It broke the monolithic build into smaller chunks, allowing each page to be deployed as an individual lambda function, drastically improving reliability and scalability.',
            features: ['Serverless Target', 'Reduced HTML Weight', 'Fast Static Export'],
        },
        {
            year: '2018', version: 'v6-v7', title: 'Performance & DX',
            desc: 'Transitioned to Webpack 4 and Babel 7. The `_app.js` convention was introduced, giving developers a place to persist layout state, handle global errors, and keep state between page navigations.',
            features: ['Automatic code splitting', 'Styled-JSX 3', 'App Component (_app.js)'],
        },
        {
            year: '2016', version: 'v1-v5', title: 'The Beginning',
            desc: 'The foundational era. Next.js solved the hard problem of setting up React Server-Side Rendering (SSR). It introduced file-system based routing (placing a file in `pages/` made it a route) and `getInitialProps` for data fetching.',
            features: ['File-system routing (pages/)', 'getInitialProps', 'Hot Module Replacement'],
            code: `// The Old Way: getInitialProps
// This ran on both server AND client!
Page.getInitialProps = async (ctx) => {
  const res = await fetch('https://api.com/data');
  const json = await res.json();
  return { data: json };
}`
        }
    ];

    const [expanded, setExpanded] = useState<number | null>(null);

    return (
        <div className="space-y-8 max-w-5xl mx-auto px-4 pb-20">
            <div className="flex items-center gap-4">
                <Link
                    href="/features/next"
                    className="inline-block px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                >
                    ← Back
                </Link>
                <div className="h-px bg-slate-200 flex-1" />
            </div>

            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                    Next.js <span className="text-indigo-600">Through the Years</span>
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    From a simple SSR helper to the Web's most popular full-stack framework.
                </p>
            </div>

            <div className="relative border-l-2 border-slate-200 ml-4 md:ml-12 pl-8 md:pl-12 space-y-16">
                {milestones.map((m, idx) => (
                    <div key={idx} className="relative group">
                        {/* Timeline Marker */}
                        <div className="absolute -left-[45px] md:-left-[61px] top-0 h-8 w-8 rounded-full border-4 border-white bg-indigo-600 shadow-md group-hover:scale-110 group-hover:bg-indigo-500 transition-all z-10 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white ml-0.5 mt-0.5">{m.year.substring(2)}</span>
                        </div>

                        <div
                            className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl ${expanded === idx ? 'border-indigo-200 ring-2 ring-indigo-50' : 'border-slate-200 hover:border-indigo-300'}`}
                        >
                            <div
                                className="p-6 md:p-8 cursor-pointer"
                                onClick={() => setExpanded(expanded === idx ? null : idx)}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-2xl font-bold text-slate-900">{m.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${expanded === idx ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {m.version}
                                        </span>
                                    </div>
                                    <div className="text-slate-400 text-sm font-semibold flex items-center gap-2">
                                        {expanded === idx ? 'Collapse' : 'Expand Details'}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-transform ${expanded === idx ? 'rotate-180' : ''}`}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </div>
                                </div>

                                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                    {m.desc}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {m.features.map(f => (
                                        <span key={f} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-600 font-medium group-hover:bg-indigo-50 group-hover:text-indigo-700 group-hover:border-indigo-100 transition-colors">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Expanded Content (Code Snippet) */}
                            <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${expanded === idx ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                <div className="overflow-hidden bg-slate-950">
                                    {m.code && (
                                        <div className="p-6 md:p-8 border-t border-slate-800">
                                            <div className="flex items-center gap-2 mb-4 text-slate-400 text-xs font-mono uppercase tracking-wider">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-indigo-400">
                                                    <path fillRule="evenodd" d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 13.5a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z" clipRule="evenodd" />
                                                </svg>
                                                Code Snapshot
                                            </div>
                                            <pre className="font-mono text-sm text-indigo-50 md:text-base leading-relaxed overflow-x-auto p-4 bg-slate-900 rounded-xl">
                                                <code>{m.code}</code>
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-20 p-8 bg-indigo-50 rounded-3xl text-center border border-indigo-100 bg-gradient-to-b from-indigo-50 to-white">
                <div className="inline-block p-3 bg-indigo-100 rounded-xl mb-4 text-3xl">🔮</div>
                <h3 className="text-3xl font-bold text-indigo-900 mb-4">What's Next: Next.js 17</h3>
                <div className="max-w-3xl mx-auto mb-8 grid md:grid-cols-2 gap-6 text-left">
                    <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm">
                        <h4 className="font-bold text-indigo-700 mb-2">Native AI Integration</h4>
                        <p className="text-sm text-slate-600">First-party hooks for streaming LLM responses directly in RSCs without external SDKs. Low-level primitives for local-first AI models powered by WebGPU.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm">
                        <h4 className="font-bold text-indigo-700 mb-2">Edge Layer 2</h4>
                        <p className="text-sm text-slate-600">A new "Edge State" primitive that allows persistent, strongly consistent data synchronization across easy-to-deploy edge nodes, eliminating the need for complex external databases for simple apps.</p>
                    </div>
                </div>
                <div className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-full font-bold text-sm shadow-md hover:bg-indigo-700 transition-colors cursor-default">
                    Coming Late 2026
                </div>
            </div>
        </div>
    );
}
