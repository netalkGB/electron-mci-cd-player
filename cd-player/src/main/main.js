const path = require('node:path')
const { app, BrowserWindow, ipcMain } = require('electron')
const mci = require('mci')
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    }
  })

  ipcMain.handle('open-cd', (event, ...args) => {
    return new Promise((resolve, reject) => {
      try {
        resolve(mci.openCd())
      } catch(e) {
        reject(e)
      }
    })
  })

  ipcMain.handle('get-track-count', (event, ...args) => {
    return new Promise((resolve, reject) => {
      try {
        resolve(mci.getTrackCount())
      } catch(e) {
        reject(e)
      }
    })
  })

  ipcMain.handle('close-cd', (event, ...args) => {
    return new Promise((resolve, reject) => {
      try {
        resolve(mci.closeCd())
      } catch(e) {
        reject(e)
      }
    })
  })

  win.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'))
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  mci.closeCd()
  if (process.platform !== 'darwin') app.quit()
})


