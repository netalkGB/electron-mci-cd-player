import { contextBridge, ipcRenderer } from 'electron';
import {toCamelCase} from "../common/util/StringUtil.ts";

const actions: { [key: string]: { args: { name: string, type: string }[] } } = {
  'open-cd': { args: [{ name: 'driveLetter', type: 'string' }] },
  'get-track-count': { args: [] },
  'close-cd': { args: [] },
  'play': { args: [{ name: 'track', type: 'number' }] },
  'stop': { args: [] },
  'get-current-position': { args: [] },
  'get-track-length': { args: [{ name: 'track', type: 'number' }] },
  'get-current-track-number': { args: [] },
  'pause': { args: [] },
  'resume': { args: [] },
  'get-drive-letters': { args: [] },
  'is-cd-inserted': { args: [{ name: 'driveLetter', type: 'string' }] },
  'eject-cd': { args: [{ name: 'driveLetter', type: 'string' }] }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const mci: { [key: string]: (...args: any[]) => Promise<any> } = {};
Object.keys(actions).forEach(action => {
  mci[toCamelCase(action)] = (...args: any[]) => ipcRenderer.invoke(action, ...args);
});
/* eslint-enable @typescript-eslint/no-explicit-any */

contextBridge.exposeInMainWorld('mci', mci);