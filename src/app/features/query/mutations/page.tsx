'use client';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import TechnicalExplainer from '@/app/components/TechnicalExplainer';

// Mock API
type Todo = {
    id: string;
    text: string;
    completed: boolean;
};

// Initial data
const initialTodos: Todo[] = [
    { id: '1', text: 'Learn React Query', completed: true },
    { id: '2', text: 'Implement Mutations', completed: false },
];

// Shared in-memory "database" roughly simulated
let dbTodos = [...initialTodos];

// Delay for effect
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchTodos = async (): Promise<Todo[]> => {
    await delay(800);
    return [...dbTodos];
};

const addTodo = async (text: string): Promise<Todo> => {
    await delay(800);
    const newTodo = { id: Math.random().toString(36).substring(7), text, completed: false };
    dbTodos = [...dbTodos, newTodo];
    return newTodo;
};

export default function MutationsPage() {
    const [text, setText] = useState('');
    const queryClient = useQueryClient();

    const { data: todos, isLoading } = useQuery({
        queryKey: ['todos'],
        queryFn: fetchTodos,
    });

    const mutation = useMutation({
        mutationFn: addTodo,
        onMutate: async (newText) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['todos'] });

            // Snapshot the previous value
            const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

            // Optimistically update to the new value
            queryClient.setQueryData<Todo[]>(['todos'], (old) => {
                return old ? [...old, { id: 'temp-' + Date.now(), text: newText, completed: false }] : [];
            });

            // Return a context object with the snapshotted value
            return { previousTodos };
        },
        onError: (err, newTodo, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousTodos) {
                queryClient.setQueryData(['todos'], context.previousTodos);
            }
        },
        onSettled: () => {
            // Always refetch after error or success:
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            setText('');
        },
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            mutation.mutate(text);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex items-center gap-4">
                <Link
                    href="/features/query"
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                >
                    ← Back
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Mutations & Optimistic UI</h1>
                    <p className="text-slate-600">Handling data updates with automatic retry, rollbacks, and optimistic updates.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg space-y-6">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Add a new todo..."
                            disabled={mutation.isPending}
                            className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-300 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!text.trim() || mutation.isPending}
                            className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                            Add
                        </button>
                    </form>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-slate-800">Todo List</h3>
                        {isLoading ? (
                            <div className="space-y-3 animate-pulse">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-12 bg-slate-100 rounded-lg"></div>
                                ))}
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {todos?.map((todo) => (
                                    <li
                                        key={todo.id}
                                        className={`flex items-center p-3 rounded-lg border ${todo.id.startsWith('temp-')
                                            ? 'bg-emerald-50 border-emerald-200 opacity-70'
                                            : 'bg-slate-50 border-slate-200'
                                            } transition-all`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${todo.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
                                            }`}>
                                            {todo.completed && <span className="text-white text-xs">✓</span>}
                                        </div>
                                        <span className={todo.completed ? 'text-slate-400 line-through' : 'text-slate-700'}>
                                            {todo.text}
                                        </span>
                                        {todo.id.startsWith('temp-') && (
                                            <span className="ml-auto text-xs text-emerald-600 font-medium animate-pulse">
                                                Saving...
                                            </span>
                                        )}
                                    </li>
                                ))}
                                {todos?.length === 0 && (
                                    <li className="text-slate-400 text-center py-8">No todos yet. Add one!</li>
                                )}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-emerald-900 text-emerald-50 p-6 rounded-xl shadow-inner">
                        <h3 className="font-bold text-lg mb-4 text-white">How it works (Simple)</h3>
                        <p className="text-sm text-emerald-100 mb-4">
                            Imagine sending a text message. You hit &quot;Send&quot; and it appears in the chat bubble <strong>instantly</strong> (Optimistic Update).
                        </p>
                        <p className="text-sm text-emerald-100">
                            Your phone doesn&apos;t wait for the cell tower to say &quot;Okay, delivered&quot; before showing you the message. It assumes it will work. If it fails (no signal), it shows a red &quot;Retry&quot; icon (Rollback).
                        </p>
                    </div>

                    <TechnicalExplainer
                        title="Optimistic UI Updates"
                        analogy="It&apos;s like writing on a piece of paper before the teacher sees it. You act like it&apos;s done immediately. If the teacher says &apos;Wait, that&apos;s wrong&apos;, you erase it."
                        points={[
                            "Optimistic Update: We force the screen to change immediately so it feels super fast.",
                            "Snapshot: We take a photo of the data BEFORE we change it, just in case we need to undo.",
                            "Rollback: If the server says 'Error!', we put the old data back using the snapshot."
                        ]}
                        codeSnippet={`// 1. Snapshot previous todos
const prev = queryClient.getQueryData(['todos']);

// 2. Optimistically add new todo
queryClient.setQueryData(['todos'], old => [...old, newTodo]);

// 3. If it fails, put 'prev' back!
onError: (err, newTodo, context) => {
  queryClient.setQueryData(['todos'], context.prev);
}`}
                    />
                </div>
            </div>
        </div>
    );
}
