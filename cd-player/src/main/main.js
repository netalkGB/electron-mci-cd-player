const path = require('node:path')
const { app, BrowserWindow, ipcMain } = require('electron')
const cdp = require('./cdp')
const createWindow = () => {
  const win = new BrowserWindow({
    width: 530,
    height: 80,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    }
  })
  win.setMenuBarVisibility(false)

  ipcMain.handle('open-cd', (event, ...args) => {
    return new Promise((resolve, reject) => {
      cdp.openCd().then((r) => {resolve(r)}).catch((e) => {reject(e)})
    })
  })

  ipcMain.handle('get-track-count', (event, ...args) => {
    return new Promise((resolve, reject) => {
      cdp.getTrackCount().then((r) => {resolve(r)}).catch((e) => {reject(e)})
    })
  })

  ipcMain.handle('close-cd', (event, ...args) => {
    return new Promise((resolve, reject) => {
      cdp.closeCd().then((r) => {resolve(r)}).catch((e) => {reject(e)})
    })
  })

  ipcMain.handle('play', (event, ...args) => {
    return new Promise((resolve, reject) => {
      cdp.play(...args).then((r) => {resolve(r)}).catch((e) => {reject(e)})
    })
  })

  ipcMain.handle('stop', (event, ...args) => {
    return new Promise((resolve, reject) => {
      cdp.stop().then((r) => {resolve(r)}).catch((e) => {reject(e)})
    })
  })


  ipcMain.handle('get-current-position', (event, ...args) => {
    return new Promise((resolve, reject) => {
      cdp.getCurrentPosition().then((r) => {resolve(r)}).catch((e) => {reject(e)})
    })
  })

  ipcMain.handle('get-track-length', (event, ...args) => {
    return new Promise((resolve, reject) => {
      cdp.getTrackLength(...args).then((r) => {resolve(r)}).catch((e) => {reject(e)})
    })
  })

  ipcMain.handle('get-current-track-number', (event, ...args) => {
    return new Promise((resolve, reject) => {
      cdp.getCurrentTrackNumber().then((r) => {resolve(r)}).catch((e) => {reject(e)})
    })
  })

  ipcMain.handle('pause', (event, ...args) => {
    return new Promise((resolve, reject) => {
      cdp.pause().then((r) => {resolve(r)}).catch((e) => {reject(e)})
    })
  })

  ipcMain.handle('resume', (event, ...args) => {
    return new Promise((resolve, reject) => {
      cdp.resume().then((r) => {resolve(r)}).catch((e) => {reject(e)})
    })
  })

  win.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'))
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', async () => {
  await cdp.closeCd()
  if (process.platform !== 'darwin') app.quit()
})


