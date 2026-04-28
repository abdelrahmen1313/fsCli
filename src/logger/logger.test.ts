import { join } from "node:path";
import { Logger } from "./logger.js";
const logsDirPath = 'PATH/TO/LOGS/DIR'


function test() {
    const logger = new Logger(join(logsDirPath, 'mainLog.log'));

    let counter = 0;
    const interval = setInterval(() => {
        logger.log(`This is log entry number ${counter}`);
        counter++;
        if (counter > 55) { 
            clearInterval(interval);
            logger.close();
        }
    }, 1); 

}

