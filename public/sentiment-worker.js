
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js';

// Skip local model checks - load from CDN (Hugging Face)
env.allowLocalModels = false;
env.useBrowserCache = true;

class PipelineSingleton {
    static task = 'text-classification';
    // Switching to a model known to be public and 3-class (Pos, Neu, Neg)
    // 'Xenova/distilbert-base-multilingual-cased-sentiments-student'
    static model = 'Xenova/distilbert-base-multilingual-cased-sentiments-student';
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

self.addEventListener('message', async (event) => {
    try {
        // Handle init/warmup
        if (event.data.type === 'init' || event.data.text === 'warmup') {
            await PipelineSingleton.getInstance(x => self.postMessage(x));
            self.postMessage({ status: 'ready', output: [] });
            return;
        }

        const classifier = await PipelineSingleton.getInstance();

        // This model returns 'positive', 'neutral', 'negative' labels usually.
        // We get top 3 to see probability distribution.
        const output = await classifier(event.data.text, { topk: 3 });

        self.postMessage({
            status: 'complete',
            output: output,
        });
    } catch (e) {
        self.postMessage({ status: 'error', error: e.toString() });
    }
});
