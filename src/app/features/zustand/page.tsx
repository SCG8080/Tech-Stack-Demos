import Link from 'next/link';

export default function ZustandIndexPage() {
    const demos = [
        {
            title: "Persistent Client State",
            desc: "Uses Zustand `persist` middleware to save state to localStorage (Async Storage in web). Persists across reloads.",
            href: "/features/zustand/persistent-state",
            color: "orange"
        },
        {
            title: "In-Memory State",
            desc: "Standard store without persistence. State resets on page reload. Ideal for temporary UI state.",
            href: "/features/zustand/in-memory",
            color: "pink"
        },
        {
            title: "Store Facade Pattern",
            desc: "Architectural guide: Using the store as an abstraction layer for your UI.",
            href: "/features/zustand/facade",
            color: "indigo"
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                    ← Back
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Client State (Zustand)</h1>
                    <p className="text-slate-600">Global client-side state management patterns.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {demos.map((demo) => (
                    <Link key={demo.href} href={demo.href} className="group p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 mb-2">{demo.title}</h3>
                        <p className="text-slate-600 text-sm mb-4">{demo.desc}</p>
                        <div className="text-indigo-600 text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                            Launch Demo →
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
