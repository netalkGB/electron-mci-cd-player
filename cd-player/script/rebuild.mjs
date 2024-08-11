import spawn from 'cross-spawn';
import path from 'path';
const cmakeNativeModulePaths = [
  '../node_modules/mci'
]

cmakeNativeModulePaths.map(nativeModulePath => {
  const mciPath = path.join(__dirname, nativeModulePath);

  const cmakePath = path.join(__dirname, '../node_modules/.bin/cmake-js');

  const cmakeProcess = spawn(cmakePath, ['rebuild'], { cwd: mciPath, stdio: 'inherit' });

  cmakeProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`cmake-js rebuild process exited with code ${code}`);
    } else {
      console.log('cmake-js rebuild process completed successfully.');
    }
  });

  cmakeProcess.on('error', (err) => {
    console.error('Failed to start subprocess.', err);
  });
})
