
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js';

env.allowLocalModels = false;
env.useBrowserCache = true;

// Pre-loaded "Real" Docs (Legacy)
const FILES = [
    {
        id: 'nextjs-docs',
        name: 'Next.js_App_Router_Guide.md',
        type: 'Markdown',
        content: `
# Next.js App Router Documentation

## Routing Fundamentals
The App Router uses a file-system based router where folders are used to define routes. 
Each folder represents a route segment that maps to a URL segment. To create a nested route, you can nest folders inside each other.
You can define special files like page.js, layout.js, loading.js, and error.js.

## Server Components
React Server Components (RSC) allow you to write UI that can be rendered and optionally cached on the server.
In Next.js, the rendering work is further split by route segments to enable streaming and partial rendering.
By default, all components in the App Router are Server Components.
        `
    },
    {
        id: 'tanstack-query',
        name: 'TanStack_Query_v5_Docs.pdf',
        type: 'PDF',
        content: `
TanStack Query v5 Documentation

overview:
TanStack Query (FKA React Query) is often described as the missing data-fetching library for web applications, 
but in more technical terms, it makes fetching, caching, synchronizing and updating server state in your web applications a breeze.

Key Concepts:
- Queries: A declarative dependency on an asynchronous source of data that is tied to a unique key.
- Mutations: Used to create/update/delete data or perform server side-effects.
- Query Invalidation: Intelligently mark query data as stale to trigger refetches.
        `
    }
];

// Initialize KB with empty array (populated in init)
let knowledgeBase = [];

/* 
  Removed legacy for-loop initialization. 
  Logic moved to 'init' handler to support async fetching.
*/


class EmbedderSingleton {
    static task = 'feature-extraction';
    static model = 'Xenova/all-MiniLM-L6-v2';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, {
                progress_callback,
                quantized: true
            });
        }
        return this.instance;
    }
}

function cosineSimilarity(a, b) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

let embeddingsCache = [];

self.addEventListener('message', async (event) => {
    try {
        const { type, query, payload } = event.data;

        if (type === 'init') {
            const embedder = await EmbedderSingleton.getInstance(x => self.postMessage(x));

            if (embeddingsCache.length === 0) {
                // 1. Process Static Docs (Legacy)
                for (const file of FILES) {
                    const rawChunks = file.content.split(/\n\s*\n/).filter(c => c.trim().length > 10);
                    rawChunks.forEach((chunkText, idx) => {
                        knowledgeBase.push({
                            id: `${file.id}-chunk-${idx}`,
                            text: chunkText.trim(),
                            sourceId: file.id,
                            sourceName: file.name,
                            sourceType: file.type,
                            fullContent: file.content
                        });
                    });
                }

                // 2. Fetch & Process "Elements of Style" (Static File)
                try {
                    const res = await fetch('/elements-of-style.txt');
                    if (res.ok) {
                        const text = await res.text();
                        const rawChunks = text.split(/\n\s*\n/).filter(c => c.trim().length > 30); // Higher threshold for book
                        rawChunks.forEach((chunkText, idx) => {
                            knowledgeBase.push({
                                id: `eos-chunk-${idx}`,
                                text: chunkText.trim(),
                                sourceId: 'elements-of-style',
                                sourceName: 'The Elements of Style',
                                sourceType: 'Book',
                                fullContent: text
                            });
                        });
                    }
                } catch (e) {
                    console.error("Failed to load Elements of Style", e);
                }

                let i = 0;
                for (const item of knowledgeBase) {
                    i++;
                    if (i % 5 === 0 || i === knowledgeBase.length) {
                        self.postMessage({
                            status: 'indexing',
                            current: i,
                            total: knowledgeBase.length,
                            progress: (i / knowledgeBase.length) * 100
                        });
                    }
                    const output = await embedder(item.text, { pooling: 'mean', normalize: true });
                    embeddingsCache.push({ ...item, embedding: output.data });
                }
            }

            self.postMessage({
                status: 'ready',
                count: knowledgeBase.length,
                knowledgeBase: knowledgeBase
            });
            return;
        }

        // Removed 'add' logic as it's no longer used in this static demo version
        if (type === 'add') {
            // no-op or error
        }

        if (type === 'search') {
            const embedder = await EmbedderSingleton.getInstance();
            const queryEmbedding = await embedder(query, { pooling: 'mean', normalize: true });

            const results = embeddingsCache.map(item => ({
                ...item,
                score: cosineSimilarity(queryEmbedding.data, item.embedding)
            }));

            results.sort((a, b) => b.score - a.score);

            self.postMessage({
                status: 'complete',
                results: results.slice(0, 5)
            });
        }

    } catch (e) {
        self.postMessage({ status: 'error', error: e.toString() });
    }
});
