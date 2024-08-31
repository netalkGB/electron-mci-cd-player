/* eslint-disable */
// @ts-nocheck

import { parentPort } from 'worker_threads';
import mci from 'mci';
parentPort.setMaxListeners(1024);
parentPort.on('message', async ({action, args}) => {
  switch (action) {
    case 'openCd':
      parentPort.postMessage({resultType: 'openCd', result: mci.openCd(...args),  error: null});
      break;
    case 'getTrackCount':
      try {
        parentPort.postMessage({resultType: 'getTrackCount', result: mci.getTrackCount(), error: null});
      } catch (error) {
        parentPort.postMessage({resultType: 'getTrackCount', result: null, error});
      }
      break;
    case 'closeCd':
      parentPort.postMessage({resultType: 'closeCd', result: mci.closeCd(), error: null});
      break;
    case 'play':
      const trackNum = args[0];
      try {
        parentPort.postMessage({resultType: 'play', result: mci.play(trackNum), error: null});
      } catch (error) {
        parentPort.postMessage({resultType: 'play', result: false, error});
      }
      break;
    case 'stop':
      parentPort.postMessage({resultType: 'stop', result: mci.stop(), error: null});
      break;
    case 'pause':
      parentPort.postMessage({resultType: 'pause', result: mci.pause(), error: null});
      break;
    case 'resume':
      parentPort.postMessage({resultType: 'resume', result: mci.resume(), error: null});
      break;
    case 'getCurrentTrackNumber':
      try {
        parentPort.postMessage({resultType: 'getCurrentTrackNumber', result: mci.getCurrentTrackNumber(), error: null});
      } catch (error) {
        parentPort.postMessage({resultType: 'getCurrentTrackNumber', result: null, error});
      }
      break;
    case 'getTrackLength':
      const track = args[0];
      try {
        parentPort.postMessage({resultType: 'getTrackLength', result: mci.getTrackLength(track), error: null});
      } catch (error) {
        parentPort.postMessage({resultType: 'getTrackLength', result: null, error});
      }
      break;
    case 'getCurrentPosition':
      try {
        parentPort.postMessage({resultType: 'getCurrentPosition', result: mci.getCurrentPosition(), error: null});
      } catch (error) {
        parentPort.postMessage({resultType: 'getCurrentPosition', result: null, error});
      }
      break;
    case 'getDriveLetters':
      try {
        parentPort.postMessage({resultType: 'getDriveLetters', result: mci.getDriveLetters(), error: null});
      } catch (error) {
        parentPort.postMessage({resultType: 'getDriveLetters', result: null, error});
      }
      break;
    default:
      parentPort.postMessage({resultType: 'unknown'});
      break;
  }
});
