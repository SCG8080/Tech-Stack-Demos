
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js';

env.allowLocalModels = false;
env.useBrowserCache = true;

// 1. WHISPER (Speech to Text)
class TranscriberSingleton {
    static task = 'automatic-speech-recognition';
    static model = 'Xenova/whisper-tiny.en';
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
        const { type, audio } = event.data;

        if (type === 'init') {
            await TranscriberSingleton.getInstance(x => self.postMessage(x));
            self.postMessage({ status: 'ready' });
            return;
        }

        if (type === 'transcribe') {
            const transcriber = await TranscriberSingleton.getInstance();

            // Enable chunking (stride) for long audio and increase max tokens
            const output = await transcriber(audio, {
                chunk_length_s: 30, // Processes in 30s chunks
                stride_length_s: 5, // 5s overlap to prevent cut words
                max_new_tokens: 1024, // Allow long generation
            });

            // Filter out common hallucinations on silence
            let text = output.text.trim();
            if (text.toLowerCase() === 'you') text = '';

            self.postMessage({
                status: 'complete',
                output: { text }
            });
        }

    } catch (e) {
        self.postMessage({ status: 'error', error: e.toString() });
    }
});
