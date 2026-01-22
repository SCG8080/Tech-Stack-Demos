import Link from 'next/link';

export default function QueryFeaturesPage() {
    const demos = [
        {
            title: "In-flight Deduplication",
            desc: "Visual proof of request coalescing for simultaneous fetches.",
            href: "/features/query/dedupe",
            color: "emerald"
        },
        {
            title: "Mutations & Optimistic UI",
            desc: "Handling data updates with automatic retry, rollbacks, and optimistic updates.",
            href: "/features/query/mutations",
            color: "lime"
        },
        {
            title: "Smart Polling",
            desc: "Auto-updating UI demonstrating live synchronization.",
            href: "/features/query/polling",
            color: "teal"
        },
        {
            title: "Automatic Retries",
            desc: "Exponential backoff visualization for flaky network requests.",
            href: "/features/query/retries",
            color: "rose"
        },
        {
            title: "Caching Mechanics",
            desc: "Deep dive into staleTime, gcTime, and cache lifecycles.",
            href: "/features/query/caching",
            color: "green"
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                    ← Back
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">TanStack Query</h1>
                    <p className="text-slate-600">Async state management and data fetching patterns.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {demos.map((demo) => (
                    <Link key={demo.href} href={demo.href} className="group p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 mb-2">{demo.title}</h3>
                        <p className="text-slate-600 text-sm mb-4">{demo.desc}</p>
                        <div className="text-emerald-600 text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                            Launch Demo →
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
