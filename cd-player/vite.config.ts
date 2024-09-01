import { rmSync } from 'node:fs'
import { defineConfig } from 'vite'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron/simple'
import checker from 'vite-plugin-checker'
import copy from 'rollup-plugin-copy'

export default defineConfig(({ command }) => {
  rmSync('dist-electron', { recursive: true, force: true })
  const isServe = command === 'serve'

  return {
    resolve: {
      alias: {
        // eslint-disable-next-line no-undef
        '@': path.join(__dirname, 'src')
      },
    },
    plugins: [
      checker({
        typescript: {
          tsconfigPath: './tsconfig.app.json'
        },
        eslint: {
          lintCommand: 'eslint .',
          useFlatConfig: true,
        },
      }),
      react(),
      electron({
        main: {
          entry: 'src/main/main.ts',
          vite: {
            build: {
              sourcemap: isServe,
              outDir: 'dist-electron/main',
              rollupOptions: {
                external: [
                  'mci'
                ],
                plugins: [
                  copy({
                    targets: [
                      { src: 'src/main/worker/*', dest: 'dist-electron/main/worker' }
                    ]
                  })
                ]
              },
            }
          }
        },
        preload: {
          input: 'src/preload/preload.ts',
          vite: {
            build: {
              sourcemap: isServe,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external: [
                  'mci'
                ],
              },
            }
          }
        },
      }),
    ],
  }
})
