'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AIExplainer from '@/app/components/AIExplainer';

export default function ClassificationPage() {
    const [status, setStatus] = useState('Initializing Zero-Shot Model...');
    const [progress, setProgress] = useState(0);
    const [ready, setReady] = useState(false);

    const [inputText, setInputText] = useState('');
    const [results, setResults] = useState<{ labels: string[], scores: number[] } | null>(null);
    const worker = useRef<Worker | null>(null);

    // Enterprise Categories to test against
    const CATEGORIES = ["Urgent", "Billing Issue", "Technical Support", "Feature Request", "Spam", "Positive Feedback"];

    useEffect(() => {
        if (!worker.current) {
            const basePath = process.env.NODE_ENV === 'production' ? '/Tech-Stack-Demos' : '';
            worker.current = new Worker(`${basePath}/classification-worker.js?v=${Date.now()}`, { type: 'module' });

            worker.current.onmessage = (e) => {
                const { status, progress, output } = e.data;
                if (status === 'progress') {
                    setProgress(progress);
                    setStatus(`Loading Classifier: ${Math.round(progress)}%`);
                } else if (status === 'ready') {
                    setReady(true);
                    setStatus('Ready');
                    setProgress(100);
                } else if (status === 'complete') {
                    setResults(output);
                    setStatus('Classified');
                }
            };

            worker.current.postMessage({ type: 'init' });
        }
        return () => {
            worker.current?.terminate();
            worker.current = null;
        }
    }, []);

    const handleClassify = () => {
        if (!worker.current || !ready || !inputText) return;
        setStatus('Analyzing...');
        worker.current.postMessage({
            type: 'classify',
            text: inputText,
            labels: CATEGORIES
        });
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/features/ai" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                    ← Back
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-900">Smart Ticket Triage</h1>
                    <p className="text-slate-600 mt-2">
                        Zero-Shot Classification: Auto-tagging content without training.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <div className="glass-panel p-8 rounded-2xl border-2 border-slate-200/60 shadow-xl relative overflow-hidden bg-white/80 backdrop-blur-xl">
                        {!ready && <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100">
                            <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>}

                        <div className="mb-4 relative">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Simulate Customer Message</label>
                            <div className="relative">
                                <textarea
                                    value={inputText}
                                    onChange={e => setInputText(e.target.value)}
                                    placeholder="e.g., 'My credit card was charged twice and I need a refund immediately!'"
                                    disabled={!ready}
                                    className="w-full p-4 h-32 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 shadow-inner disabled:bg-slate-50 disabled:text-slate-400"
                                />
                                {!ready && (
                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl border border-slate-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-indigo-700 font-bold text-sm">Loading Classifier ({Math.round(progress)}%)</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">Setting up Zero-Shot Engine...</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="text-xs text-slate-500">
                                Categories: {CATEGORIES.join(', ')}
                            </div>
                            <button
                                onClick={handleClassify}
                                disabled={!ready || !inputText}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                            >
                                Auto-Tag
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <span>🏷️</span> Predicted Tags
                    </h3>

                    {results ? (
                        <div className="space-y-3">
                            {results.labels.map((label, i) => {
                                const score = results.scores[i];
                                const isHigh = score > 0.5;
                                return (
                                    <div key={label} className="flex items-center gap-3">
                                        <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${isHigh ? 'bg-indigo-600' : 'bg-slate-300'}`} style={{ width: `${score * 100}%` }}></div>
                                        </div>
                                        <span className={`text-sm font-mono w-32 truncate ${isHigh ? 'font-bold text-indigo-900' : 'text-slate-400'}`}>
                                            {label}
                                        </span>
                                        <span className="text-xs text-slate-500 w-12 text-right">
                                            {Math.round(score * 100)}%
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-slate-50 p-8 rounded-xl border border-slate-100 text-center text-slate-400">
                            Waiting for input...
                        </div>
                    )}
                </div>
            </div>

            <AIExplainer
                title="Zero-Shot Classification"
                analogy="Like asking a librarian 'Which section does this book belong to?' without them reading it beforehand."
                analogyIcon="🏷️"
                modelName="Xenova/mobilebert-uncased-mnli"
                modelSize="25 MB (Quantized)"
                modelLink="https://huggingface.co/Xenova/mobilebert-uncased-mnli"
                modelDescription="A Natural Language Inference (NLI) model. It judges if a text implies a certain label ('hypothesis'). This allows classification into ANY category without re-training. We use MobileBERT, a highly optimized version of BERT for mobile devices."
                workerFileName="classification-worker.js"
                inputName="Text + Labels"
                outputName="Scores"
            />
        </div>
    );
}
