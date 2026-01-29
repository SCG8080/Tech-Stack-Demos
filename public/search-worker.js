
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js';

env.allowLocalModels = false;
env.useBrowserCache = true;

// Pre-loaded "Real" Docs (Legacy)
// Initial Knowledge Base is empty - User provided only
const FILES = [];

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

            // 1. Initialize with empty or user-added content (if persisted)
            // For this demo, we start fresh each reload or could load from IndexedDB in future.

            // Just notify ready immediately if empty
            if (knowledgeBase.length === 0) {
                self.postMessage({
                    status: 'ready',
                    count: 0,
                    knowledgeBase: [],
                    message: "Ready to index content."
                });
                return;
            }

            // If we had persisted data, we would index it here.
            // For now, we wait for 'add' events.

            self.postMessage({
                status: 'ready',
                count: knowledgeBase.length,
                knowledgeBase: knowledgeBase
            });
            return;
        }

        if (type === 'add') {
            const { text, url, type: docType } = payload;
            const embedder = await EmbedderSingleton.getInstance();

            // Chunking Strategy (Simple split by double newline or fallback to length)
            const rawChunks = text.split(/\n\s*\n/).filter(c => c.trim().length > 30);

            // If too few chunks (e.g. slight formatting diff), try splitting by single lines
            const chunks = rawChunks.length > 0 ? rawChunks : text.split('\n').filter(c => c.trim().length > 30);

            let currentIdx = knowledgeBase.length; // Start ID from current end

            for (const chunkText of chunks) {
                const id = `dynamic-${Date.now()}-${currentIdx++}`;
                const item = {
                    id,
                    text: chunkText.trim(),
                    sourceId: url,
                    sourceName: url.split('/').pop() || 'Dynamic Source',
                    sourceType: docType || 'Web',
                    fullContent: text
                };

                // Embed
                const output = await embedder(item.text, { pooling: 'mean', normalize: true });

                // Add to Memory
                knowledgeBase.push(item);
                embeddingsCache.push({ ...item, embedding: output.data });

                // Notify Progress (optional, maybe just per chunk or batch)
            }

            self.postMessage({
                status: 'ready',
                count: knowledgeBase.length,
                knowledgeBase: knowledgeBase,
                message: `Indexed ${chunks.length} new segments from ${url}`
            });
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
