'use client';

import Link from 'next/link';

export default function AiFeaturesPage() {
    const features = [
        {
            title: "Sentiment Analysis",
            description: "Real-time text classification (Positive/Negative) using DistilBERT. Runs locally.",
            link: "/features/ai/sentiment",
            icon: "🎭",
            color: "bg-emerald-500",
            tech: "DistilBERT"
        },
        {
            title: "Knowledge Base",
            description: "Semantic search engine using vector embeddings. Finds meaning, not just keywords.",
            link: "/features/ai/semantic-search",
            icon: "🔍",
            color: "bg-blue-500",
            tech: "Embeddings"
        },
        {
            title: "Voice-to-Text",
            description: "In-browser speech recognition converting microphone input to text instantly.",
            link: "/features/ai/voice",
            icon: "🎙",
            color: "bg-rose-500",
            tech: "Whisper"
        },
        {
            title: "Smart Ticket Triage",
            description: "Enterprise Zero-Shot classification to auto-tag support tickets (Billing, Urgent, Tech).",
            link: "/features/ai/classification",
            icon: "🏷️",
            color: "bg-orange-500",
            tech: "Zero-Shot BERT"
        },
        {
            title: "Smart Compose",
            description: "Predictive text generation that suggests the next words as you type (Gmail style).",
            link: "/features/ai/generation",
            icon: "✨",
            color: "bg-purple-500",
            tech: "DistilGPT-2"
        },
        {
            title: "Object Detection",
            description: "Computer Vision that finds and outlines people, vehicles, and items in images.",
            link: "/features/ai/vision",
            icon: "👁️",
            color: "bg-indigo-500",
            tech: "DETR (ResNet)"
        }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
                <Link
                    href="/features"
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                >
                    ← Back to Demos
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-900">Client-Side AI</h1>
                    <p className="text-slate-600 mt-2">
                        Powered by Transformers.js, WebAssembly, and WebGPU. Zero Server Costs.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature) => (
                    <Link
                        key={feature.link}
                        href={feature.link}
                        className="group relative bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
                    >
                        <div className={`absolute top-0 right-0 w-24 h-24 ${feature.color} opacity-5 rounded-bl-[100px] transition-all group-hover:opacity-10`} />

                        <div className="flex items-start justify-between mb-6">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-slate-50 group-hover:scale-110 transition-transform`}>
                                {feature.icon}
                            </div>
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-mono font-semibold rounded-full">
                                {feature.tech}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                            {feature.title}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            {feature.description}
                        </p>

                        <div className="mt-6 flex items-center text-sm font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors gap-2">
                            Launch Demo <span>→</span>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-12 space-y-8">
                <section className="p-8 bg-slate-900 rounded-3xl text-slate-300 border border-slate-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5">
                        <svg className="w-64 h-64 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 22H22L12 2Z" />
                        </svg>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="text-3xl">🛠️</span> Under the Hood: The Tech Stack
                    </h3>

                    <div className="grid md:grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-4">
                            <div className="group">
                                <h4 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                                    <span className="text-blue-400">01.</span> ONNX Runtime Web
                                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] border border-blue-500/20 uppercase">Core Engine</span>
                                </h4>
                                <p className="text-sm leading-relaxed text-slate-400">
                                    Developed by <strong>Microsoft</strong>, this is the high-performance inference engine that actually runs the neural networks in your browser. It utilizes <strong>WebAssembly (WASM)</strong> for CPU execution and <strong>WebGPU</strong> for hardware acceleration.
                                </p>
                                <div className="mt-2 flex gap-3 text-xs">
                                    <a href="https://onnxruntime.ai/" target="_blank" className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1">
                                        Official Website ↗
                                    </a>
                                    <a href="https://github.com/microsoft/onnxruntime" target="_blank" className="text-slate-500 hover:text-white flex items-center gap-1">
                                        GitHub (MIT License) ↗
                                    </a>
                                </div>
                            </div>

                            <div className="group pt-4 border-t border-slate-800">
                                <h4 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                                    <span className="text-yellow-400">02.</span> Transformers.js
                                    <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px] border border-yellow-500/20 uppercase">Library</span>
                                </h4>
                                <p className="text-sm leading-relaxed text-slate-400">
                                    The JavaScript equivalent of Hugging Face's popular Python library. It handles model loading, tokenization, and processing pipelines, creating a bridge between your React code and the ONNX backend.
                                </p>
                                <div className="mt-2 text-xs">
                                    <a href="https://huggingface.co/docs/transformers.js/index" target="_blank" className="text-yellow-400 hover:text-yellow-300 hover:underline flex items-center gap-1">
                                        Hugging Face Docs ↗
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                                    💼 Commercial Use & Licensing
                                </h4>
                                <ul className="space-y-3 text-sm text-slate-400">
                                    <li className="flex gap-2">
                                        <span className="text-emerald-400 font-bold">✓</span>
                                        <span>
                                            <strong>The Runtime:</strong> ONNX Runtime is <strong>MIT</strong> licensed. Transformers.js is <strong>Apache 2.0</strong> licensed. Both are open-source and free for commercial use.
                                        </span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-amber-400 font-bold">⚠</span>
                                        <span>
                                            <strong>The Models:</strong> Specific AI models (e.g., Llama, Whisper, BERT) have their own licenses. While many like BERT/Whisper are MIT/Apache, some modern LLMs have restrictions. Always check the model card on Hugging Face.
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div className="p-4 bg-indigo-900/20 rounded-xl border border-indigo-500/30">
                                <h4 className="text-indigo-300 font-bold mb-1 text-sm">Why Client-Side?</h4>
                                <p className="text-xs text-indigo-200/80 leading-relaxed">
                                    Running AI on the client means <strong>Zero API privacy risks</strong> (data stays on device) and <strong>Zero server inference costs</strong> (client pays the compute). Ideally suited for high-privacy or offline-first apps.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
