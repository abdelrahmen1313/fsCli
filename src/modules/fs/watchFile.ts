

import { watch, type PathLike, type FSWatcher } from "node:fs";


// function for a single file watcher
export function watchFileChange(path: PathLike) {

    const watcher = watch(path, (eventType, fileName) => {
        if (fileName) {
            console.log(`Event: ${eventType} on file: ${fileName}`);
        } else {
            console.log(`Event: ${eventType} (filename not provided by OS)`);
        }
    })

    console.log(`Watching for changes on: ${path}`);

    // Optional: Handle watcher errors
    watcher.on('error', (err) => {
        console.error('Watcher error:', err);
    });

    return watcher;

}

export function loadWatchers(paths: PathLike[], opts?: { debounceMs?: number }) {
    const watchers = new Map<string, FSWatcher>();
    const timers = new Map<string, NodeJS.Timeout>();
    const debounceMs = opts?.debounceMs ?? 150;

    for (const p of paths) {

        const key = String(p);
        if (watchers.has(key)) continue;

        const watcher = watch(p, { encoding: 'utf-8' }, (eventType, fileName) => {
            const name = fileName ?? 'unknown';
            const prev = timers.get(key);
            if (prev) clearTimeout(prev);

            const t = setTimeout(() => {
                console.log(`[watch] ${key} -> ${eventType} ${name}`);
                timers.delete(key);
            }, debounceMs);
            timers.set(key, t)
        })

        watcher.on('error', (err) => {
            console.error(`[watch]::[error] ${key}`, err);
        })

        watchers.set(key, watcher);
    }

    return {
        watchers,
        clearWatcher(path: PathLike) {
            if (watchers.has(String(path))) {
                let p = watchers.get(String(path));
                if (p) p.close();
                watchers.delete(path.toString());
                timers.delete(path.toString())
            }
        },
        closeAll() {
            for (const w of watchers.values()) w.close();
            watchers.clear();

            for (const t of timers.values()) clearTimeout(t);
            timers.clear()
        }
    }
}