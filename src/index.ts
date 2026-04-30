#!/usr/bin/env node


import { argv, cwd } from "node:process";
import { searchFiles } from "./cli/searchFiles.js";
import { printDirTree } from "./cli/tree.js";



function printHelp() {
    console.log(`
    *********************************************
     NODEWORK - FILESYSTEM CLI
     @V1.0.0
     ***

     OPEN SOURCE
     PORTABLE FILESYSTEM TOOLS FOR ANY OS.
  
     ********************************************

    `);
    console.log(`Usage:
  fsCli <command> [options]

Commands:
  tree <path> [depth]             Print directory tree at <path> (default depth 5)
  search <path> <query> [depth]   Search files by query like name under <path> 
  help                            Show this help
`);
}

async function main() {
    const args = argv.slice(2);

    if (args.length === 0 || args[0] === "help") {
        printHelp();
        return;
    }

    const cmd = args[0];

    try {
        if (cmd === "tree") {
            const path = args[1] ?? cwd();
            const depth = args[2] ? Number(args[2]) : 5;
            printDirTree(path, depth);
        } else if (cmd === "search") {
            const path = args[1] ?? cwd();
            const query = args[2];
            if (!query) {
                console.error("search requires a <query> argument");
                printHelp();
                return;
            }
            const depth = args[3] ? Number(args[3]) : 6;
            const results = searchFiles(path, path, query, depth);
            if (results.length === 0) {
                console.log("no matches found");
            } else {
                for (const r of results) console.log(r);
            }
        } else {
            console.error("unknown command:", cmd);
            printHelp();
        }
    } catch (err) {
        console.error("error:", err);
    }
}

main();
