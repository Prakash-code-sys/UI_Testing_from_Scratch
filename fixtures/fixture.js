
import { test as base, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

export const test = base.extend({
    context: async ({ context }, use, testInfo) => {
        await use(context);

        const page = context.pages()[0];
        const video = page?.video();

        if (video) {
            const timestamp = new Date()
                .toISOString()
                .replace(/[-:T]/g, '')
                .slice(0, 15);

            const safeTitle = testInfo.title
                .replace(/[^a-z0-9]/gi, '_');

            const directory = path.resolve('recordings');

            await fs.mkdir(directory, { recursive: true });

            const filename =
                `${safeTitle}_${timestamp}.webm`;

            await video.saveAs(
                path.join(directory, filename)
            );

            console.log(`Recording saved: ${filename}`);
        }
    }
});

export { expect };

