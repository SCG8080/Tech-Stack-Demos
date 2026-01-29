'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AIExplainer from '@/app/components/AIExplainer';

export default function SmartComposePage() {
    const [status, setStatus] = useState('Initializing GPT-2 Model...');
    const [progress, setProgress] = useState(0);
    const [ready, setReady] = useState(false);

    const [text, setText] = useState('');
    const [prediction, setPrediction] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSmartMode, setIsSmartMode] = useState(true);

    const worker = useRef<Worker | null>(null);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!worker.current) {
            const basePath = process.env.NODE_ENV === 'production' ? '/Tech-Stack-Demos' : '';
            worker.current = new Worker(`${basePath}/generation-worker.js?v=${Date.now()}`, { type: 'module' });

            worker.current.onmessage = (e) => {
                const { status, progress, prediction } = e.data;
                if (status === 'progress') {
                    setProgress(progress);
                    setStatus(`Loading Model: ${Math.round(progress)}%`);
                } else if (status === 'ready') {
                    setReady(true);
                    setStatus('Ready');
                    setProgress(100);
                } else if (status === 'complete') {
                    // Clean up prediction
                    setPrediction(prediction);
                    setIsGenerating(false);
                }
            };

            worker.current.postMessage({ type: 'init' });
        }
        return () => {
            worker.current?.terminate();
            worker.current = null;
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setText(val);
        setPrediction(''); // Clear old prediction

        // Simple debounce
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        // Only predict if enabled, ready, and valid length
        if (isSmartMode && ready && val.length > 5) {
            setIsGenerating(true);
            debounceTimer.current = setTimeout(() => {
                worker.current?.postMessage({ type: 'generate', text: val });
            }, 600); // 600ms idle wait
        } else {
            setIsGenerating(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Accept with TAB or Right Arrow
        if ((e.key === 'Tab' || e.key === 'ArrowRight') && prediction) {
            e.preventDefault();
            setText(text + prediction);
            setPrediction('');
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/features/ai" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                    ← Back
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-900">Smart Compose</h1>
                    <p className="text-slate-600 mt-2">
                        Predictive Text Generation using DistilGPT2.
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
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-semibold text-slate-700">
                                    Email Editor
                                </label>

                                {/* TOGGLE SWITCH */}
                                <button
                                    onClick={() => {
                                        const newState = !isSmartMode;
                                        setIsSmartMode(newState);
                                        if (!newState) setPrediction(''); // Clear text if disabled
                                    }}
                                    disabled={!ready}
                                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all border ${isSmartMode
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-200 shadow-md'
                                        : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                                        }`}
                                >
                                    <div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${isSmartMode ? 'translate-x-0' : 'hidden'}`}></div>
                                    {isSmartMode ? 'Smart Suggest ON' : 'Smart Suggest OFF'}
                                </button>
                            </div>

                            <div className="relative group">
                                {/* TEXTAREA */}
                                <textarea
                                    value={text}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Start typing an email... (e.g., 'Hi team, I wanted to check')"
                                    disabled={!ready}
                                    className="w-full p-4 h-64 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 shadow-inner resize-none font-mono text-base bg-transparent relative z-10 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
                                    style={{ lineHeight: '1.5' }}
                                />

                                {!ready && (
                                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center border border-slate-200 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-indigo-700 font-bold text-sm">Downloading GPT-2 Base ({Math.round(progress)}%)</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">One-time download (~120MB)</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Suggestion Bar */}
                        <div className={`h-12 flex items-center gap-3 transition-opacity duration-300 ${prediction ? 'opacity-100' : 'opacity-0'}`}>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Suggestion:</span>
                            <div className="flex-1 flex gap-2 items-center">
                                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md font-mono border border-indigo-100 shadow-sm">
                                    {prediction}
                                </span>
                                <span className="text-[10px] text-slate-500 border border-slate-200 rounded px-1.5 py-0.5">Press TAB or ➡️</span>
                            </div>
                        </div>

                        {isGenerating && (
                            <div className="text-xs text-indigo-500 animate-pulse mt-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Thinking...
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <span>🤖</span> How it works
                    </h3>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-xl"></div>
                        <h4 className="font-bold text-indigo-900 mb-2">Causal Language Modeling</h4>
                        <p className="text-sm text-slate-600 mb-4">
                            The model (DistilGPT2) reads your sentence and attempts to <strong>auto-complete</strong> it based on patterns from the internet.
                        </p>
                        <p className="text-sm text-slate-600">
                            It predicts 5-10 words ahead.
                        </p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-600">
                        <strong>Try typing these exact phrases:</strong>
                        <ul className="list-disc pl-5 mt-2 space-y-2 font-mono text-xs text-slate-700">
                            <li>"The meeting has been moved to <span className="text-indigo-500">...</span>"</li>
                            <li>"Thank you so much for your <span className="text-indigo-500">...</span>"</li>
                            <li>"Please let me know if you need <span className="text-indigo-500">...</span>"</li>
                            <li>"I hope you are having a <span className="text-indigo-500">...</span>"</li>
                        </ul>
                    </div>
                </div>
            </div>

            <AIExplainer
                title="Generative Prediction (Balanced)"
                analogy="Like the auto-complete on your phone, but running locally on your CPU/GPU."
                analogyIcon="🔮"
                modelName="Xenova/gpt2"
                modelSize="120 MB"
                modelLink="https://huggingface.co/Xenova/gpt2"
                modelDescription="The classic GPT-2 Base model (124M params). A perfect balance: smarter than DistilGPT2 but lightweight enough for older laptops. It uses Causal Language Modeling to predict the most probable next token."
                workerFileName="generation-worker.js"
                inputName="Context Window"
                outputName="Next Token Probability"
            />
        </div>
    );
}
