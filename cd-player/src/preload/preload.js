const { contextBridge, ipcRenderer } = require('electron')

// contextBridge.exposeInMainWorld('myAPI', {
//   test: () => { return ipcRenderer.invoke('do-athing')}
// })

contextBridge.exposeInMainWorld('mci', {
  openCd: () => { return ipcRenderer.invoke('open-cd')},
  getTrackCount: () => { return ipcRenderer.invoke('get-track-count')},
  closeCd: () => { return ipcRenderer.invoke('close-cd')},
  play: (track) => { return ipcRenderer.invoke('play', track)},
  stop: () => { return ipcRenderer.invoke('stop')},
  getCurrentPosition: () => { return ipcRenderer.invoke('get-current-position')},
  getTrackLength: (track) => { return ipcRenderer.invoke('get-track-length', track)},
  getCurrentTrackNumber: () => { return ipcRenderer.invoke('get-current-track-number')},
  pause: () => { return ipcRenderer.invoke('pause')},
  resume: () => { return ipcRenderer.invoke('resume')},
})