import { execSync } from 'child_process'

try {
  execSync('npm run clean', { stdio: 'inherit' })
  execSync('tsc -b', { stdio: 'inherit' })
  execSync('vite build', { stdio: 'inherit' })
  execSync('electron-builder', { stdio: 'inherit' })
} catch (error) {
  console.error('Build process failed', error)
  // eslint-disable-next-line n/no-process-exit
  process.exit(1)
}
