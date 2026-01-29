
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js';

env.allowLocalModels = false;
env.useBrowserCache = true;

class ClassifierSingleton {
    static task = 'zero-shot-classification';
    // Using a smaller, faster model compatible with zero-shot
    static model = 'Xenova/mobilebert-uncased-mnli';
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
        const { type, text, labels } = event.data;

        if (type === 'init') {
            await ClassifierSingleton.getInstance(x => self.postMessage(x));
            self.postMessage({ status: 'ready' });
            return;
        }

        if (type === 'classify') {
            const classifier = await ClassifierSingleton.getInstance();

            // "labels" are potential categories provided by the user (Zero-Shot magic)
            const output = await classifier(text, labels, { multi_label: true });

            self.postMessage({
                status: 'complete',
                output: output
            });
        }

    } catch (e) {
        self.postMessage({ status: 'error', error: e.toString() });
    }
});
