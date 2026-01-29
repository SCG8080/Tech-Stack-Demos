'use client';

import Link from 'next/link';

export default function FeaturesDirectoryPage() {
    const sections = [
        {
            title: "Next.js Architecture",
            description: "Server Actions, Caching, Revalidation, and Rendering Modes.",
            icon: "⚡",
            href: "/features/next",
            color: "indigo",
            tags: ["App Router", "Server Actions", "ISR"]
        },
        {
            title: "TanStack Query",
            description: "Async state management, polling, and smart caching patterns.",
            icon: "🔴",
            href: "/features/query",
            color: "red",
            tags: ["Deduplication", "Polling", "Mutations"]
        },
        {
            title: "Zustand State",
            description: "Client-side global state with persistence and easy hooks.",
            icon: "🐻",
            href: "/features/zustand",
            color: "orange",
            tags: ["Global Store", "Persist Middleware"]
        },
        {
            title: "Client-Side AI",
            description: "Run ML models like Whisper, DistilBERT, and ResNet entirely in the browser using WebAssembly. Zero API costs.",
            icon: "🧠",
            href: "/features/ai",
            color: "violet",
            tags: ["Whisper", "Semantic Search", "Object Detection"]
        },
        {
            title: "Tailwind CSS",
            description: "Utility-first styling for rapid UI development.",
            icon: "🌊",
            href: "/features/tailwind",
            color: "cyan",
            tags: ["Responsive", "Utility First"]
        }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="mb-8">
                <Link href="/" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                    ← Back to Home
                </Link>
            </div>
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                    Interactive Demos
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Explore the capabilities of our tech stack through hands-on playgrounds.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {sections.map((section) => (
                    <Link
                        key={section.href}
                        href={section.href}
                        className={`group relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-${section.color}-200`}
                    >
                        {/* Background Gradient */}
                        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-${section.color}-50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2`}></div>

                        <div className="flex items-start justify-between mb-6">
                            <div className={`w-16 h-16 rounded-2xl bg-${section.color}-50 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300`}>
                                {section.icon}
                            </div>
                            <div className={`w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-${section.color}-600 group-hover:border-${section.color}-600 group-hover:text-white transition-all`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-900">{section.title}</h2>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            {section.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {section.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full uppercase tracking-wider">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
