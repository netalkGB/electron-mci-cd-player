import { execSync } from 'child_process'

try {
  execSync('npm install', { stdio: 'inherit', cwd: './native/mci/' })
  execSync('npx cmake-js rebuild', { stdio: 'inherit', cwd: './native/mci/' })
  execSync('npm install', { stdio: 'inherit', cwd: './cd-player' })
} catch (error) {
  console.error('Build process failed', error)
  // eslint-disable-next-line n/no-process-exit
  process.exit(1)
}
