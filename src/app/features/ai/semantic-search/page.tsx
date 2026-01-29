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

    // We no longer need showKb toggle as we show a dedicated list
    // const [showKb, setShowKb] = useState(false);

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

    const [previewItem, setPreviewItem] = useState<{ title: string, content: string, highlight?: string } | null>(null);

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

    const handlePreview = (title: string, fullContent: string, highlightSnippet?: string) => {
        setPreviewItem({ title, content: fullContent, highlight: highlightSnippet });
        log(`Opening preview for: ${title}`);
    };

    // Enhanced highlighting component with Context View
    const HighlightedContent = ({ content, highlight }: { content: string, highlight?: string }) => {
        const [showFull, setShowFull] = useState(false);
        const scrollRef = useRef<HTMLSpanElement>(null);

        // Auto-scroll to highlight when it appears
        useEffect(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, [showFull, highlight]);

        if (!highlight || highlight.length < 5) {
            return <pre className="whitespace-pre-wrap font-mono text-xs text-slate-700">{content}</pre>;
        }

        // Logic to toggle between full content and "Context View"
        let displayContent = content;
        let isTruncated = false;
        const CONTEXT_PADDING = 1000;

        if (!showFull && content.length > CONTEXT_PADDING * 2) {
            const index = content.indexOf(highlight);
            if (index !== -1) {
                const start = Math.max(0, index - CONTEXT_PADDING);
                const end = Math.min(content.length, index + highlight.length + CONTEXT_PADDING);
                displayContent = (start > 0 ? "...[prev]...\n" : "") + content.substring(start, end) + (end < content.length ? "\n...[next]..." : "");
                isTruncated = true;
            }
        }

        // Split for highlighting
        // Note: Using displayContent here to ensure we only render the visible slice
        const parts = displayContent.split(highlight);

        return (
            <div className="relative">
                {content.length > 2000 && (
                    <div className="sticky top-0 z-10 flex justify-end mb-2">
                        <button
                            onClick={() => setShowFull(!showFull)}
                            className="bg-indigo-600/90 backdrop-blur text-white text-[10px] font-bold px-3 py-1 rounded-full shadow hover:bg-indigo-700 transition"
                        >
                            {showFull ? "Show Context Only" : "Show Full Document"}
                        </button>
                    </div>
                )}

                <pre className="whitespace-pre-wrap font-mono text-xs text-slate-700">
                    {parts.map((part, i) => (
                        <span key={i}>
                            {part}
                            {i < parts.length - 1 && (
                                <span
                                    ref={!showFull || (showFull && i === 0) ? scrollRef : null} // Scroll to first occurrence
                                    className="bg-yellow-200 text-slate-900 font-bold px-1 rounded border border-yellow-300 shadow-sm animate-pulse"
                                >
                                    {highlight}
                                </span>
                            )}
                        </span>
                    ))}
                </pre>
            </div>
        );
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

                        {/* 1. Knowledge Base Manager (Primary Action) */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-bold text-slate-800 flex items-center gap-2">
                                    <span>📚</span> Knowledge Base ({kbContent.length} chunks)
                                </label>
                                <span className="text-[10px] uppercase font-bold text-slate-400">Supported: .txt, .md, .json</span>
                            </div>

                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Paste URL (e.g. raw GitHub file or Gutenberg .txt)..."
                                    className="flex-1 p-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const val = e.currentTarget.value;
                                            if (val) {
                                                handleUrlLoad(val);
                                                e.currentTarget.value = '';
                                            }
                                        }
                                    }}
                                />
                                <button
                                    onClick={(e) => {
                                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                        if (input.value) {
                                            handleUrlLoad(input.value);
                                            input.value = '';
                                        }
                                    }}
                                    disabled={!ready || status.startsWith('Fetching') || status.startsWith('Indexing')}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-wait transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
                                >
                                    {status.startsWith('Fetching') || status.startsWith('Indexing') ? (
                                        <>
                                            <span className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        'Add Source'
                                    )}
                                </button>
                            </div>

                            <div className="text-[10px] text-slate-400 flex gap-1">
                                <span>Try:</span>
                                <span
                                    className="cursor-pointer text-indigo-500 hover:underline"
                                    onClick={() => handleUrlLoad("https://www.gutenberg.org/cache/epub/37134/pg37134.txt")}
                                >
                                    Elements of Style (Gutenberg)
                                </span>
                                <span>•</span>
                                <span
                                    className="cursor-pointer text-indigo-500 hover:underline"
                                    onClick={() => handleUrlLoad("https://raw.githubusercontent.com/SCG8080/Tech-Stack-Demos/main/README.md")}
                                >
                                    This Repo README
                                </span>
                            </div>
                        </div>

                        {/* Source List */}
                        {kbContent.length > 0 && (
                            <div className="mb-8 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                                <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Active Sources({Array.from(new Set(kbContent.map(k => k.sourceName))).length})
                                </div>
                                <div className="max-h-40 overflow-y-auto p-2 space-y-1">
                                    {/* Deduplicate sources for display */}
                                    {Array.from(new Set(kbContent.map(k => k.sourceName))).map(source => {
                                        const sourceItem = kbContent.find(k => k.sourceName === source);
                                        return (
                                            <div key={source} className="flex items-center gap-2 text-xs text-slate-700 px-2 py-1 bg-white rounded border border-slate-100 shadow-sm group">
                                                <span className="text-emerald-500">●</span>
                                                <span
                                                    className="font-mono truncate flex-1 cursor-pointer hover:text-indigo-600 hover:underline"
                                                    onClick={() => sourceItem && handlePreview(source, sourceItem.fullContent)}
                                                >
                                                    {source}
                                                </span>
                                                <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 rounded mr-1">{kbContent.filter(k => k.sourceName === source).length} chunks</span>
                                                <button
                                                    title="Download"
                                                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 transition-opacity"
                                                    onClick={() => sourceItem && handleDownload(sourceItem.sourceName, sourceItem.text, sourceItem.sourceType, sourceItem.fullContent)}
                                                >
                                                    ⬇
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* 2. Semantic Search Input */}
                        <div className="pt-6 border-t border-slate-100">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Ask Questions
                            </label>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => handleSearch(e.target.value)}
                                disabled={!ready || kbContent.length === 0}
                                placeholder={kbContent.length === 0 ? "Add a source above to start..." : "Ask something about the text..."}
                                className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner disabled:bg-slate-50 disabled:cursor-not-allowed"
                            />
                            {!ready && (
                                <div className="text-xs text-indigo-600 mt-2 animate-pulse font-mono">
                                    {status}
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
                                <div key={r.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div
                                            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity flex-1"
                                            onClick={() => handlePreview(r.sourceName, r.fullContent, r.text)}
                                        >
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded text-white ${r.sourceType === 'Book' ? 'bg-indigo-500' : 'bg-slate-400'
                                                }`}>
                                                {r.sourceType}
                                            </span>
                                            <span className="text-xs text-indigo-600 hover:underline font-mono truncate max-w-[200px]" title={`View ${r.sourceName}`}>
                                                {r.sourceName} 👁️
                                            </span>
                                        </div>
                                        <button
                                            title="Download Source File"
                                            className="text-slate-300 hover:text-slate-600 transition-colors px-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDownload(r.sourceName, r.text, r.sourceType, r.fullContent);
                                            }}
                                        >
                                            ⬇
                                        </button>
                                    </div>

                                    <p
                                        className="text-slate-800 font-medium mb-2 leading-relaxed text-sm cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors"
                                        onClick={() => handlePreview(r.sourceName, r.fullContent, r.text)}
                                    >
                                        "{r.text}"
                                    </p>
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

                {/* Preview Modal */}
                {previewItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="font-bold text-slate-700 font-mono truncate max-w-2xl flex items-center gap-2">
                                    <span>📄</span> {previewItem.title}
                                </h3>
                                <button
                                    onClick={() => setPreviewItem(null)}
                                    className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="flex-1 overflow-auto p-6 bg-slate-50 custom-scrollbar">
                                <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm min-h-full">
                                    <HighlightedContent content={previewItem.content} highlight={previewItem.highlight} />
                                </div>
                            </div>
                            <div className="p-3 border-t border-slate-100 bg-white flex justify-end gap-2 text-xs text-slate-400">
                                {previewItem.highlight && (
                                    <span className="flex items-center gap-1">
                                        <span className="w-3 h-3 bg-yellow-200 border border-yellow-300 rounded"></span>
                                        Match Highlighted
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

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
