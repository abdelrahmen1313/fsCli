// write-file-safe.js

import { fileURLToPath } from "url";
import { assetsDirPath } from "./constants.js";
import { getFileHash } from "./getFileHash.js";
import path, { dirname } from "path";
import { promises as fsPromises, constants as fsConsts } from "fs";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

// a -> append
// o -> overwrite

interface writeFileSafeOptions {

    method: 'a' | 'o',
    isJson?: boolean,


}

export async function writeFileSafe(filePath: string, content: string, options: writeFileSafeOptions)
//**
// safely write a file into a filesystem -- supporting json validation option
// */
{

    if (!filePath || content.trim().length === 0) 
    {
        throw new Error("Invalid Arguments for writeFileSafe");
    }

    const assetsPath = path.resolve(__dirname, assetsDirPath); // system path
    const safeRelativePath = path.normalize(filePath).replace(/^[\\/]+/, "");

    if (!safeRelativePath || safeRelativePath.endsWith(path.sep)) {
        throw new Error("filePath must point to a file");
    }

    const fullPath = path.resolve(assetsPath, safeRelativePath);
    const relativeFromAssets = path.relative(assetsPath, fullPath);

    // security check
    if (relativeFromAssets.includes("..") || path.isAbsolute(relativeFromAssets)) {
        throw new Error("filePath must stay inside assets directory");
    }

    const parentDirPath = path.dirname(fullPath);
    await fsPromises.mkdir(parentDirPath, { recursive: true });
    const tempDirPath = path.resolve(assetsPath, "temp");
    await fsPromises.mkdir(tempDirPath, { recursive: true });

    const tempFilePath = path.join(
        tempDirPath,
        `write-safe-${Date.now()}-${Math.random().toString(36).slice(2)}.tmp`
    );

    try {

        await fsPromises.writeFile(tempFilePath, content, "utf8");
        const nextContentHash = await getFileHash(tempFilePath);

        let shouldWrite = true;

        try {
            await fsPromises.access(fullPath, fsConsts.W_OK);
            const currentContentHash = await getFileHash(fullPath);
            shouldWrite = currentContentHash !== nextContentHash;
        } catch (err: unknown) {
            const code = (err as NodeJS.ErrnoException)?.code;
            if (code && code !== "ENOENT") {
                throw new Error("No access to target file");
            }
        }

        if (!shouldWrite) {
            return {
                fullPath,
                written: false,
            };
        }

        if (options.isJson) {
            try {
                JSON.parse(content)
            } catch {
                throw new Error("Invalid JSON")
            }
        }

        const method = options.method.trim().toLowerCase();

        if (method === "o") {
            await fsPromises.writeFile(fullPath, content, "utf8");

        } else if (method === "a") {
            await fsPromises.appendFile(fullPath, content, "utf-8")

        }



        return {
            fullPath,
            written: true,
        };
    } finally {
        try {
            await fsPromises.unlink(tempFilePath);
        } catch (err: unknown) {
            const code = (err as NodeJS.ErrnoException)?.code;
            if (code && code !== "ENOENT") {
                throw err;
            }
        }
    }
}

/**
 * USAGE
 * 
 * writeFileSafe("alain.json", '{"name" : "alain", "age" : 13, "role": "kid"}', { method: 'o', isJson: true })
    .then((res) => { console.log(res); process.exit(0) })
    .catch((err) => { console.log(err); process.exit(1) })
 */
