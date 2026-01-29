'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AIExplainer from '@/app/components/AIExplainer';

export default function SentimentPage() {
    // State
    const [input, setInput] = useState('');
    const [result, setResult] = useState<any>(null);
    const [ready, setReady] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<string>('Initializing...');

    // Worker Reference
    const worker = useRef<Worker | null>(null);

    const [logs, setLogs] = useState<string[]>([]);

    const log = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

    // Initialize Worker
    useEffect(() => {
        if (!worker.current) {
            log('Creating worker from /sentiment-worker.js');
            // Cache busting to ensure fresh worker code
            worker.current = new Worker(`/sentiment-worker.js?v=${Date.now()}`, {
                type: 'module'
            });

            worker.current.onerror = (err) => {
                const msg = err instanceof ErrorEvent ? err.message : 'Unknown worker error';
                log(`❌ Worker Error: ${msg}`);
                setStatus('Worker Error (See logs)');
            };

            worker.current.onmessageerror = () => {
                log('❌ Worker Message Deserialization Error');
            };

            const onMessageReceived = (e: MessageEvent) => {
                const { status, output, error, progress } = e.data;

                switch (status) {
                    case 'initiate':
                        setStatus('Loading Model...');
                        setReady(false);
                        log('Initiating model download...');
                        break;
                    case 'progress':
                        setProgress(progress);
                        setStatus(`Loading Model: ${Math.round(progress)}%`);
                        break;
                    case 'done':
                    case 'ready':
                        setStatus('Ready');
                        setReady(true);
                        log('Model loaded successfully');
                        break;
                    case 'error':
                        log(`❌ Model Error: ${error}`);
                        setStatus('Model Error');
                        break;
                    case 'complete':
                        // Result is array of { label: 'positive', score: 0.9 }
                        setResult(output);
                        setStatus('Ready');
                        log('Inference complete');
                        break;
                }
            };

            worker.current.addEventListener('message', onMessageReceived);

            // Warmup
            log('Sending warmup ping...');
            worker.current.postMessage({ type: 'init' });
        }

        return () => {
            if (worker.current) {
                worker.current.terminate();
                worker.current = null;
            }
        };
    }, []);

    const classify = (text: string) => {
        if (!worker.current) return;
        setStatus('Analyzing...');
        log(`Sending text: ${text.slice(0, 20)}...`);
        worker.current.postMessage({ text });
    };

    // Calculate score from 3 classes (Multilingual DistilBERT)
    const getScore = () => {
        if (!result) return 5;

        // Single result fallback (if model mismatches)
        if (!Array.isArray(result)) return 5;

        // Find scores for each label (Labels: "positive", "neutral", "negative")
        const pos = result.find(x => x.label === 'positive')?.score || 0;
        const neu = result.find(x => x.label === 'neutral')?.score || 0;
        const neg = result.find(x => x.label === 'negative')?.score || 0;

        // Weighted Average for 0-10 Score
        // Neg contributes 0, Neu contributes 5, Pos contributes 10
        // Denominator is roughly 1 (prob sum), so usually just summing weighted parts is sufficient
        const weighted = (neg * 0) + (neu * 5) + (pos * 10);
        return weighted;
    };

    const score = getScore();
    const scoreColor = score > 6.5 ? 'text-emerald-500' : score < 3.5 ? 'text-red-500' : 'text-amber-500';
    const gaugeColor = score > 6.5 ? 'bg-emerald-500' : score < 3.5 ? 'bg-red-500' : 'bg-amber-500';

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/features/ai" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                    ← Back
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-900">Client-Side AI</h1>
                    <p className="text-slate-600 mt-2">
                        Zero API calls. 100% Privacy. Running locally in your browser.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">

                {/* INTERACTIVE DEMO */}
                <div className="space-y-6">
                    <div className="glass-panel p-8 rounded-2xl border-2 border-slate-200/60 shadow-xl relative overflow-hidden bg-white/80 backdrop-blur-xl">

                        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100">
                            {/* Progress bar for model downloading */}
                            {!ready && <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>}
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Try it out (Status: <span className={ready ? "text-emerald-600" : "text-amber-600"}>{status}</span>)
                            </label>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={!ready}
                                placeholder="Type something... e.g., 'I absolutely love this product!' or 'This is the worst experience ever.'"
                                className="w-full h-32 p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none shadow-inner"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => classify(input)}
                                disabled={!ready || !input.trim()}
                                className={`flex-1 py-3 px-6 rounded-xl font-bold text-white transition-all shadow-md active:scale-95 ${!ready || !input.trim()
                                    ? 'bg-slate-300 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
                                    }`}
                            >
                                Analyze Sentiment 🧠
                            </button>
                            <button
                                onClick={() => {
                                    setInput("The UI is incredibly intuitive and fast! Amazing work.");
                                    const text = "The UI is incredibly intuitive and fast! Amazing work.";
                                    // small timeout to let state update
                                    setTimeout(() => classify(text), 100);
                                }}
                                disabled={!ready}
                                className="px-4 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all"
                            >
                                Random Example
                            </button>
                        </div>

                        {/* Debug Console */}
                        <div className="mt-6">
                            <button
                                onClick={() => setLogs([])}
                                className="text-xs text-slate-400 hover:text-slate-600 mb-1"
                            >
                                Clear Logs
                            </button>
                            <div className="p-3 bg-slate-950 rounded-lg font-mono text-[10px] text-green-400 h-32 overflow-y-auto border border-slate-800 shadow-inner leading-tight">
                                {logs.length === 0 && <div className="opacity-50 italic">System logs will appear here...</div>}
                                {logs.map((L, i) => (
                                    <div key={i} className="border-b border-white/5 py-0.5">{L}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* VISUALIZATION */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg h-full flex flex-col justify-center items-center relative">
                        {result ? (
                            <>
                                <div className="text-center space-y-2 mb-8 animate-in fade-in zoom-in duration-500">
                                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sentiment Score</div>
                                    <div className={`text-6xl font-black ${scoreColor} transition-colors duration-500`}>
                                        {score.toFixed(1)}<span className="text-2xl text-slate-300">/10</span>
                                    </div>
                                    <div className="text-slate-500 font-medium text-xs mt-2 space-y-1">
                                        {Array.isArray(result) ? (
                                            <>
                                                <div className="flex justify-between w-full max-w-[200px] mx-auto gap-2">
                                                    <span className="text-red-500 font-bold">Neg: {(result.find(x => x.label === 'negative')?.score * 100).toFixed(0)}%</span>
                                                    <span className="text-amber-500 font-bold">Neu: {(result.find(x => x.label === 'neutral')?.score * 100).toFixed(0)}%</span>
                                                    <span className="text-emerald-500 font-bold">Pos: {(result.find(x => x.label === 'positive')?.score * 100).toFixed(0)}%</span>
                                                </div>
                                            </>
                                        ) : <div>Legacy Result</div>}
                                    </div>
                                </div>

                                {/* Gauge */}
                                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden relative">
                                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-300 z-10"></div>
                                    <div
                                        className={`absolute top-0 bottom-0 left-0 transition-all duration-1000 ease-out ${gaugeColor}`}
                                        style={{ width: `${score * 10}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between w-full mt-2 text-xs text-slate-400 font-bold uppercase">
                                    <span>Negative (0)</span>
                                    <span>Neutral (5)</span>
                                    <span>Positive (10)</span>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-slate-400 space-y-4">
                                <div className="text-6xl opacity-20">🤖</div>
                                <p>Enter text to see the AI analysis.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AIExplainer
                title="Sentiment Analysis"
                analogy="Like having a digital empath that reads the 'vibe' of your text."
                analogyIcon="🧠"
                modelName="Xenova/distilbert-base-multilingual-cased-sentiments-student"
                modelSize="Dynamic"
                modelLink="https://huggingface.co/Xenova/distilbert-base-multilingual-cased-sentiments-student"
                modelDescription="A distilled BERT model finetuned for sentiment analysis. It classifies text into Positive, Neutral, or Negative classes using a softmax layer on top of the transformer output."
                workerFileName="sentiment-worker.js"
                inputName="Text Sequence"
                outputName="Class Probabilities"
            />
        </div>
    );
}
