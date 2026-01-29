export default function TechnicalExplainer({
    title,
    points,
    codeSnippet,
    analogy
}: {
    title: string;
    points: (string | { title: string; description: string })[];
    codeSnippet?: string;
    analogy?: string;
}) {
    return (
        <div className="mt-12 border-t border-slate-200 pt-8">
            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl">
                <div className="px-6 py-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
                    <h3 className="font-bold text-slate-100 flex items-center gap-2">
                        <span className="text-indigo-400">⚡</span> Under the Hood: {title}
                    </h3>
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Architecture</span>
                </div>

                <div className="p-6 grid lg:grid-cols-2 gap-8">
                    {analogy && (
                        <div className="col-span-full bg-indigo-900/30 border border-indigo-500/30 rounded-xl p-4">
                            <h4 className="font-bold text-indigo-300 mb-2 flex items-center gap-2">
                                <span>💡</span> Think of it like...
                            </h4>
                            <p className="text-indigo-100 text-sm leading-relaxed">
                                {analogy}
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <h4 className="font-medium text-slate-300 mb-2">Key Concepts</h4>
                        <ul className="space-y-3">
                            {points.map((point, idx) => (
                                <li key={idx} className="flex gap-3 text-slate-400 text-sm leading-relaxed">
                                    <span className="text-indigo-500 font-bold mt-0.5">•</span>
                                    <span>
                                        {typeof point === 'string' ? point : (
                                            <>
                                                <strong className="text-slate-200">{point.title}:</strong> {point.description}
                                            </>
                                        )}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {codeSnippet && (
                        <div>
                            <h4 className="font-medium text-slate-300 mb-2">Implementation</h4>
                            <div className="bg-black/50 rounded-lg p-4 font-mono text-xs text-emerald-400 overflow-x-auto border border-white/5">
                                <pre>{codeSnippet}</pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
