'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AIExplainer from '@/app/components/AIExplainer';

export default function SemanticSearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [ready, setReady] = useState(false);
    const [status, setStatus] = useState('Initializing Embedding Model...');
    const [progress, setProgress] = useState(0);

    // Available Knowledge Base content
    const [kbContent, setKbContent] = useState<any[]>([]);
    const [showKb, setShowKb] = useState(false);

    const [logs, setLogs] = useState<string[]>([]);
    const log = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

    const worker = useRef<Worker | null>(null);

    useEffect(() => {
        if (!worker.current) {
            const basePath = process.env.NODE_ENV === 'production' ? '/Tech-Stack-Demos' : '';
            log(`Creating worker from ${basePath}/search-worker.js`);
            // Cache busting
            worker.current = new Worker(`${basePath}/search-worker.js?v=${Date.now()}`, { type: 'module' });

            worker.current.onerror = (err) => {
                const msg = err instanceof ErrorEvent ? err.message : 'Unknown worker error';
                log(`❌ Worker Error: ${msg}`);
                setStatus('Worker Error');
            };

            worker.current.onmessage = (e) => {
                const { status, progress, count, results, error, knowledgeBase, current, total, message } = e.data;

                if (status === 'progress') {
                    // Model Download Progress
                    setProgress(progress);
                    setStatus(`Downloading Model: ${Math.round(progress)}%`);
                } else if (status === 'indexing') {
                    // Indexing Progress
                    const pct = (current / total) * 100;
                    setProgress(pct);
                    setStatus(`Indexing Knowledge Base: ${current} / ${total} items`);
                } else if (status === 'ready') {
                    setReady(true);
                    setStatus(`Ready (${count} facts loaded)`);
                    setProgress(100);
                    if (knowledgeBase) setKbContent(knowledgeBase);
                    if (message) log(`✅ ${message}`);
                    else log(`Model Loaded & Indexed ${count} items`);
                } else if (status === 'complete') {
                    setResults(results);
                    log(`Search complete: Found ${results.length} matches`);
                } else if (status === 'error') {
                    log(`❌ Error: ${error}`);
                    setStatus('Error');
                }
            };

            log('Sending init command (warmup)...');
            worker.current.postMessage({ type: 'init' });
        }

        return () => {
            worker.current?.terminate();
            worker.current = null;
        };
    }, []);

    const handleSearch = (text: string) => {
        setQuery(text);
        if (ready && text.length > 2) {
            worker.current?.postMessage({ type: 'search', query: text });
        } else {
            setResults([]);
        }
    };

    const handleUrlLoad = async (url: string) => {
        if (!worker.current) return;
        setStatus(`Fetching ${url}...`);

        try {
            // Use AllOrigins as CORS Proxy
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
            const res = await fetch(proxyUrl);
            if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

            const text = await res.text();
            if (text.length < 50) throw new Error("Content too short or empty");

            setStatus(`Indexing content from ${url}...`);
            log(`Fetched ${text.length} chars from ${url}`);

            worker.current.postMessage({
                type: 'add',
                payload: { text, url, type: 'Web' }
            });

        } catch (err: any) {
            log(`❌ Load Error: ${err.message}`);
            setStatus('Error loading URL');
        }
    };

    const handleDownload = (filename: string, content: string, type: string, fullContent?: string) => {
        const dataToSave = fullContent || `FAKE FILE GENERATED FOR DEMO\n\nSource: ${filename}\nType: ${type}\n\nSnippet:\n${content}`;
        const element = document.createElement("a");
        const file = new Blob([dataToSave], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = filename.split('/').pop() || 'download.txt';
        document.body.appendChild(element);
        element.click();
        log(`Downloaded file: ${filename}`);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/features/ai" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                    ← Back
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-900">Client-Side RAG & Semantic Search</h1>
                    <p className="text-slate-600 mt-2">
                        Download models once. Run forever offline. Zero latency.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <div className="glass-panel p-8 rounded-2xl border-2 border-slate-200/60 shadow-xl relative overflow-hidden bg-white/80 backdrop-blur-xl">
                        {!ready && <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100">
                            <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>}

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Search Knowledge Base ({kbContent.length} chunks indexed)
                            </label>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => handleSearch(e.target.value)}
                                disabled={!ready}
                                placeholder="e.g. 'brevity', 'active voice', 'needless words'..."
                                className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
                            />
                            {!ready && (
                                <div className="text-xs text-indigo-600 mt-2 animate-pulse font-mono">
                                    {status}
                                </div>
                            )}
                        </div>

                        {/* Knowledge Source Toggle */}
                        <div className="border-t border-slate-100 pt-4">
                            <button
                                onClick={() => setShowKb(!showKb)}
                                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2"
                            >
                                {showKb ? 'Hide Source Files' : 'View Indexed Sources'}
                            </button>


                            {/* Dynamic URL Loader */}
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter .txt URL (e.g. Project Gutenberg)"
                                        className="flex-1 p-2 text-sm border border-slate-200 rounded-lg bg-slate-50"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const val = e.currentTarget.value;
                                                if (val) handleUrlLoad(val);
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={(e) => {
                                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                            if (input.value) handleUrlLoad(input.value);
                                        }}
                                        disabled={!ready}
                                        className="bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-slate-700 disabled:opacity-50"
                                    >
                                        Load
                                    </button>
                                </div>
                                <div className="text-[10px] text-slate-400 mt-1">
                                    Uses AllOrigins CORS Proxy. Try:
                                    <span
                                        className="cursor-pointer text-indigo-500 hover:underline ml-1"
                                        onClick={(e) => {
                                            const input = e.currentTarget.parentElement?.previousElementSibling?.firstElementChild as HTMLInputElement;
                                            if (input) {
                                                input.value = "https://www.gutenberg.org/cache/epub/37134/pg37134.txt";
                                                // Trigger change event if needed, or just leave it
                                            }
                                        }}
                                    >
                                        Elements of Style (Gutenberg)
                                    </span>
                                </div>
                            </div>

                            {showKb && (
                                <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-600 max-h-60 overflow-y-auto">
                                    <ul className="space-y-2 list-none pl-0">
                                        {kbContent.map((item) => (
                                            <li key={item.id} className="flex gap-2 text-[10px] items-start pb-2 border-b border-slate-100 last:border-0 hover:bg-slate-100 p-1 rounded transition-colors cursor-pointer group" onClick={() => handleDownload(item.sourceName, item.text, item.sourceType, item.fullContent)}>
                                                <span className={`px-1.5 rounded text-white font-bold min-w-[35px] text-center mt-0.5 ${item.sourceType === 'Book' ? 'bg-indigo-500' : 'bg-slate-400'
                                                    }`}>{item.sourceType?.substring(0, 4)}</span>
                                                <div className="flex-1">
                                                    <div className="text-indigo-900 font-semibold truncate w-48 group-hover:underline flex items-center gap-1">
                                                        {item.sourceName}
                                                        <span className="text-[9px] opacity-0 group-hover:opacity-100 text-slate-400 ml-1">⬇</span>
                                                    </div>
                                                    <div className="text-slate-500 line-clamp-1">{item.text.slice(0, 50)}...</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <span>🔍</span> Semantic Results
                    </h3>

                    {results.length > 0 ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {results.map((r, i) => (
                                <div key={r.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-2 mb-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleDownload(r.sourceName, r.text, r.sourceType, r.fullContent)}>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded text-white ${r.sourceType === 'Book' ? 'bg-indigo-500' : 'bg-slate-400'
                                            }`}>
                                            {r.sourceType}
                                        </span>
                                        <span className="text-xs text-indigo-600 hover:underline font-mono truncate max-w-[200px]" title={`Download ${r.sourceName}`}>
                                            {r.sourceName} 📎
                                        </span>
                                    </div>

                                    <p className="text-slate-800 font-medium mb-2 leading-relaxed text-sm">"{r.text}"</p>
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="w-full max-w-[200px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${r.score > 0.4 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                                style={{ width: `${Math.max(0, r.score * 100)}%` }}
                                            />
                                        </div>
                                        <span className="font-mono text-slate-400">{(r.score * 100).toFixed(1)}% Match</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-50 p-8 rounded-xl border border-slate-100 text-center text-slate-400">
                            {query ? 'No match found.' : 'Waiting for search input...'}
                        </div>
                    )}
                </div>

                {/* Debug Console */}
                <div className="col-span-full mt-4">
                    <button
                        onClick={() => setLogs([])}
                        className="text-xs text-slate-400 hover:text-slate-600 mb-1"
                    >
                        Clear Logs
                    </button>
                    <div className="p-3 bg-slate-950 rounded-lg font-mono text-[10px] text-blue-400 h-32 overflow-y-auto border border-slate-800 shadow-inner leading-tight">
                        {logs.map((L, i) => (
                            <div key={i} className="border-b border-white/5 py-0.5">{L}</div>
                        ))}
                    </div>
                </div>
            </div>

            <AIExplainer
                title="Semantic Search (RAG)"
                analogy="Instead of keyword matching (Ctrl+F), we turn text into 'numbered vectors'. Similar meanings end up as close numbers."
                analogyIcon="🔍"
                modelName="Xenova/all-MiniLM-L6-v2"
                modelSize="23 MB (Quantized)"
                modelLink="https://huggingface.co/Xenova/all-MiniLM-L6-v2"
                modelDescription="A Sentence Transformer model. It takes a sentence and outputs a 384-dimensional vector. We compute 'Cosine Similarity' between your query vector and the database vectors to find meanings, not just keywords."
                workerFileName="search-worker.js"
                inputName="Text Query"
                outputName="Top-K Matches"
            />
        </div >
    );
}
