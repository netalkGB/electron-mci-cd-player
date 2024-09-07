import { BrowserWindow } from 'electron'

export class ElectronWindow {
  private browserWindow: BrowserWindow
  constructor (browserWindow: BrowserWindow) {
    this.browserWindow = browserWindow
  }

  public minimize () {
    this.browserWindow.minimize()
  }

  public close () {
    this.browserWindow.close()
  }

  public toggleCompactMode () {
    const isCompact = this.browserWindow.getBounds().height <= 100
    if (isCompact) {
      // to big mode
      this.browserWindow.setMinimumSize(240, 240)
      this.browserWindow.setMaximumSize(240, 65535)
      this.browserWindow.setBounds({
        width: 240,
        height: 240,
      })
    } else {
      // to compact mode
      this.browserWindow.setMinimumSize(240, 100)
      this.browserWindow.setMaximumSize(240, 100)
      this.browserWindow.setBounds({
        width: 240,
        height: 100,
      })
    }
  }
}
