export default function HistoryPage() {
    const milestones = [
        { year: '2024 (v15)', title: 'React 19 & Compiler', desc: 'Support for React 19, React Compiler (Experimental), and caching improvements.' },
        { year: '2023 (v14)', title: 'Server Actions Stable', desc: 'Mutations simplified. Partial Prerendering introduced.' },
        { year: '2022 (v13)', title: 'App Router', desc: 'A fundamental shift to React Server Components and nested layouts.' },
        { year: '2021 (v12)', title: 'Rust Compiler', desc: 'Replaced Babel with SWC for 3x faster refreshes and 5x faster builds.' },
        { year: '2020 (v10)', title: 'Image Component', desc: 'Automatic image optimization built-in.' },
        { year: '2019 (v9)', title: 'API Routes', desc: 'Building full-stack apps became possible with file-system API routes.' },
    ];

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-slate-900">Evolution of Next.js</h1>
                <p className="text-slate-600 mt-2">
                    A timeline of major milestones defining the framework.
                </p>
            </div>

            <div className="relative border-l border-slate-200 ml-6 md:ml-12 pl-8 pb-12 space-y-12">
                {milestones.map((m, idx) => (
                    <div key={idx} className="relative group">
                        {/* Dot */}
                        <div className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-white bg-indigo-600 shadow-md group-hover:scale-125 transition-transform" />

                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{m.title}</h3>
                                <span className="text-sm font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">{m.year}</span>
                            </div>
                            <p className="text-slate-600">{m.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
