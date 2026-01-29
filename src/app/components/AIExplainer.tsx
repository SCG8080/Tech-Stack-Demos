'use client';

import { useState } from 'react';

type Tab = 'magic' | 'specs' | 'hood';

interface Props {
    title: string;
    analogy: string;
    analogyIcon?: string;
    modelName: string;
    modelSize: string;
    modelLink: string;
    modelDescription: string;
    workerFileName: string;
    inputName: string;   // e.g., "Text", "Audio", "Image"
    outputName: string;  // e.g., "Vectors", "Text", "Bounding Boxes"
}

export default function AIExplainer({
    title, analogy, analogyIcon = "🪄",
    modelName, modelSize, modelLink, modelDescription,
    workerFileName, inputName, outputName
}: Props) {
    const [activeTab, setActiveTab] = useState<Tab>('magic');

    return (
        <div className="mt-12 border-t border-slate-200 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800">

                {/* Header */}
                <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="font-bold text-slate-100 flex items-center gap-2 text-lg">
                        <span className="text-indigo-400">🧠</span> AI Knowledge Hub
                    </h3>
                    <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                        <button
                            onClick={() => setActiveTab('magic')}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'magic' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            ✨ The Magic (Simpler)
                        </button>
                        <button
                            onClick={() => setActiveTab('specs')}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'specs' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            📋 Model Specs
                        </button>
                        <button
                            onClick={() => setActiveTab('hood')}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'hood' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            🔧 Under the Hood
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 min-h-[300px]">

                    {/* TAB: THE MAGIC */}
                    {activeTab === 'magic' && (
                        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                            <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-2xl p-6 text-center">
                                <div className="text-6xl mb-4 animate-bounce hover:scale-110 transition-transform cursor-pointer">{analogyIcon}</div>
                                <h4 className="text-xl font-bold text-indigo-300 mb-2">{title}</h4>
                                <p className="text-indigo-100 text-lg leading-relaxed max-w-2xl mx-auto">
                                    "{analogy}"
                                </p>
                            </div>

                            <div className="relative pt-8 pb-4">
                                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -z-10 transform -translate-y-1/2"></div>
                                <div className="flex justify-between max-w-lg mx-auto text-center relative">

                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-700 shadow-xl z-10">
                                            <span className="text-2xl">👤</span>
                                        </div>
                                        <span className="text-xs font-bold text-slate-500 uppercase">{inputName}</span>
                                    </div>

                                    <div className="flex flex-col items-center justify-center -mt-6">
                                        <span className="text-xs text-indigo-400 font-mono mb-1 animate-pulse">Running Locally...</span>
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping delay-0"></div>
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping delay-150"></div>
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping delay-300"></div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center border-4 border-indigo-900 shadow-xl shadow-indigo-900/50 z-10 animate-pulse">
                                            <span className="text-2xl">🤖</span>
                                        </div>
                                        <span className="text-xs font-bold text-indigo-400 uppercase">AI MAGIC</span>
                                    </div>

                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-16 h-16 bg-emerald-900 rounded-full flex items-center justify-center border-2 border-emerald-700 shadow-xl z-10">
                                            <span className="text-2xl">⚡</span>
                                        </div>
                                        <span className="text-xs font-bold text-emerald-500 uppercase">{outputName}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: SPECS */}
                    {activeTab === 'specs' && (
                        <div className="overflow-hidden bg-slate-950 rounded-xl border border-slate-800 animate-in fade-in zoom-in-95 duration-300">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-slate-900 text-slate-200 uppercase font-bold text-xs">
                                    <tr>
                                        <th className="px-6 py-3">Attribute</th>
                                        <th className="px-6 py-3">Value</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    <tr className="hover:bg-slate-900/50">
                                        <td className="px-6 py-4 font-bold text-slate-300">Model Architecture</td>
                                        <td className="px-6 py-4 font-mono text-indigo-400">{modelName}</td>
                                    </tr>
                                    <tr className="hover:bg-slate-900/50">
                                        <td className="px-6 py-4 font-bold text-slate-300">Download Size</td>
                                        <td className="px-6 py-4 text-emerald-400 font-bold">{modelSize} (Cached)</td>
                                    </tr>
                                    <tr className="hover:bg-slate-900/50">
                                        <td className="px-6 py-4 font-bold text-slate-300">Optimization</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs border border-slate-700">Quantized (Int8)</span>
                                            <span className="ml-2 bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs border border-slate-700">ONNX Format</span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-900/50">
                                        <td className="px-6 py-4 font-bold text-slate-300">Source</td>
                                        <td className="px-6 py-4">
                                            <a href={modelLink} target="_blank" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">
                                                Hugging Face Hub ↗
                                            </a>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-900/50">
                                        <td className="px-6 py-4 font-bold text-slate-300">Description</td>
                                        <td className="px-6 py-4">{modelDescription}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* TAB: HOOD */}
                    {activeTab === 'hood' && (
                        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in zoom-in-95 duration-300">

                            <div className="space-y-4">
                                <h4 className="font-bold text-slate-200 border-b border-slate-800 pb-2">Tech Stack Deep Dive</h4>
                                <ul className="space-y-4">
                                    <li className="flex gap-3">
                                        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center font-bold text-slate-500">1</div>
                                        <div>
                                            <div className="text-slate-200 font-bold text-sm">Transformers.js</div>
                                            <div className="text-slate-500 text-xs mt-1">
                                                The "Brain" logic. It downloads the model configuration and tokenizer (vocabulary) from Hugging Face.
                                            </div>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="w-8 h-8 rounded bg-indigo-900/50 flex items-center justify-center font-bold text-indigo-400">2</div>
                                        <div>
                                            <div className="text-indigo-300 font-bold text-sm flex items-center gap-2">
                                                ONNX Runtime Web
                                                <span className="bg-indigo-900 text-[9px] px-1 rounded text-indigo-200 uppercase">Engine</span>
                                            </div>
                                            <div className="text-slate-500 text-xs mt-1 leading-relaxed">
                                                A high-performance inference engine by Microsoft. It runs the "Universal" AI model format (.onnx).
                                                This ensures models trained in Python (PyTorch/TensorFlow) run perfectly in JavaScript.
                                            </div>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="w-8 h-8 rounded bg-amber-900/50 flex items-center justify-center font-bold text-amber-500">3</div>
                                        <div>
                                            <div className="text-amber-400 font-bold text-sm flex items-center gap-2">
                                                WebAssembly (WASM)
                                                <span className="bg-amber-900 text-[9px] px-1 rounded text-amber-200 uppercase">Speed</span>
                                            </div>
                                            <div className="text-slate-500 text-xs mt-1 leading-relaxed">
                                                Standard JS is too slow for heavy math. We compile the C++ AI engine into WASM,
                                                giving us <strong>near-native performance</strong> inside the browser.
                                            </div>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="w-8 h-8 rounded bg-emerald-900/50 flex items-center justify-center font-bold text-emerald-400">4</div>
                                        <div>
                                            <div className="text-emerald-300 font-bold text-sm">Web Worker</div>
                                            <div className="text-slate-500 text-xs mt-1">
                                                We run this in a background thread <span className="font-mono bg-slate-800 px-1 rounded text-slate-300">/{workerFileName}</span> so it never freezes your clicks or scroll.
                                            </div>
                                        </div>
                                    </li>
                                </ul>

                                <div className="pt-4 border-t border-slate-800">
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <span>License:</span>
                                        <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">Apache 2.0 / MIT</span>
                                        <span className="text-[10px] text-slate-500">(100% Open Source Models)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold text-slate-200 border-b border-slate-800 pb-2">Verify it Yourself (Chrome)</h4>
                                <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-4 font-mono text-xs">
                                    <div>
                                        <div className="text-slate-500 mb-1">1. See the Engine:</div>
                                        <div className="text-emerald-400">F12 &gt; Network Tab &gt; Filter "Wasm"</div>
                                        <div className="text-slate-600 mt-1">Look for: <span className="text-slate-300">ort-wasm-simd.wasm</span></div>
                                    </div>

                                    <div>
                                        <div className="text-slate-500 mb-1">2. See the Worker:</div>
                                        <div className="text-emerald-400">F12 &gt; Sources Tab &gt; Threads</div>
                                        <div className="text-slate-600 mt-1">Look for: <span className="text-slate-300">{workerFileName}</span></div>
                                    </div>

                                    <div>
                                        <div className="text-slate-500 mb-1">3. See the Model:</div>
                                        <div className="text-emerald-400">F12 &gt; Network Tab &gt; Filter "Fetch"</div>
                                        <div className="text-slate-600 mt-1">Look for: <span className="text-slate-300">.onnx</span> files</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
