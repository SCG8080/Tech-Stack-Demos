import Link from 'next/link';
import { ArrowRightIcon, ServerStackIcon, BoltIcon } from '@heroicons/react/24/outline'; // Need to install heroicons or use raw SVG. I'll use raw SVG to avoid dependency issues for now or just generic spans if needed, but raw SVG is safer.

function NextJsIcon() {
  return (
    <svg className="w-8 h-8 text-black" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="mask0_1_2" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
        <circle cx="90" cy="90" r="90" fill="black" />
      </mask>
      <g mask="url(#mask0_1_2)">
        <circle cx="90" cy="90" r="90" fill="black" />
        <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="white" />
        <rect x="115" y="54" width="12" height="72" fill="white" />
      </g>
    </svg>
  )
}

function TanStackIcon() {
  return (
    <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 19.7778H22L12 2Z" fill="#FF4154" />
    </svg>
  )
}

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      {/* Hero Section */}
      <section className="text-center py-20 bg-white/50 rounded-3xl glass-panel relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 opacity-50 -z-10" />
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">Tech Stack</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Considerations</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Explore and play with this app to see what's possible. From Server Actions to interactive playgrounds, discover the features that make modern Next.js exciting.
        </p>
      </section>

      {/* Feature Navigation Grid */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* Next.js Card */}
        <Link href="/features/next" className="group relative block p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <NextJsIcon />
          </div>

          <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center mb-6 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
            <NextJsIcon />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">Next.js Core</h2>
          <p className="text-slate-600 mb-6">
            Explore server-side architecture, caching strategies, and the evolution of the App Router.
          </p>

          <ul className="space-y-2 mb-8 text-sm text-slate-500">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Cache & Revalidation
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Node.js Support Matrix
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Feature History
            </li>
          </ul>

          <div className="flex items-center gap-2 text-indigo-600 font-semibold group-hover:gap-4 transition-all">
            Start Demo <ArrowRight />
          </div>
        </Link>

        {/* TanStack Query Card */}
        <Link href="/features/query" className="group relative block p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <TanStackIcon />
          </div>

          <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center mb-6 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
            <TanStackIcon />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">TanStack Query</h2>
          <p className="text-slate-600 mb-6">
            Deep dive into asynchronous state management, deduplication, and intelligent caching.
          </p>

          <ul className="space-y-2 mb-8 text-sm text-slate-500">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Request Deduplication
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Smart Polling
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Cache Life-cycle
            </li>
          </ul>

          <div className="flex items-center gap-2 text-emerald-600 font-semibold group-hover:gap-4 transition-all">
            Start Demo <ArrowRight />
          </div>
        </Link>

        {/* Client-Side AI Card */}
        <Link href="/features/ai" className="group relative block p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-violet-300 transition-all duration-300 md:col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-4xl">🧠</span>
          </div>

          <div className="h-12 w-12 rounded-xl bg-violet-50 flex items-center justify-center mb-6 group-hover:bg-violet-500 group-hover:text-white transition-colors duration-300">
            <span className="font-bold text-xl">AI</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-violet-600 transition-colors">Client-Side AI</h2>
          <p className="text-slate-600 mb-6">
            Run ML models like BERT entirely in the browser with WebAssembly. Zero API calls.
          </p>

          <ul className="space-y-2 mb-8 text-sm text-slate-500">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> DistilBERT & YOLO
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Whisper (Voice-to-Text)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Semantic Search (RAG)
            </li>
          </ul>

          <div className="flex items-center gap-2 text-violet-600 font-semibold group-hover:gap-4 transition-all">
            Try Tool <ArrowRight />
          </div>
        </Link>

        {/* Zustand Card */}
        <Link href="/features/zustand" className="group relative block p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 md:col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <div className="w-8 h-8 rounded-full border-4 border-black" />
          </div>

          <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
            <span className="font-bold text-xl">Z</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">Zustand State</h2>
          <p className="text-slate-600 mb-6">
            Client-side state management with async persistence (LocalStorage/AsyncStorage).
          </p>

          <ul className="space-y-2 mb-8 text-sm text-slate-500">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Persistent Store
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Hydration Handling
            </li>
          </ul>

          <div className="flex items-center gap-2 text-orange-600 font-semibold group-hover:gap-4 transition-all">
            Start Demo <ArrowRight />
          </div>
        </Link>

        {/* Tailwind Card */}
        <Link href="/features/tailwind" className="group relative block p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-cyan-300 transition-all duration-300 md:col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-cyan-500" />
          </div>

          <div className="h-12 w-12 rounded-xl bg-cyan-50 flex items-center justify-center mb-6 group-hover:bg-cyan-500 group-hover:text-white transition-colors duration-300">
            <span className="font-bold text-xl">CSS</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-cyan-600 transition-colors">Tailwind CSS</h2>
          <p className="text-slate-600 mb-6">
            Utility-first framework for rapid, responsive, and performance-optimized UI development.
          </p>

          <ul className="space-y-2 mb-8 text-sm text-slate-500">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> JIT Compilation
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Responsive Design
            </li>
          </ul>

          <div className="flex items-center gap-2 text-cyan-600 font-semibold group-hover:gap-4 transition-all">
            Read More <ArrowRight />
          </div>
        </Link>
      </div>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  );
}
