import type { PathLike } from "node:fs";
import { readFile } from "node:fs/promises";


export async function loadEnv(filePath : PathLike) 
{
 
    const envFile = await readFile(filePath, {encoding : 'utf-8'});
   

    const entries = envFile.split(/\r?\n/);

    entries.forEach((entry) => {
        const pair = entry.split("=");
      
       if (pair.length === 2 && pair[0]) {
       process.env[pair[0]] = pair[1];

       }
    })

    console.log(entries.length ,'environment variables were injected properly');

}

/**
 * USAGE
 * const ENV_URL = 'ABSOLUTE/ENV/PATH';

 * loadEnv(ENV_URL).catch((err) => { console.log("error loading env variables \n" , err); process.exit(1)})
 */
