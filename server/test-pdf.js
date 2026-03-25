import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');
import fs from 'fs';

async function test() {
    try {
        // Just a dummy buffer or point to a real file if I had one
        // But let's just check if we can instantiate it
        const parser = new PDFParse({ data: Buffer.from('%PDF-1.4...') });
        console.log('Parser instantiated');
        console.log('getText:', typeof parser.getText);
    } catch (e) {
        console.log('Error:', e);
    }
}
test();
