/* eslint-disable */
// @ts-nocheck

import { parentPort } from 'worker_threads';
import mci from 'mci';
parentPort.setMaxListeners(0);

const actions = [
  'openCd', 'getTrackCount', 'closeCd', 'play', 'stop', 'pause', 'resume',
  'getCurrentTrackNumber', 'getTrackLength', 'getCurrentPosition', 'getDriveLetters',
  'isCdInserted', 'ejectCd'
];

parentPort.on('message', async ({ action, args }) => {
  if (actions.includes(action)) {
    try {
      const result = await mci[action](...args);
      parentPort.postMessage({ resultType: action, result, error: null });
    } catch (error) {
      parentPort.postMessage({ resultType: action, result: null, error });
    }
  } else {
    parentPort.postMessage({ resultType: 'unknown' });
  }
});