import './App.css'
import Main from './component/Main.tsx'
import { Suspense, useEffect } from 'react'

export default function App () {
  useEffect(() => {
    window.electron.showBrowserWindow()
  }, [])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Main />
    </Suspense>
  )
}
