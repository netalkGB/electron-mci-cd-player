import { contextBridge, ipcRenderer } from 'electron'

export type Action = { ipcChannel: string, methodName: string }

export const mapMethodAndIpc = (name: string, actions: Action[]) => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const api: { [key: string]: (...args: any[]) => Promise<any> } = {}
  actions.forEach(({ ipcChannel, methodName }) => {
    api[methodName] = (...args: any[]) => ipcRenderer.invoke(ipcChannel, ...args)
  })
  /* eslint-enable @typescript-eslint/no-explicit-any */
  contextBridge.exposeInMainWorld(name, api)
}
