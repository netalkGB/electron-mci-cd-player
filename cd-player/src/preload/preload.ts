import { mapMethodAndIpc } from './PreloadHelper.ts'
import { contextBridge, ipcRenderer } from 'electron'

declare global {
  interface Window {
    mci: {
      getDriveLetters: () => Promise<string[]>;
      openCd: (driveLetter: string) => Promise<void>;
      closeCd: () => Promise<void>;
      play: (trackNumber?: number) => Promise<void>;
      stop: () => Promise<void>;
      pause: () => Promise<void>;
      resume: () => Promise<void>;
      isCdInserted: (driveLetter: string) => Promise<boolean>;
      ejectCd: (driveLetter: string) => Promise<void>;
      getTrackCount: () => Promise<number>;
      getTrackLength: (trackNumber: number) => Promise<number>;
      getCurrentPosition: () => Promise<number>;
      getCurrentTrackNumber: () => Promise<number>;
    };
    electron: {
      minimize: () => (void);
      close: () => (void);
      toggleCompactMode: () => (void);
      showBrowserWindow: () => (void);
      showMenu: () => (void);
    };
    electronHandler: {
      onWindowBlur: (callback: () => void) => void;
      onWindowFocus: (callback: () => void) => void;
    };
  }
}

mapMethodAndIpc('mci', [
  { ipcChannel: 'open-cd', methodName: 'openCd' },
  { ipcChannel: 'get-track-count', methodName: 'getTrackCount' },
  { ipcChannel: 'close-cd', methodName: 'closeCd' },
  { ipcChannel: 'play', methodName: 'play' },
  { ipcChannel: 'stop', methodName: 'stop' },
  { ipcChannel: 'get-current-position', methodName: 'getCurrentPosition' },
  { ipcChannel: 'get-track-length', methodName: 'getTrackLength' },
  { ipcChannel: 'get-current-track-number', methodName: 'getCurrentTrackNumber' },
  { ipcChannel: 'pause', methodName: 'pause' },
  { ipcChannel: 'resume', methodName: 'resume' },
  { ipcChannel: 'get-drive-letters', methodName: 'getDriveLetters' },
  { ipcChannel: 'is-cd-inserted', methodName: 'isCdInserted' },
  { ipcChannel: 'eject-cd', methodName: 'ejectCd' }
])

mapMethodAndIpc('electron', [
  { ipcChannel: 'minimize', methodName: 'minimize' },
  { ipcChannel: 'close', methodName: 'close' },
  { ipcChannel: 'toggle-compact-mode', methodName: 'toggleCompactMode' },
  { ipcChannel: 'show-browser-window', methodName: 'showBrowserWindow' },
  { ipcChannel: 'show-menu', methodName: 'showMenu' }
])
contextBridge.exposeInMainWorld('electronHandler', {
  onWindowBlur: (callback: () => void): void => {
    ipcRenderer.on('window-blur', callback)
  },
  onWindowFocus: (callback: () => void): void => {
    ipcRenderer.on('window-focus', callback)
  },
})
