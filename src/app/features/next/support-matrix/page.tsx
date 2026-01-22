export default function SupportMatrixPage() {
    const versions = [
        { next: 'Next.js 15', node: 'Node.js 18.17+', release: 'Oct 2024', status: 'Active' },
        { next: 'Next.js 14', node: 'Node.js 18.17+', release: 'Oct 2023', status: 'Active' },
        { next: 'Next.js 13', node: 'Node.js 16.14+', release: 'Oct 2022', status: 'Maintenance' },
        { next: 'Next.js 12', node: 'Node.js 12.22+', release: 'Oct 2021', status: 'EOL' },
    ];

    return (
        <div className="space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Version Support Matrix</h1>
                <p className="text-slate-600 mt-2">
                    Comprehensive guide to Node.js version compatibility across Next.js releases.
                </p>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200 p-4 font-semibold text-slate-700 text-sm">
                    <div>Next.js Version</div>
                    <div>Node.js Version</div>
                    <div>Release Date</div>
                    <div>Status</div>
                </div>
                <div className="divide-y divide-slate-100">
                    {versions.map((v) => (
                        <div key={v.next} className="grid grid-cols-4 p-4 hover:bg-slate-50/50 transition-colors text-sm text-slate-600 items-center">
                            <div className="font-medium text-slate-900">{v.next}</div>
                            <div className="font-mono text-indigo-600 bg-indigo-50 inline-block px-2 py-1 rounded w-fit text-xs">{v.node}</div>
                            <div>{v.release}</div>
                            <div>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${v.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                                        v.status === 'Maintenance' ? 'bg-amber-100 text-amber-700' :
                                            'bg-slate-100 text-slate-500'
                                    }`}>
                                    {v.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl">
                    <h3 className="text-amber-900 font-semibold mb-2">Upgrade Policy</h3>
                    <p className="text-amber-800/80 text-sm">
                        Next.js generally supports the Active LTS and Maintenance LTS versions of Node.js.
                        We recommend always upgrading to the latest active LTS of Node.js for improved performance and security.
                    </p>
                </div>
            </div>
        </div>
    );
}
