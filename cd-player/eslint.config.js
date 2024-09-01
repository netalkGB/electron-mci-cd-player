import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import neostandard, { plugins } from 'neostandard'

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { ignores: ['dist/**', 'dist-electron/**'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  ...neostandard(),
  plugins.n.configs['flat/recommended'],
  { rules: { 'react/react-in-jsx-scope': 'off' } },
  { settings: { react: { version: 'detect' } } }
]
