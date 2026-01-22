'use client';

import { useState } from 'react';
import Link from 'next/link';
import TechnicalExplainer from '@/app/components/TechnicalExplainer';

// --- VISUALIZER COMPONENT ---
function RPCVisualizer({ step, payload, response }: { step: 'idle' | 'sending' | 'processing' | 'returning' | 'done', payload: any, response: any }) {
    return (
        <div className="relative py-12 px-4 bg-slate-50 border-y border-slate-200 overflow-hidden">
            {/* Background Network Grid */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="max-w-4xl mx-auto flex justify-between items-center relative z-10">

                {/* CLIENT NODE */}
                <div className={`transition-all duration-500 transform ${step === 'idle' || step === 'done' ? 'scale-100 opacity-100' : 'scale-95 opacity-80'}`}>
                    <div className="bg-white p-4 rounded-xl border-2 border-slate-300 shadow-sm w-48 text-center">
                        <div className="text-4xl mb-2">💻</div>
                        <div className="font-bold text-slate-700">Client (Browser)</div>
                        <div className="text-xs text-slate-500 mt-1">user initiates action</div>
                    </div>
                </div>

                {/* ANIMATED PACKET */}
                <div className="flex-1 relative h-32 flex items-center justify-center">
                    {/* Connection Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -z-10"></div>

                    {/* Request Packet -> */}
                    <div className={`absolute transition-all duration-1000 ease-in-out transform
                        ${step === 'idle' ? 'left-0 opacity-0 scale-50' : ''}
                        ${step === 'sending' ? 'left-[40%] opacity-100 scale-100' : ''}
                        ${step === 'processing' ? 'left-[80%] opacity-0 scale-50' : ''}
                        ${step === 'returning' ? 'left-[80%] opacity-0' : ''}
                        ${step === 'done' ? 'left-0 opacity-0' : ''}
                    `}>
                        <div className="bg-indigo-600 text-white text-xs font-mono py-1 px-3 rounded-full shadow-lg whitespace-nowrap">
                            FN_CALL(formData) ➡️
                        </div>
                    </div>

                    {/* Response Packet <- */}
                    <div className={`absolute transition-all duration-1000 ease-in-out transform
                        ${step === 'idle' ? 'right-[80%] opacity-0' : ''}
                        ${step === 'sending' ? 'right-[80%] opacity-0' : ''}
                        ${step === 'processing' ? 'right-[20%] opacity-0' : ''}
                        ${step === 'returning' ? 'right-[40%] opacity-100 scale-100' : ''}
                        ${step === 'done' ? 'right-[80%] opacity-0 scale-50' : ''}
                    `}>
                        <div className="bg-emerald-600 text-white text-xs font-mono py-1 px-3 rounded-full shadow-lg whitespace-nowrap">
                            ⬅️ RETURN {JSON.stringify(response?.success)}
                        </div>
                    </div>
                </div>

                {/* SERVER NODE */}
                <div className={`transition-all duration-500 transform ${step === 'processing' ? 'scale-110 ring-4 ring-indigo-200 border-indigo-500' : 'scale-100 border-slate-300'}`}>
                    <div className="bg-slate-900 p-4 rounded-xl border-2 shadow-xl w-48 text-center relative overflow-hidden">
                        {step === 'processing' && <div className="absolute inset-0 bg-indigo-500/20 animate-pulse"></div>}
                        <div className="text-4xl mb-2">☁️</div>
                        <div className="font-bold text-white">Server (Node.js)</div>
                        <div className="text-xs text-slate-400 mt-1">executes function</div>

                        {/* Server Log Simulation */}
                        <div className={`absolute -bottom-12 left-0 right-0 bg-black/80 text-[10px] text-green-400 font-mono p-2 transition-all duration-300 ${step === 'processing' ? 'translate-y-0' : 'translate-y-full'}`}>
                            &gt; verifying email...<br />&gt; database.save()...
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// --- MAIN PAGE ---

interface FormState {
    message: string;
    errors: Record<string, string[]>;
    success: boolean;
}

const initialState: FormState = { message: '', errors: {}, success: false };

export default function ServerActionsPage() {
    // VISUALIZER STATE
    const [step, setStep] = useState<'idle' | 'sending' | 'processing' | 'returning' | 'done'>('idle');

    // FORM STATE
    const [state, setState] = useState<FormState>(initialState);
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. SENDING
        setStep('sending');
        await new Promise(r => setTimeout(r, 1000)); // Animate travel time

        // 2. PROCESSING (Simulated Server)
        setStep('processing');
        await new Promise(r => setTimeout(r, 1500)); // Animate execution time

        // 3. RETURNING
        setStep('returning');
        const isSuccess = email.includes('@');
        const response: FormState = isSuccess
            ? { success: true, message: 'Saved to Database!', errors: {} }
            : { success: false, message: 'Invalid Email', errors: { email: ['Missing @ symbol'] } };

        await new Promise(r => setTimeout(r, 1000)); // Animate travel time

        // 4. DONE
        setStep('done');
        setState(response);
    };

    return (
        <div className="space-y-8">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/features/next" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600">← Back</Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Server Actions Visualizer</h1>
                        <p className="text-slate-600">See how "Invisible APIs" work under the hood.</p>
                    </div>
                </div>
            </div>

            {/* VISUALIZER STAGE */}
            <RPCVisualizer step={step} payload={{ email }} response={state} />

            <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-12">

                {/* THE CODE (Mental Model) */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                        The Mental Model (Code)
                    </h3>
                    <div className="bg-slate-900 rounded-xl p-4 overflow-hidden shadow-lg border border-slate-700 relative">
                        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-bl-lg">Running on Server</div>
                        <pre className="text-sm font-mono text-indigo-300 overflow-x-auto">
                            {`// actions.ts
'use server'

export async function saveEmail(formData) {
  // 1. This runs SECURELY on Node.js
  const email = formData.get('email');
  
  // 2. Direct DB access (No API needed)
  await db.users.create({ email });
  
  // 3. Return data to client
  return { success: true };
}`}
                        </pre>
                    </div>
                    <p className="text-sm text-slate-600 italic">
                        Notice: You just write a function. Next.js handles the API endpoint, the fetch(), and the serialization for you.
                    </p>
                </div>

                {/* THE INTERACTION (Try it) */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                        Try the Action
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Enter Email</label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="test@example.com"
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                            {/* Safe access to errors */}
                            {state.errors && state.errors.email && (
                                <p className="text-red-500 text-xs mt-1">{state.errors.email[0]}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={step !== 'idle' && step !== 'done'}
                            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {step === 'idle' || step === 'done' ? 'Simulate Server Action' : 'Executing...'}
                        </button>

                        {state.message && step === 'done' && (
                            <div className={`p-3 rounded-lg text-sm text-center animate-in fade-in slide-in-from-bottom-2 ${state.success ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {state.message}
                            </div>
                        )}
                    </form>
                </div>

            </div>

            <div className="max-w-4xl mx-auto px-6 mt-12 mb-12">
                <TechnicalExplainer
                    title="What actually happened?"
                    analogy="It's like having a walkie-talkie directly to the server room. You speak (call function), and the person in the server room does the work and speaks back. You don't need to write a letter (API Request), address it (URL), and mail it."
                    points={[
                        "Zero API Routes: You didn't create /api/save-email. Next.js created a hidden one for you.",
                        "Closure Support: You can pass data directly to the function.",
                        "Type Safety: The arguments and return types are checked at build time.",
                        "Not SSR: SSR is for *Downloading the Page* (GET). Server Actions are for *Submitting Data* (POST/RPC) after the page loads."
                    ]}
                />
            </div>

        </div>
    );
}
