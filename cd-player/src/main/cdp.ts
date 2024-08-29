/* eslint-disable */
// @ts-nocheck

import { Worker } from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let worker: Worker;

const removeListener = (listener: (message: { resultType: string, error: any, result: any }) => void): void => {
    worker.removeListener('message', listener);
}

export const startWorker = (): void => {
  worker = new Worker(path.join(__dirname, 'worker', 'cdpWorker.js'));
  worker.setMaxListeners(1024);
}

export const openCd = (): Promise<any> => {
    worker = new Worker(path.join(__dirname, 'worker', 'cdpWorker.js'));
    worker.setMaxListeners(1024);

    return new Promise((resolve, reject) => {
        const listener = ({ resultType, error, result }: { resultType: string, error: any, result: any }) => {
            if (resultType !== 'openCd') {
                return;
            }
            removeListener(listener);
            resolve(result);
        }
        worker.on('message', listener);
        worker.postMessage({ action: 'openCd' });
    });
}

export const getTrackCount = (): Promise<any> => (
    new Promise((resolve, reject) => {
        const listener = ({ resultType, error, result }: { resultType: string, error: any, result: any }) => {
            if (resultType !== 'getTrackCount') {
                return;
            }
            removeListener(listener);
            if (error !== null) {
                reject(error);
                return;
            }
            resolve(result);
        }
        worker.on('message', listener);
        worker.postMessage({ action: 'getTrackCount' });
    })
)

export const closeCd = (): Promise<any> => (
    new Promise((resolve, reject) => {
        const listener = ({ resultType, error, result }: { resultType: string, error: any, result: any }) => {
            if (resultType !== 'closeCd') {
                return;
            }
            removeListener(listener);
            resolve(result);
            worker.terminate();
        }
        worker.on('message', listener);
        worker.postMessage({ action: 'closeCd' });
    })
)

export const play = (trackNum: number): Promise<any> => (
    new Promise((resolve, reject) => {
        const listener = ({ resultType, error, result }: { resultType: string, error: any, result: any }) => {
            if (resultType !== 'play') {
                return;
            }
            removeListener(listener);
            if (error !== null) {
                reject(error);
                return;
            }
            resolve(result);
        }
        worker.on('message', listener);
        worker.postMessage({ action: 'play', args: [trackNum] });
    })
)

export const stop = (): Promise<any> => (
    new Promise((resolve, reject) => {
        const listener = ({ resultType, error, result }: { resultType: string, error: any, result: any }) => {
            if (resultType !== 'stop') {
                return;
            }
            removeListener(listener);
            resolve(result);
        }
        worker.on('message', listener);
        worker.postMessage({ action: 'stop' });
    })
)

export const pause = (): Promise<any> => (
    new Promise((resolve, reject) => {
        const listener = ({ resultType, error, result }: { resultType: string, error: any, result: any }) => {
            if (resultType !== 'pause') {
                return;
            }
            removeListener(listener);
            resolve(result);
        }
        worker.on('message', listener);
        worker.postMessage({ action: 'pause' });
    })
)

export const resume = (): Promise<any> => (
    new Promise((resolve, reject) => {
        const listener = ({ resultType, error, result }: { resultType: string, error: any, result: any }) => {
            if (resultType !== 'resume') {
                return;
            }
            removeListener(listener);
            resolve(result);
        }
        worker.on('message', listener);
        worker.postMessage({ action: 'resume' });
    })
)

export const getCurrentTrackNumber = (): Promise<any> => (
    new Promise((resolve, reject) => {
        const listener = ({ resultType, error, result }: { resultType: string, error: any, result: any }) => {
            if (resultType !== 'getCurrentTrackNumber') {
                return;
            }
            removeListener(listener);
            if (error !== null) {
                reject(error);
                return;
            }
            resolve(result);
        }
        worker.on('message', listener);
        worker.postMessage({ action: 'getCurrentTrackNumber' });
    })
)

export const getTrackLength = (track: number): Promise<any> => (
    new Promise((resolve, reject) => {
        const listener = ({ resultType, error, result }: { resultType: string, error: any, result: any }) => {
            if (resultType !== 'getTrackLength') {
                return;
            }
            removeListener(listener);
            if (error !== null) {
                reject(error);
                return;
            }
            resolve(result);
        }
        worker.on('message', listener);
        worker.postMessage({ action: 'getTrackLength', args: [track] });
    })
)

export const getCurrentPosition = (): Promise<any> => (
    new Promise((resolve, reject) => {
        const listener = ({ resultType, error, result }: { resultType: string, error: any, result: any }) => {
            if (resultType !== 'getCurrentPosition') {
                return;
            }
            removeListener(listener);
            if (error !== null) {
                reject(error);
                return;
            }
            resolve(result);
        }
        worker.on('message', listener);
        worker.postMessage({ action: 'getCurrentPosition' });
    })
)

export { worker };