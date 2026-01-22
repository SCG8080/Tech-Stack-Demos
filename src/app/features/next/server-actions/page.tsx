'use client';

import { useState } from 'react';
import Link from 'next/link';

const initialState = {
    message: '',
    errors: {} as Record<string, string[]>,
    success: false,
};

// Mock Server Action
async function mockSubmitContactForm(prevState: any, formData: FormData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    // Simulate validation
    const errors: Record<string, string[]> = {};
    if (!email || !email.includes('@')) {
        errors.email = ['Please enter a valid email address.'];
    }
    if (!message || message.length < 10) {
        errors.message = ['Message must be at least 10 characters.'];
    }

    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            errors,
            message: 'Validation failed. Please check your inputs.',
        };
    }

    return {
        success: true,
        errors: {},
        message: 'Message sent successfully! (Simulated)',
    };
}

function SubmitButton({ isPending }: { isPending: boolean }) {
    return (
        <button
            type="submit"
            disabled={isPending}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all transform active:scale-[0.98] ${isPending
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
                }`}
        >
            {isPending ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                </span>
            ) : (
                'Send Message'
            )}
        </button>
    );
}

export default function ServerActionsPage() {
    const [state, setState] = useState(initialState);
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsPending(true);
        const formData = new FormData(event.currentTarget);
        const newState = await mockSubmitContactForm(state, formData);
        setState(newState);
        setIsPending(false);
        if (newState.success) {
            (event.target as HTMLFormElement).reset();
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex items-center gap-4">
                <Link
                    href="/features/next"
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                >
                    ← Back
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Server Actions</h1>
                    <p className="text-slate-600">Form handling with built-in loading states and validation.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="you@example.com"
                                className={`w-full px-4 py-3 rounded-lg border ${state?.errors?.email ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-indigo-100'
                                    } focus:outline-none focus:ring-4 transition-all`}
                            />
                            {state?.errors?.email && (
                                <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={4}
                                placeholder="Tell us about your project..."
                                className={`w-full px-4 py-3 rounded-lg border ${state?.errors?.message ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-indigo-100'
                                    } focus:outline-none focus:ring-4 transition-all resize-none`}
                            />
                            {state?.errors?.message && (
                                <p className="mt-1 text-sm text-red-600">{state.errors.message[0]}</p>
                            )}
                        </div>

                        {state?.message && (
                            <div className={`p-4 rounded-lg ${state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {state.message}
                            </div>
                        )}

                        <SubmitButton isPending={isPending} />
                    </form>
                </div>

                <div className="space-y-8">
                    <div className="bg-indigo-900 text-indigo-50 p-6 rounded-xl shadow-inner">
                        <h3 className="font-bold text-lg mb-4 text-white">Why Server Actions?</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex gap-3">
                                <span className="bg-indigo-500/30 p-1 rounded h-fit">🚀</span>
                                <div>
                                    <strong className="block text-white">Progressive Enhancement</strong>
                                    Forms work even before JavaScript loads (if configured correctly), but hydrate to provide rich interactivity.
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="bg-indigo-500/30 p-1 rounded h-fit">🔒</span>
                                <div>
                                    <strong className="block text-white">Type Safety</strong>
                                    Seamlessly share types between client and server code without API glue layers.
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="bg-indigo-500/30 p-1 rounded h-fit">⚡</span>
                                <div>
                                    <strong className="block text-white">Reduced Bundle Size</strong>
                                    Validation logic (like Zod schemas) stays on the server, keeping your client bundle small.
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <h4 className="font-semibold text-slate-800 mb-2 code-font">Static Export Simulation</h4>
                        <p className="text-sm text-slate-600 mb-4">
                            Since this site is hosted on GitHub Pages (Static Export), we use client-side logical to simulate the behavior of Server Actions, including validation delay and state management.
                        </p>
                        <code className="block bg-white p-3 rounded border border-slate-200 text-xs font-mono text-slate-700 overflow-x-auto">
                            {'// Simulated Action\nconst [state, setState] = useState(initialState);'}
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
}
