const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
  test: () => { return ipcRenderer.invoke('do-athing')}
})