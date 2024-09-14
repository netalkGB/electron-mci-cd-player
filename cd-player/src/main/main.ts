import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import * as CdPlayer from './CdPlayer.ts'
import { fileURLToPath } from 'url'
import { toCamelCase } from '../common/util/StringUtil.ts'
import { ElectronWindow } from './ElectronWindow.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const createWindow = () => {
  const win = new BrowserWindow({
    width: 240,
    height: 100,
    minWidth: 240,
    minHeight: 100,
    maxWidth: 240,
    maxHeight: 100,
    show: false,
    frame: false,
    maximizable: false,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  })
  win.setMenuBarVisibility(false)

  win.on('blur', () => {
    win.webContents.send('window-blur')
  })
  win.on('focus', () => {
    win.webContents.send('window-focus')
  })

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

  const electronActions = ['minimize', 'close', 'toggle-compact-mode', 'show-browser-window']
  const electronWindow = new ElectronWindow(win)
  electronActions.forEach(action => {
    const camelCaseAction = toCamelCase(action)
    // @ts-expect-error Disabling due to various possible types
    ipcMain.handle(action, (event, ...args) => {
      // @ts-expect-error Disabling due to various possible types
      electronWindow[camelCaseAction](...args)
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
