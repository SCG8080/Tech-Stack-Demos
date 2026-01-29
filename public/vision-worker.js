
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js';

env.allowLocalModels = false;
env.useBrowserCache = true;

class ObjectDetectionSingleton {
    static task = 'object-detection';
    static model = 'Xenova/detr-resnet-50';
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
        const { type, image } = event.data; // image is a URL or blob

        if (type === 'init') {
            await ObjectDetectionSingleton.getInstance(x => self.postMessage(x));
            self.postMessage({ status: 'ready' });
            return;
        }

        if (type === 'detect') {
            const detector = await ObjectDetectionSingleton.getInstance();

            // Run detection
            const output = await detector(image, { threshold: 0.5 });

            // Output format: [{ score, label, box: { xmax, xmin, ymax, ymin } }]
            self.postMessage({
                status: 'complete',
                output: output
            });
        }

    } catch (e) {
        self.postMessage({ status: 'error', error: e.toString() });
    }
});
