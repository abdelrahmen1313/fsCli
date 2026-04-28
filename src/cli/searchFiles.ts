import { readdirSync, statSync, type PathLike } from "node:fs";
import { sanitizeFilePath } from "../utils/sanitizeFilePath.js";
import { basename, join, resolve } from "node:path";


// recursive search method.
const search = (currentPath: string, remainingDepth: number, query: string): string[] => {
    const files: string[] = [];


    if (remainingDepth <= 0) {
        return files;
    }


    const entries = readdirSync(currentPath, { withFileTypes: true })

    for (const entry of entries) {
        const nextPath = join(currentPath, entry.name);

        if (entry.isFile()) {
            // check it's name against the given query
            if (entry.name.toLowerCase().includes(query.toLowerCase())) {
                files.push(nextPath);
            }
        } else if (entry.isDirectory()) {
            files.push(...search(nextPath, remainingDepth - 1, query));
        }
    }

    return files;
}

// function that finds files inside a path dir, 
// @param sysPath -> system path (similar to working directory concept)
// @param path -> child path inside the sysPath
// @param query -> string : query for case insensitive search (include)
// @depth -> how many sub-directories from the child path to search (default : 6)
export function searchFiles(sysPath : string , path: PathLike, query: string, depth: number = 6): string[] {

    const isValid = sanitizeFilePath(sysPath, path);
    if (!isValid) {
        throw new Error("invalid file path detected");
    }

    const rootPath = resolve(String(path));
    const rootStats = statSync(rootPath);


    if (!rootStats.isDirectory()) {
        console.log(`${basename(rootPath)} is not a directory`);
        return [];
    }

    const results = search(rootPath, depth, query);
    return results;




}

/**
 * USAGE
 * const res = searchFiles(assetsDirPath, assetsDirPath, "Hello");
 */
