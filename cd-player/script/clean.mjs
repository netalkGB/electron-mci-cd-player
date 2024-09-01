import fs from 'fs/promises'

const folders = ['dist', 'dist-electron', 'release']

Promise.all(
  folders.map(folder => fs.rm(folder, { recursive: true, force: true }))
).catch(console.error)
