import Link from 'next/link';

export default function NextFeaturesPage() {
    const demos = [
        {
            title: "Cache & Revalidation",
            desc: "Experience Data Cache persistence and on-demand Server Action revalidation.",
            href: "/features/next/cache-revalidate",
            color: "indigo"
        },
        {
            title: "Server Actions",
            desc: "Type-safe form handling with useActionState, Zod validation, and pending states.",
            href: "/features/next/server-actions",
            color: "purple"
        },
        {
            title: "Support Matrix",
            desc: "Interactive guide to Node.js version compatibility and EOL status.",
            href: "/features/next/support-matrix",
            color: "blue"
        },
        {
            title: "Feature History",
            desc: "Timeline of major Next.js milestones and architectural shifts.",
            href: "/features/next/history",
            color: "violet"
        },
        {
            title: "Rendering Modes",
            desc: "Interactive Playground: Compare SSR vs CSR vs SSG visually.",
            href: "/features/next/rendering",
            color: "pink"
        }
    ];

    return (
        <div className="space-y-12">
            <div className="flex items-center gap-4">
                <Link href="/" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                    ← Back
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Next.js Architecture</h1>
                    <p className="text-slate-600">Core architectural patterns and capabilities.</p>
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

            {/* Adoption */}
            <section className="bg-slate-900 rounded-3xl p-10 text-white text-center">
                <h2 className="text-2xl font-bold mb-6">Who uses Next.js?</h2>
                <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                    Powering the world&apos;s largest streaming services, e-commerce giants, and content platforms.
                </p>
                <div className="flex flex-wrap justify-center gap-12 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="text-2xl font-bold tracking-tighter text-red-600">Netflix</span>
                    <span className="text-2xl font-bold tracking-tighter text-white">Twitch</span>
                    <span className="text-2xl font-bold tracking-tighter text-black bg-white px-2 rounded">TikTok</span>
                    <span className="text-2xl font-bold tracking-tighter text-green-500">Hulu</span>
                    <span className="text-2xl font-serif italic text-white">Notion</span>
                </div>
            </section>
        </div>
    );
}
