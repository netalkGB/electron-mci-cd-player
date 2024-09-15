import { execSync } from 'child_process'

const option = process.argv[2]

try {
  if (option === 'fix') {
    execSync('npm run lint-fix', { stdio: 'inherit', cwd: './cd-player' })
  } else {
    execSync('npm run lint', { stdio: 'inherit', cwd: './cd-player' })
  }
} catch (error) {
  console.error('Build process failed', error)
  // eslint-disable-next-line n/no-process-exit
  process.exit(1)
}
