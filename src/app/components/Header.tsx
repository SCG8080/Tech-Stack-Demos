import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-200/50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Left Logo - VITAS */}
                <div className="flex-shrink-0">
                    <Image
                        src="/vitas.png"
                        alt="VITAS Logo"
                        width={120}
                        height={40}
                        className="h-10 w-auto object-contain"
                        priority
                    />
                </div>

                {/* Center Title / Nav */}
                <div className="flex-1 flex justify-center items-center gap-8">
                    <Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                        Overview
                    </Link>
                    <div className="hidden md:flex flex-col items-center">
                        <h1 className="text-2xl font-bold text-slate-900 leading-tight tracking-tight">
                            VITAS | Symbiotic
                        </h1>
                        <span className="text-xs text-slate-500 font-semibold tracking-widest uppercase mt-0.5">
                            Tech Stack Considerations
                        </span>
                    </div>
                    <Link href="/features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                        Demos
                    </Link>
                </div>

                {/* Right Logo - SCG */}
                <div className="flex-shrink-0">
                    <Image
                        src="/SCG.png"
                        alt="SCG Logo"
                        width={120}
                        height={40}
                        className="h-10 w-auto object-contain"
                        priority
                    />
                </div>
            </div>
        </header>
    );
}
