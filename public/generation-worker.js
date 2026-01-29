
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js';

env.allowLocalModels = false;
env.useBrowserCache = true;

class GeneratorSingleton {
    static task = 'text-generation';
    static model = 'Xenova/gpt2'; // 124M params (Balanced: ~120MB)
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
        const { type, text } = event.data;

        if (type === 'init') {
            await GeneratorSingleton.getInstance(x => self.postMessage(x));
            self.postMessage({ status: 'ready' });
            return;
        }

        if (type === 'generate') {
            const generator = await GeneratorSingleton.getInstance();

            // Generate continuation
            const output = await generator(text, {
                max_new_tokens: 5,         // Shorter = more accurate autocomplete
                do_sample: true,           // Allow variety
                top_k: 5,                  // Restrict to top 5 likely words
                temperature: 0.8,          // Balanced creativity
                repetition_penalty: 1.2    // Reduce loops
            });

            // DistilGPT2 returns the whole sequence. We need to extract the *new* part.
            const generatedText = output[0].generated_text;
            const newText = generatedText.slice(text.length);

            self.postMessage({
                status: 'complete',
                prediction: newText
            });
        }

    } catch (e) {
        self.postMessage({ status: 'error', error: e.toString() });
    }
});
