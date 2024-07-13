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
  ipcMain.handle('do-athing', (event, ...args) => {
    console.log("do-athing")
    return new Promise((resolve, reject) => {
      
      resolve(mci.hello())
    })
  })
  win.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'))
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})


