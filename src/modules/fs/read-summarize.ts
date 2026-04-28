import { promises as fs } from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'url';
import { assetsDirPath } from './constants.js';

// Get the current file path
const __filename = fileURLToPath(import.meta.url);

// Get the current directory path
const __dirname = dirname(__filename);

const rel_assets_dir = path.join(__dirname, assetsDirPath);




export async function readAndSummarizeFile(filePath: string): Promise<{
    lines: number;
    words: number;
    characters: number;
}> {
    if (path.extname(filePath).toLowerCase() !== '.txt') {
        throw new Error('Only .txt files are supported.');
    }

    const full_file_path = path.join(rel_assets_dir, filePath)

    const content = await fs.readFile(full_file_path, 'utf8');

    // Empty files should report 0 lines and 0 words.
    const lines = content.length === 0 ? 0 : content.split(/\r?\n/).length;
    const words = content.trim().length === 0 ? 0 : content.trim().split(/\s+/).length;
    const characters = content.length;

    return {
        lines,
        words,
        characters,
    };
}

/**
 * USAGE
 * readAndSummarizeFile('hello_world.txt')
    .then((res) => { console.log("SUMMARIZED FILE : \n", res); process.exit(0) })
    .catch((err) => { console.log("error at readAndSummarizeFile ::", err); process.exit(1) })
 * 
 */



