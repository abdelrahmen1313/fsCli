import type { PathLike } from "node:fs";
import { isAbsolute,  relative, resolve } from "node:path";

import { assetsDirPath } from "../modules/fs/constants.js";

const unallowedExpression = ['..', '%', '$HOME', '%USERPROFILE%', ':streamname', '\0', '%00', '~']

function decodeSafely(input: string): string {
    let decoded = input;

    // Decode a few rounds to catch payloads like %252e%252e (double-encoded "..")
    for (let i = 0; i < input.length; i += 1) {
        try {
            const next = decodeURIComponent(decoded);
            if (next === decoded) {
                break;
            }
            decoded = next;
        } catch {
            break;
        }
    }

    return decoded;
}

export function sanitizeFilePath(safeRoot: string = assetsDirPath, inputPath: PathLike,): boolean {
    try {
        const rawInput = String(inputPath).trim();
        if (!rawInput) {
            return false;
        }

        // Block null-byte tricks in plain and URL-encoded form.
        const decodedInput = decodeSafely(rawInput);
        if (rawInput.includes("\0") || decodedInput.includes("%00") || decodedInput.includes('...')) {
            return false;
        }

        const normalizedInput = decodedInput.replace(/^[/\\]+/, "");

        //const __input = normalize(decodedInput);
        const __input = normalizedInput.replaceAll("/", "///")


        const inputSegments = __input.split("///");


        for (let i = 0; i < inputSegments.length; i++) {
            if (unallowedExpression.includes(inputSegments[i] as string)) {
                return false;
            }
        }



        const safeRootAbsolute = resolve(safeRoot);
        const targetAbsolute = resolve(safeRootAbsolute, normalizedInput);
        const rel = relative(safeRootAbsolute, targetAbsolute);

        // Valid when target is inside safeRoot (or exactly safeRoot itself).
        return rel === "" || (!rel.includes("..") && !isAbsolute(rel));
    } catch {
        return false;
    }
}

