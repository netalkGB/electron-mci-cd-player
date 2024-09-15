import { app, BrowserWindow, dialog, ipcMain, Menu } from 'electron'
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

  let licenseWindow: BrowserWindow | null = null
  function createLicenseWindow (): BrowserWindow {
    const winBounds = win.getBounds()
    const licenseWindow = new BrowserWindow({
      width: 600,
      height: 400,
      x: winBounds.x,
      y: winBounds.y,
      resizable: true,
      title: 'Open Source Licenses',
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
      }
    })
    licenseWindow.setMenuBarVisibility(false)
    if (process.env.VITE_DEV_SERVER_URL) {
      win.webContents.openDevTools()
      licenseWindow.loadURL(`${process.env.VITE_DEV_SERVER_URL}/license.txt`)
    } else {
      licenseWindow.loadFile('dist/license.txt')
    }
    return licenseWindow
  }
  win.on('close', () => {
    if (licenseWindow !== null && !licenseWindow.isDestroyed()) {
      licenseWindow.close()
    }
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

  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox({
              type: 'info',
              title: 'About',
              message: 'Electron MCI CD Player',
              detail: `Version: ${app.getVersion()}\nDeveloped by: gb`,
              buttons: ['OK']
            }).catch(console.error)
          }
        },
        {
          label: 'Open Source Licenses',
          click: () => {
            licenseWindow = createLicenseWindow()
          }
        }
      ]
    }
  ])

  const electronActions = ['minimize', 'close', 'toggle-compact-mode', 'show-browser-window', 'show-menu']
  const electronWindow = new ElectronWindow(win, menu)
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
