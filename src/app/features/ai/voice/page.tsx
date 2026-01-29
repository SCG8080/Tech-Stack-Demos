'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AIExplainer from '@/app/components/AIExplainer';

export default function VoicePage() {
    const [result, setResult] = useState('');
    const [status, setStatus] = useState('Initializing Whisper Model...');
    const [progress, setProgress] = useState(0);
    const [ready, setReady] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    // DEVICE SELECTION STATE
    const [devices, setDevices] = useState<{ label: string; value: string }[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState('');

    const [logs, setLogs] = useState<string[]>([]);
    const log = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

    const worker = useRef<Worker | null>(null);
    const audioContext = useRef<AudioContext | null>(null);
    const mediaStream = useRef<MediaStream | null>(null);
    const processor = useRef<ScriptProcessorNode | null>(null);
    const audioInput = useRef<MediaStreamAudioSourceNode | null>(null);
    const analyser = useRef<AnalyserNode | null>(null); // FOR VISUALIZER
    const audioData = useRef<number[]>([]);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        // 1. enumerate devices
        const checkDevices = async () => {
            try {
                // permission first to get labels
                await navigator.mediaDevices.getUserMedia({ audio: true });
                const devs = await navigator.mediaDevices.enumerateDevices();
                const audioIns = devs
                    .filter(d => d.kind === 'audioinput')
                    .map((d, i) => ({ label: d.label || `Microphone ${i + 1}`, value: d.deviceId }));

                setDevices(audioIns);
                if (audioIns.length > 0) setSelectedDeviceId(audioIns[0].value);
            } catch (e) {
                log(`⚠️ Could not list devices: ${e}`);
            }
        };
        checkDevices();

        // 2. Worker setup
        if (!worker.current) {
            const basePath = process.env.NODE_ENV === 'production' ? '/Tech-Stack-Demos' : '';
            log(`Creating worker from ${basePath}/voice-worker.js`);
            // FIX: Add cache busting to prevent stale worker loading
            worker.current = new Worker(`${basePath}/voice-worker.js?v=${Date.now()}`, { type: 'module' });

            worker.current.onerror = (err) => {
                const msg = err instanceof ErrorEvent ? err.message : 'Unknown worker error';
                log(`❌ Worker Error: ${msg}`);
                setStatus('Worker Error');
            };

            worker.current.onmessage = (e) => {
                const { status, progress, message, output, error } = e.data;

                if (status === 'progress') {
                    setProgress(progress);
                    setStatus(message || `Loading Model: ${Math.round(progress)}%`);
                } else if (status === 'ready') {
                    setReady(true);
                    setStatus('Ready (Click Mic to Record)');
                    setProgress(100);
                    log('Whisper Model Ready');
                } else if (status === 'complete') {
                    const text = output.text;
                    log(`Raw received text: "${text}"`);

                    if (!text) {
                        setResult('');
                        setStatus('Done (No speech detected)');
                    } else {
                        setResult(text);
                        setStatus('Done');
                    }
                    setIsRecording(false);

                } else if (status === 'error') {
                    log(`❌ Error: ${error}`);
                    setStatus('Error');
                }
            };

            log('Sending init command...');
            worker.current.postMessage({ type: 'init' });
        }

        return () => {
            worker.current?.terminate();
            worker.current = null;
            stopRecording();
            cancelAnimationFrame(animationFrameRef.current!);
        };
    }, []);

    // VISUALIZER LOOP
    const drawVisualizer = () => {
        if (!analyser.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyser.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        analyser.current.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2; // scale down

            // Dynamic Color
            ctx.fillStyle = `rgb(${barHeight + 100}, 50, 255)`;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }

        animationFrameRef.current = requestAnimationFrame(drawVisualizer);
    };

    const startRecording = async () => {
        try {
            setStatus('Listening...');
            setResult('');
            setIsRecording(true);
            audioData.current = [];
            log(`Requesting mic access (Device: ${selectedDeviceId || 'Default'})...`);

            const constraints = {
                audio: selectedDeviceId ? { deviceId: { exact: selectedDeviceId }, echoCancellation: true } : true
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            mediaStream.current = stream;

            audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            audioInput.current = audioContext.current.createMediaStreamSource(stream);

            // ANALYSER
            analyser.current = audioContext.current.createAnalyser();
            analyser.current.fftSize = 256;
            audioInput.current.connect(analyser.current);
            drawVisualizer(); // Start Animation

            processor.current = audioContext.current.createScriptProcessor(4096, 1, 1);

            processor.current.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                audioData.current.push(...inputData);
            };

            audioInput.current.connect(processor.current);
            processor.current.connect(audioContext.current.destination);
            log('Recording started');

        } catch (err) {
            console.error(err);
            setStatus('Microphone Error');
            log(`❌ Microphone Error: ${err}`);
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        if (!isRecording) return;

        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

        if (processor.current && audioInput.current) {
            audioInput.current.disconnect();
            processor.current.disconnect();
            analyser.current?.disconnect();
        }
        if (mediaStream.current) {
            mediaStream.current.getTracks().forEach(track => track.stop());
        }
        if (audioContext.current) {
            audioContext.current.close();
        }

        setIsRecording(false);
        setStatus('Transcribing...');
        log('Recording stopped. Processing...');

        // Clear Canvas
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }

        if (worker.current && audioData.current.length > 0) {
            const audioArray = new Float32Array(audioData.current);
            log(`Sending ${audioArray.length} samples to worker...`);
            worker.current.postMessage({
                type: 'transcribe',
                audio: audioArray
            });
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/features/ai" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                    ← Back
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-900">Voice Transcription</h1>
                    <p className="text-slate-600 mt-2">
                        Real-time Speech-to-Text using OpenAI Whisper (Tiny).
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <div className="glass-panel p-8 rounded-2xl border-2 border-slate-200/60 shadow-xl relative overflow-hidden bg-white/80 backdrop-blur-xl">
                        {!ready && <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100">
                            <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>}

                        <div className="flex flex-col items-center justify-center py-4">
                            {/* Device Select */}
                            <div className="w-full mb-6">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Microphone</label>
                                <select
                                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500"
                                    value={selectedDeviceId}
                                    onChange={(e) => setSelectedDeviceId(e.target.value)}
                                    disabled={isRecording}
                                >
                                    {devices.length === 0 && <option>Default Microphone</option>}
                                    {devices.map(d => (
                                        <option key={d.value} value={d.value}>{d.label}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={isRecording ? stopRecording : startRecording}
                                disabled={!ready}
                                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 mb-6 ${!ready ? 'bg-slate-200 cursor-not-allowed' :
                                    isRecording ? 'bg-red-500 shadow-red-500/50 shadow-lg scale-110 animate-pulse' :
                                        'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30 shadow-lg'
                                    }`}
                            >
                                <span className="text-4xl">
                                    {isRecording ? '⏹' : '🎙'}
                                </span>
                            </button>

                            <div className={`font-mono font-bold ${isRecording ? 'text-red-500' : 'text-slate-500'} mb-4`}>
                                {status}
                            </div>

                            {/* VISUALIZER CANVAS */}
                            <div className="h-16 w-full bg-slate-50 rounded-lg border border-slate-100 overflow-hidden relative">
                                {!isRecording && <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-300 uppercase tracking-widest">Visualizer</div>}
                                <canvas ref={canvasRef} width="300" height="64" className="w-full h-full"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <span>📝</span> Transcript
                    </h3>

                    {/* Transcript Box */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[100px] relative">
                        {result ? (
                            <p className="text-slate-800 leading-relaxed animate-in fade-in duration-500 text-lg font-medium">
                                "{result}"
                            </p>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-300 italic">
                                {status.includes('No speech') ? 'No speech detected (Try moving closer to mic)' : 'Speak to see text...'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Debug Console */}
                <div className="col-span-full mt-4">
                    <button
                        onClick={() => setLogs([])}
                        className="text-xs text-slate-400 hover:text-slate-600 mb-1"
                    >
                        Clear Logs
                    </button>
                    <div className="p-3 bg-slate-950 rounded-lg font-mono text-[10px] text-rose-400 h-32 overflow-y-auto border border-slate-800 shadow-inner leading-tight">
                        {logs.length === 0 && <div className="opacity-50 italic">System logs will appear here...</div>}
                        {logs.map((L, i) => (
                            <div key={i} className="border-b border-white/5 py-0.5">{L}</div>
                        ))}
                    </div>
                </div>
            </div>

            <AIExplainer
                title="Speech Recognition"
                analogy="Your computer listens with 'Whisper', an advanced neural network trained on 680,000 hours of internet audio."
                analogyIcon="🎤"
                modelName="Xenova/whisper-tiny.en"
                modelSize="35 MB (Quantized)"
                modelLink="https://huggingface.co/Xenova/whisper-tiny.en"
                modelDescription="OpenAI's Whisper (Tiny). It uses a Conformer-based architecture to map audio spectrograms to text tokens, handling accents and background noise remarkably well."
                workerFileName="voice-worker.js"
                inputName="Audio Waveform"
                outputName="Token Sequence"
            />
        </div>
    );
}
