import { readdirSync, statSync } from "node:fs";
import type { PathLike } from "node:fs";
import { basename, join, resolve } from "node:path";



function printDirTree(path : PathLike, depth : number = 5) {
    try {
        if (depth < 0) {
            return null;
        }
        if (depth > 12) {
            console.log("max depth is 12");
            return null;
        }


        const rootPath = resolve(String(path));
        const rootStats = statSync(rootPath);

        if (!rootStats.isDirectory()) {
            console.log(`${basename(rootPath)} is not a directory`);
            return rootPath;
        }

        console.log(`├── ${basename(rootPath)}`);

        const walk = (currentPath: string, remainingDepth: number, indent: string) => {
            if (remainingDepth <= 0) {
                return;
            }

            const entries = readdirSync(currentPath, { withFileTypes: true })
                .sort((a, b) => {
                    if (a.isDirectory() && !b.isDirectory()) {
                        return -1;
                    }

                    if (!a.isDirectory() && b.isDirectory()) {
                        return 1;
                    }

                    return a.name.localeCompare(b.name);
                });

            for (const entry of entries) {
                const nextPath = join(currentPath, entry.name);

                if (entry.isDirectory()) {
                    console.log(`${indent}├── ${entry.name}`);
                    walk(nextPath, remainingDepth - 1, `${indent}  `);
                } else {
                    console.log(`${indent}${entry.name}`);
                }
            }
        };

        walk(rootPath, depth, "  ");
        return rootPath;

    } catch(err) {
        console.log("error while printing folder tree", err);
        return null;
    }
}
export { printDirTree };