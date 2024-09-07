import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import * as CdPlayer from './CdPlayer.ts'
import { fileURLToPath } from 'url'
import { toCamelCase } from '../common/util/StringUtil.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const createWindow = () => {
  const win = new BrowserWindow({
    width: 530,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'preload.mjs'),
      contextIsolation: true,
      // enableRemoteModule: false,
      nodeIntegration: false
    }
  })
  win.setMenuBarVisibility(false)

  const cdPlayerActions = [
    'open-cd', 'get-track-count', 'close-cd', 'play', 'stop', 'get-current-position',
    'get-track-length', 'get-current-track-number', 'pause', 'resume', 'get-drive-letters',
    'is-cd-inserted', 'eject-cd'
  ]

  cdPlayerActions.forEach(action => {
    const camelCaseAction = toCamelCase(action)
    // @ts-expect-error Disabling due to various possible types
    ipcMain.handle(action, (event, ...args) => {
      return new Promise((resolve, reject) => {
        // @ts-expect-error Disabling due to various possible types
        CdPlayer[camelCaseAction](...args)
          // @ts-expect-error Disabling due to various possible types
          .then((r) => { resolve(r) })
          // @ts-expect-error Disabling due to various possible types
          .catch((e) => { reject(e) })
      })
    })
  })

  return win
}

app.whenReady().then(() => {
  CdPlayer.startWorker()
  const win = createWindow()

  if (process.env.VITE_DEV_SERVER_URL) {
    win.webContents.openDevTools()
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile('dist/index.html')
  }
})
