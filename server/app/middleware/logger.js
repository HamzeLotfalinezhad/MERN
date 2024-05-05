import { format } from 'date-fns'
import { v4 as uuid } from 'uuid'
import { existsSync } from 'fs'
import { promises as fsPromises } from 'fs'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Use fileURLToPath and dirname to get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logEvents = async (message, logFileName) => {
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try {
        if (!existsSync(join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(join(__dirname, '..', 'logs'))
        }
        // await fsPromises.appendFile(join(__dirname, '..', 'logs', logFileName), logItem)
    } catch (err) {
        console.log(err)
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    console.log(`${req.method} ${req.path}`)
    next()
}

export { logEvents, logger }