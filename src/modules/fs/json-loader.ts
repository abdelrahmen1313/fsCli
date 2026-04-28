import path, { dirname } from "node:path";
import { assetsDirPath } from "./constants.js";
import { fileURLToPath } from "node:url";
import {promises as fsPromises} from "node:fs"

// Get the current file path
const __filename = fileURLToPath(import.meta.url);

// Get the current directory path
const __dirname = dirname(__filename);

const rel_assets_dir = path.join(__dirname, assetsDirPath);



// dummy default config
const defaultConfig = { default: 1 }

export async function loadJsonConfig(filePath: string) {

    if (path.extname(filePath).toLowerCase() !== '.json') {
        throw new Error('Only .json files are supported.');
    }

    const full_file_path = path.join(rel_assets_dir, filePath);
    if (!full_file_path) {
        throw new Error("file does not exist!!")
    }

    const data = await fsPromises.readFile(full_file_path, 'utf8');

 
    const parsedData = JSON.parse(data);
  
 
    const dataLength = Object.entries(parsedData).length;
    if (dataLength > 1) {
        return parsedData;
    }
   

    return defaultConfig;

}


/**
 * USAGE
 * 
 * loadJsonConfig('config.json')
  .then((data) => {console.log("config file ::\n", data) ;process.exit(0)})
  .catch((err) => {console.log("error at loading json config ::" , err); process.exit(1)})
 */
