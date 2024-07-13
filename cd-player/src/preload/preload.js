const { contextBridge, ipcRenderer } = require('electron')

// contextBridge.exposeInMainWorld('myAPI', {
//   test: () => { return ipcRenderer.invoke('do-athing')}
// })

contextBridge.exposeInMainWorld('mci', {
  openCd: () => { return ipcRenderer.invoke('open-cd')},
  getTrackCount: () => { return ipcRenderer.invoke('get-track-count')},
  closeCd: () => { return ipcRenderer.invoke('close-cd')}
})