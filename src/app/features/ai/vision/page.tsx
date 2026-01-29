'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AIExplainer from '@/app/components/AIExplainer';

export default function ObjectDetectionPage() {
    const [status, setStatus] = useState('Initializing Vision Model...');
    const [progress, setProgress] = useState(0);
    const [ready, setReady] = useState(false);
    const [results, setResults] = useState<any[]>([]);

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const worker = useRef<Worker | null>(null);

    const [logs, setLogs] = useState<string[]>([]);
    const log = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

    useEffect(() => {
        if (!worker.current) {
            log('Creating worker from /vision-worker.js');
            worker.current = new Worker(`/vision-worker.js?v=${Date.now()}`, { type: 'module' });

            worker.current.onerror = (err) => {
                log(`❌ Worker Error: ${err instanceof ErrorEvent ? err.message : 'Unknown'}`);
                setStatus('Worker Error');
            };

            worker.current.onmessage = (e) => {
                const { status, progress, output, error } = e.data;

                if (status === 'progress') {
                    setProgress(progress);
                    setStatus(`Loading Vision Model: ${Math.round(progress)}%`);
                } else if (status === 'ready') {
                    setReady(true);
                    setStatus('Ready. Upload an image to analyze.');
                    setProgress(100);
                    log('DETR Model Loaded');
                } else if (status === 'complete') {
                    setResults(output);
                    setStatus(`Found ${output.length} objects`);
                    log(`Detected ${output.length} objects`);
                    drawBoxes(output);
                } else if (status === 'error') {
                    log(`❌ Error: ${error}`);
                    setStatus('Error processing image');
                }
            };

            log('Sending init command...');
            worker.current.postMessage({ type: 'init' });
        }

        return () => {
            worker.current?.terminate();
            worker.current = null;
        };
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setImageUrl(url);
        setResults([]);

        // Clear canvas
        const ctx = canvasRef.current?.getContext('2d');
        ctx?.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

        // Send to worker
        if (ready) {
            setStatus('Analyzing Image...');
            log('Sending image for inference...');
            worker.current?.postMessage({ type: 'detect', image: url });
        }
    };

    const drawBoxes = (detections: any[]) => {
        if (!canvasRef.current || !imageRef.current) return;

        const img = imageRef.current;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        // Match canvas size to displayed image size
        canvasRef.current.width = img.width;
        canvasRef.current.height = img.height;
        ctx.clearRect(0, 0, img.width, img.height);

        // IMPORTANT: The model returns coordinates relative to the ORIGINAL image size.
        const scaleX = img.width / img.naturalWidth;
        const scaleY = img.height / img.naturalHeight;

        detections.forEach(d => {
            const { xmin, ymin, xmax, ymax } = d.box;

            // Scale detections to display size
            const x = xmin * scaleX;
            const y = ymin * scaleY;
            const w = (xmax - xmin) * scaleX;
            const h = (ymax - ymin) * scaleY;

            // Draw Box
            const color = '#6366f1'; // Indigo
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, w, h);

            // Draw Background for Label
            ctx.fillStyle = color;
            const text = `${d.label} ${Math.round(d.score * 100)}%`;
            const textWidth = ctx.measureText(text).width;
            ctx.fillRect(x, y - 24, textWidth + 10, 24);

            // Draw Label
            ctx.fillStyle = 'white';
            ctx.font = '14px monospace';
            ctx.fillText(text, x + 5, y - 7);
        });
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/features/ai" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                    ← Back
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-900">Object Detection (Vision)</h1>
                    <p className="text-slate-600 mt-2">
                        Detects objects in images using DETR (DEtection TRansformer).
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <div className="glass-panel p-8 rounded-2xl border-2 border-slate-200/60 shadow-xl relative overflow-hidden bg-white/80 backdrop-blur-xl">
                        {!ready && <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100">
                            <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>}

                        <div className="mb-6 relative">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Upload Photo
                            </label>

                            <div className="relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={!ready}
                                    className="block w-full text-sm text-slate-500
                                      file:mr-4 file:py-2 file:px-4
                                      file:rounded-full file:border-0
                                      file:text-sm file:font-semibold
                                      file:bg-indigo-50 file:text-indigo-700
                                      hover:file:bg-indigo-100
                                      cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
                                    "
                                />
                                {!ready && (
                                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center border border-slate-200 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-indigo-700 font-bold text-sm">Downloading AI Model ({Math.round(progress)}%)</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">One-time download (100MB)</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RESULT CANVAS LAYER */}
                        <div className="relative rounded-lg overflow-hidden bg-slate-100 min-h-[300px] flex items-center justify-center border border-slate-200">
                            {imageUrl ? (
                                <>
                                    <img
                                        ref={imageRef}
                                        src={imageUrl}
                                        alt="Analysis Target"
                                        className="max-w-full h-auto"
                                        onLoad={() => {
                                            if (results.length > 0) drawBoxes(results);
                                        }}
                                    />
                                    <canvas
                                        ref={canvasRef}
                                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                                    />
                                </>
                            ) : (
                                <div className="text-slate-400">Preview Area</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <span>👁️</span> Detections
                    </h3>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm max-h-[500px] overflow-y-auto">
                        {results.length > 0 ? (
                            <ul className="space-y-2">
                                {results.map((r, i) => (
                                    <li key={i} className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-100">
                                        <span className="font-bold text-slate-700 capitalize">
                                            {r.label}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded font-mono ${r.score > 0.9 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {Math.round(r.score * 100)}% Confidence
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-slate-400 text-sm text-center py-8">
                                No objects detected yet.
                            </div>
                        )}
                    </div>

                    {/* Debug Logs */}
                    <div className="bg-slate-950 p-3 rounded-lg font-mono text-[10px] text-yellow-400 h-40 overflow-y-auto border border-slate-800 shadow-inner leading-tight">
                        {logs.map((L, i) => (
                            <div key={i} className="border-b border-white/5 py-0.5">{L}</div>
                        ))}
                    </div>
                </div>
            </div>

            <AIExplainer
                title="Object Detection (Vision)"
                analogy="It's like giving your computer a pair of eyes and a label maker."
                analogyIcon="👁️"
                modelName="Xenova/detr-resnet-50"
                modelSize="160 MB (Quantized)"
                modelLink="https://huggingface.co/Xenova/detr-resnet-50"
                modelDescription="Facebook's DEtection TRansformer (DETR). It uses a ResNet-50 backbone for feature extraction and a Transformer encoder-decoder to predict bounding boxes. We run the Int8 quantized version via ONNX Runtime Webwasm."
                workerFileName="vision-worker.js"
                inputName="Image Tensor (Pixel Data)"
                outputName="Bounding Boxes [x,y,w,h]"
            />
        </div>
    );
}
