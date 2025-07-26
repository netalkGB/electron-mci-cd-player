import { Worker } from 'worker_threads'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let worker: Worker

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Message {
  resultType: string;
  error: any;
  result: any;
}

const removeListener = (listener: (message: Message) => void): void => {
  worker.removeListener('message', listener)
}

export const startWorker = (): void => {
  worker = new Worker(path.join(__dirname, 'worker', 'cdpWorker.js'))
  worker.setMaxListeners(0)
}

const createWorkerAction = (action: string) => (...args:any[]): Promise<any> => (
  new Promise((resolve, reject) => {
    const listener = ({ resultType, error, result }: { resultType: string, error: any, result: any }) => {
      if (resultType !== action) {
        return
      }
      removeListener(listener)
      if (error !== null) {
        reject(error)
        return
      }
      resolve(result)
    }
    worker.on('message', listener)
    worker.postMessage({ action, args })
  })
)
/* eslint-enable @typescript-eslint/no-explicit-any */

export const openCd = createWorkerAction('openCd')
export const getTrackCount = createWorkerAction('getTrackCount')
export const closeCd = createWorkerAction('closeCd')
export const play = createWorkerAction('play')
export const stop = createWorkerAction('stop')
export const pause = createWorkerAction('pause')
export const resume = createWorkerAction('resume')
export const getCurrentTrackNumber = createWorkerAction('getCurrentTrackNumber')
export const getTrackLength = createWorkerAction('getTrackLength')
export const getCurrentPosition = createWorkerAction('getCurrentPosition')
export const getDriveLetters = createWorkerAction('getDriveLetters')
export const isCdInserted = createWorkerAction('isCdInserted')
export const ejectCd = createWorkerAction('ejectCd')

export { worker }
