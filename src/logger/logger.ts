import type { PathLike } from "node:fs";
import { createWriteStream, statSync } from "node:fs";
import path from "node:path";


class Logger {

    private basePath: PathLike // initial log file
    private maxSizeBytes: number = 1024 * 1024 // 1 mb
    private currentFilePath: PathLike; // current file path being written to
    private counter: number = 0;
    private stream;


    constructor(filePath: PathLike, maxSize?: number) {
        this.basePath = filePath;
        if (maxSize) { this.maxSizeBytes = maxSize }
        this.currentFilePath = this._getFileName();
        this.stream = this.__createWriteStream(this.currentFilePath);

    
    }

    // Generate file name based on counter
    _getFileName() {
        if (this.counter === 0) {
            return this.basePath;
        }
        const stringPath = this.basePath.toString();
        const ext = path.extname(stringPath);
        const name = path.basename(stringPath, ext);
        const dir = path.dirname(stringPath);
        return path.join(dir, `${name}${this.counter}${ext}`);
    }

    // create new writeable stream
    __createWriteStream(filePath: PathLike) {
        mkdirSync(path.dirname(filePath.toString()), { recursive: true });
        const stream = createWriteStream(filePath, { flags: 'a' });
        stream.on('error', (err) => {
            console.error(`Logger stream error: ${err.message}`);
        });
        return stream;
    }

    // Get current file size
    _getFileSize(filePath: PathLike) {
        try {
            return statSync(filePath).size;
        } catch (err: unknown) {
            const code = (err as NodeJS.ErrnoException)?.code;
            if (code === 'ENOENT') {
                console.log("file not found")
                return 0;
            }
            throw err;
        }
    }

    // rotate log file
    __rotate() {
        console.log(`Rotating log file: ${this.currentFilePath}`);
        this.stream.end(); // Close current stream
        this.counter++;
        this.currentFilePath = this._getFileName();
        this.stream = this.__createWriteStream(this.currentFilePath);
    }

    private __write(message: string) {
        const logEntry = `${new Date().toISOString()} - ${message}\n`;
        this.stream.write(logEntry, 'utf8', () => {
            const size = this._getFileSize(this.currentFilePath);
            if (size >= this.maxSizeBytes) {
                this.__rotate();
            }
        });
    }

    // Write log entry
    log(message: string) {
        this.__write(message);
    }

    writeBatch(messages: string[]) {
        if (messages.length === 0) {
            return;
        }

        const chunk = messages.map((message) => `${message}\n`).join("");
        this.stream.write(chunk, 'utf8', () => {
            const size = this._getFileSize(this.currentFilePath);
            if (size >= this.maxSizeBytes) {
                this.__rotate();
            }
        });
    }

    // Close logger
    close() {
        this.stream.end();
    }


}
