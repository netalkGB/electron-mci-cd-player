/* eslint-disable */
// @ts-nocheck

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('mci', {
    openCd: (driveLetter: string) => {ipcRenderer.invoke('open-cd', driveLetter)},
    getTrackCount: () => { return ipcRenderer.invoke('get-track-count')},
    closeCd: () => { return ipcRenderer.invoke('close-cd')},
    play: (track) => { return ipcRenderer.invoke('play', track)},
    stop: () => { return ipcRenderer.invoke('stop')},
    getCurrentPosition: () => { return ipcRenderer.invoke('get-current-position')},
    getTrackLength: (track) => { return ipcRenderer.invoke('get-track-length', track)},
    getCurrentTrackNumber: () => { return ipcRenderer.invoke('get-current-track-number')},
    pause: () => { return ipcRenderer.invoke('pause')},
    resume: () => { return ipcRenderer.invoke('resume')},
    getDriveLetters: () => { return ipcRenderer.invoke('get-drive-letters')},
    isCdInserted: (...args) => { return ipcRenderer.invoke('is-cd-inserted', ...args)},
    ejectCd: (driveLetter) => { return ipcRenderer.invoke('eject-cd', driveLetter)},
})