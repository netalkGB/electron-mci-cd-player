/* eslint-disable */
// @ts-nocheck

import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import * as cdp from './cdp'
import { fileURLToPath } from 'url'
import {toCamelCase} from "../common/util/StringUtil.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const createWindow = () => {
  const win = new BrowserWindow({
    width: 530,
    height: 80,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'preload.mjs'),
      contextIsolation: true,
      // enableRemoteModule: false,
      nodeIntegration: false
    }
  })
  win.setMenuBarVisibility(true)

  const cdPlayerActions = [
    'open-cd', 'get-track-count', 'close-cd', 'play', 'stop', 'get-current-position',
    'get-track-length', 'get-current-track-number', 'pause', 'resume', 'get-drive-letters',
    'is-cd-inserted', 'eject-cd'
  ];

  cdPlayerActions.forEach(action => {
    const camelCaseAction = toCamelCase(action);
    ipcMain.handle(action, (event, ...args) => {
      return new Promise((resolve, reject) => {
        cdp[camelCaseAction](...args)
          .then((r) => { resolve(r); })
          .catch((e) => { reject(e); });
      });
    });
  });

  return win
}

app.whenReady().then(() => {
  cdp.startWorker()
  const win = createWindow()

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile('dist/index.html');
  }
})
