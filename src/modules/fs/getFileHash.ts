// file-hash.ts

import fs from "node:fs";
import crypto from "node:crypto";
import { finished } from "node:stream/promises";



/**
 * Generates a file hash from a given file path using specified algorithm
 * @param {string} filePath
 * @param {string} algorithm - default 'sha256'
 * @returns {Promise<string>} - hexadecimal hash value
 */
export async function getFileHash(filePath: string, algorithm: string = "sha256"): Promise<string> {
    
    try {
        await fs.promises.access(filePath, fs.constants.R_OK);
    } catch {
        throw new Error(`File not found or not readable: ${filePath}`);
    }

    const hash = crypto.createHash(algorithm);
    const stream = fs.createReadStream(filePath);

    stream.on("data", (chunk) => hash.update(chunk));
    await finished(stream);

    return hash.digest("hex");
}

/*
// usage
getFileHash('config.json')
  .then((hash) => {console.log("HASH//", hash); process.exit(0)})
  .catch((err) => {console.log("error at getting file hash", err); process.exit(1)})
  */